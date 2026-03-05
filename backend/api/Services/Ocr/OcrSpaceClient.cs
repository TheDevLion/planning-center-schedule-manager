using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;

namespace PlanningCenterScheduleManager.Backend.Services.Ocr;

public sealed class OcrSpaceClient
{
    private const string OcrEndpoint = "https://api.ocr.space/parse/image";
    private const string FormApiKey = "apikey";
    private const string FormLanguage = "language";
    private const string FormIsOverlayRequired = "isOverlayRequired";
    private const string FormEngine = "OCREngine";
    private const string FormFile = "file";

    private static readonly Regex UnsafeStem = new("[^A-Za-z0-9._-]+", RegexOptions.Compiled);

    private readonly HttpClient _httpClient;
    private readonly OcrOptions _options;

    public OcrSpaceClient(HttpClient httpClient, IOptions<OcrOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<string> ExtractTextAsync(byte[] fileBytes, string fileName, CancellationToken cancellationToken)
    {
        var snapshotMode = ResolveSnapshotMode(_options.SnapshotMode);

        if (snapshotMode == "replay")
            return await ReadSnapshotTextAsync(fileName, cancellationToken);

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new OcrSpaceException("OCR API key is not configured");

        var payloadText = await SendOcrRequestAsync(fileBytes, fileName, cancellationToken);
        var payload = JsonSerializer.Deserialize<OcrSpacePayload>(payloadText) ?? new OcrSpacePayload();

        if (payload.IsErroredOnProcessing)
            throw new OcrSpaceException($"OCR.space error: {NormalizeErrorMessage(payload.ErrorMessage)}");

        var text = ExtractParsedText(payload);

        if (snapshotMode == "record")
            await SaveSnapshotTextAsync(fileName, text, cancellationToken);

        return text;
    }

    private async Task<string> SendOcrRequestAsync(byte[] fileBytes, string fileName, CancellationToken cancellationToken)
    {
        using var requestContent = BuildRequestContent(fileBytes, fileName);
        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(_options.TimeoutSeconds));
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeoutCts.Token);

        using var response = await _httpClient.PostAsync(OcrEndpoint, requestContent, linkedCts.Token);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync(linkedCts.Token);
    }

    private MultipartFormDataContent BuildRequestContent(byte[] fileBytes, string fileName)
    {
        var content = new MultipartFormDataContent();
        content.Add(new StringContent(_options.ApiKey), FormApiKey);
        content.Add(new StringContent(_options.Language), FormLanguage);
        content.Add(new StringContent("false"), FormIsOverlayRequired);
        content.Add(new StringContent("2"), FormEngine);

        var fileContent = new ByteArrayContent(fileBytes);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
        content.Add(fileContent, FormFile, fileName);

        return content;
    }

    private static string ExtractParsedText(OcrSpacePayload payload)
    {
        var parts = payload.ParsedResults?
            .Select(result => result.ParsedText?.Trim())
            .Where(text => !string.IsNullOrWhiteSpace(text))
            .Cast<string>()
            .ToList() ?? new List<string>();

        if (parts.Count == 0)
            throw new OcrSpaceException("OCR.space returned empty text");

        return string.Join("\n", parts).Trim();
    }

    private static string ResolveSnapshotMode(string value)
    {
        var normalized = (value ?? string.Empty).Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(normalized) || normalized == "off")
        {
            return "off";
        }

        if (normalized is "record" or "replay")
        {
            return normalized;
        }

        throw new OcrSpaceException("Invalid snapshot mode. Use: off, record, replay.");
    }

    private async Task<string> ReadSnapshotTextAsync(string fileName, CancellationToken cancellationToken)
    {
        var path = ResolveSnapshotPath(fileName, forRecord: false);
        if (!File.Exists(path))
            throw new OcrSpaceException($"OCR snapshot not found at '{path}'. Run once with SnapshotMode=record.");

        return await File.ReadAllTextAsync(path, Encoding.UTF8, cancellationToken);
    }

    private async Task SaveSnapshotTextAsync(string fileName, string text, CancellationToken cancellationToken)
    {
        var path = ResolveSnapshotPath(fileName, forRecord: true);
        var directory = Path.GetDirectoryName(path);
        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        await File.WriteAllTextAsync(path, text, Encoding.UTF8, cancellationToken);
    }

    private string ResolveSnapshotPath(string fileName, bool forRecord)
    {
        var snapshotDir = ResolveSnapshotDirectory(_options.SnapshotDir);
        var stem = SafeStem(Path.GetFileNameWithoutExtension(fileName));

        var namedPath = Path.Combine(snapshotDir, $"{stem}.txt");

        if (forRecord || File.Exists(namedPath))
            return namedPath;

        throw new OcrSpaceException($"OCR snapshot not found. Checked '{namedPath}'. Run once with SnapshotMode=record.");
    }

    private static string ResolveSnapshotDirectory(string configuredSnapshotDir)
    {
        if (Path.IsPathRooted(configuredSnapshotDir))
            return configuredSnapshotDir;

        var currentDirectory = Directory.GetCurrentDirectory();
        var repositoryRoot = FindRepositoryRoot(currentDirectory);
        return Path.GetFullPath(configuredSnapshotDir, repositoryRoot);
    }

    private static string FindRepositoryRoot(string startDirectory)
    {
        var directory = new DirectoryInfo(startDirectory);

        while (directory is not null)
        {
            var hasAssetsDirectory = Directory.Exists(Path.Combine(directory.FullName, "assets"));
            var hasBackendDirectory = Directory.Exists(Path.Combine(directory.FullName, "backend"));

            if (hasAssetsDirectory && hasBackendDirectory)
                return directory.FullName;

            directory = directory.Parent;
        }

        return startDirectory;
    }

    private static string SafeStem(string? rawStem)
    {
        var stem = string.IsNullOrWhiteSpace(rawStem) ? "upload" : rawStem;
        var safe = UnsafeStem.Replace(stem, "_").Trim('.', '_');
        return string.IsNullOrWhiteSpace(safe) ? "upload" : safe;
    }

    private static string NormalizeErrorMessage(JsonElement? errorMessage)
    {
        if (errorMessage is null)
        {
            return "unknown error";
        }

        var value = errorMessage.Value;
        return value.ValueKind switch
        {
            JsonValueKind.Array => string.Join(", ", value.EnumerateArray().Select(item => item.ToString()).Where(item => !string.IsNullOrWhiteSpace(item))),
            JsonValueKind.String => value.GetString() ?? "unknown error",
            _ => value.ToString()
        };
    }

    private sealed class OcrSpacePayload
    {
        public bool IsErroredOnProcessing { get; init; }

        public JsonElement? ErrorMessage { get; init; }

        public List<OcrSpaceResult>? ParsedResults { get; init; }
    }

    private sealed class OcrSpaceResult
    {
        public string? ParsedText { get; init; }
    }
}

