using PlanningCenterScheduleManager.Backend.Models;
using PlanningCenterScheduleManager.Backend.Services.Ocr;
using PlanningCenterScheduleManager.Backend.Services.Parsing;
using Microsoft.AspNetCore.Mvc;

namespace PlanningCenterScheduleManager.Backend.Endpoints;

public static class Endpoints
{
    private const string ParseRoute = "/api/file-parse/planning-center-service";
    private const string EmptyFileMessage = "Empty file";

    public static IEndpointRouteBuilder MapScheduleEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost(ParseRoute, ParseFilePlanningCenterServiceAsync)
            .Accepts<ParseFileRequest>("multipart/form-data")
            .Produces<Schedule>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status413PayloadTooLarge)
            .Produces(StatusCodes.Status502BadGateway)
            .WithName("FileParsePlanningCenterService")
            .DisableAntiforgery()
            .WithOpenApi();

        app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

        return app;
    }

    private static async Task<IResult> ParseFilePlanningCenterServiceAsync(
        [FromForm] ParseFileRequest payload,
        OcrSpaceClient ocrClient,
        PlanningCenterServiceParser parser,
        CancellationToken cancellationToken)
    {
        var file = payload.File;

        if (file.Length == 0)
            return Results.BadRequest(new { detail = EmptyFileMessage });

        var fileBytes = await ReadAllBytesAsync(file, cancellationToken);

        string rawText;
        try
        {
            rawText = await ocrClient.ExtractTextAsync(fileBytes, file.FileName ?? "upload", cancellationToken);
        }
        catch (OcrSpaceException ex)
        {
            return Results.Problem(statusCode: StatusCodes.Status502BadGateway, detail: ex.Message);
        }

        var schedule = parser.Parse(rawText);
        return Results.Ok(schedule);
    }

    private static async Task<byte[]> ReadAllBytesAsync(IFormFile file, CancellationToken cancellationToken)
    {
        await using var stream = file.OpenReadStream();
        using var memory = new MemoryStream();
        await stream.CopyToAsync(memory, cancellationToken);
        return memory.ToArray();
    }
}

