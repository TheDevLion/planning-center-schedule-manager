namespace PlanningCenterScheduleManager.Backend.Services.Ocr;

public sealed class OcrOptions
{
    public const string SectionName = "Ocr";

    public string ApiKey { get; set; } = string.Empty;

    public string Language { get; set; } = "eng";

    // Supported values: off, record, replay
    public string SnapshotMode { get; set; } = "off";

    public string SnapshotDir { get; set; } = "assets/training";

    public int TimeoutSeconds { get; set; } = 30;
}

public sealed class OcrSpaceException : Exception
{
    public OcrSpaceException(string message) : base(message)
    {
    }
}
