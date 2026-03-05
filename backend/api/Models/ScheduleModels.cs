using System.Text.Json.Serialization;

namespace PlanningCenterScheduleManager.Backend.Models;

public record Activity(
    [property: JsonPropertyName("order")] int Order,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("responsible")] string? Responsible,
    [property: JsonPropertyName("duration_raw")] string? DurationRaw
);

public record Schedule(
    [property: JsonPropertyName("activities")] IReadOnlyList<Activity> Activities,
    [property: JsonPropertyName("date")] DateTime? Date = null
);

