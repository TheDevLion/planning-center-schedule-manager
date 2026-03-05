using PlanningCenterScheduleManager.Backend.Models;
using System.Globalization;

namespace PlanningCenterScheduleManager.Backend.Services.Parsing;

public class PlanningCenterServiceParser
{
    public Schedule Parse(string rawOcrText)
    {
        var splitLines = rawOcrText.Split('\n');

        DateTime? fileDate = null;
        
        for (int i = 0; i < splitLines.Length; i++)
        {
            var line = splitLines[i].Trim();

            // Check file date line
            if (fileDate == null && IsDateLine(line, out var parsedDate))
                fileDate = parsedDate;
        }

        return new Schedule(Array.Empty<Activity>(), fileDate);
    }

    public bool IsDateLine(string dateLineCandidate, out DateTime parsedDate)
    {
        return DateTime.TryParseExact(
            dateLineCandidate,
            "MMMM d, yyyy",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out parsedDate
        );
    }
}

