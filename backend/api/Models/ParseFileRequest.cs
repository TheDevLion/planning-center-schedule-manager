using Microsoft.AspNetCore.Mvc;

namespace PlanningCenterScheduleManager.Backend.Models;

public sealed class ParseFileRequest
{
    [FromForm(Name = "file")]
    public IFormFile File { get; set; } = default!;
}

