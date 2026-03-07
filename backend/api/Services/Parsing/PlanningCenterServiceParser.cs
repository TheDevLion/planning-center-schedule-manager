using PlanningCenterScheduleManager.Backend.Models;
using System.Globalization;
using System.Text.RegularExpressions;

namespace PlanningCenterScheduleManager.Backend.Services.Parsing;

public class PlanningCenterServiceParser
{
    private static readonly string[] IgnoredExactLines =
    [
        "Length",
        "in mins"
    ];

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
            else // Can only start reading activities, responsibles and duration after reading the file date
                continue;

            if (CanLineBeIgnored(line))
                continue;
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

    public bool CanLineBeIgnored(string line)
    {
        // If line in format "03/25" return true
        if (Regex.IsMatch(line, @"^\d{2}/\d{2}$"))
            return true;

        // If line in format "6:30A" || "6:15a" return true
        if (Regex.IsMatch(line, @"^\d{1,2}:\d{2}[Aa]$"))
            return true;

        // If line in format "6:35:28A" || "6:35:28a" return true
        if (Regex.IsMatch(line, @"^\d{1,2}:\d{2}:\d{2}[Aa]$"))
            return true;

        // If line is all equals ("Length", "in mins")
        if (IgnoredExactLines.Any(ignoredLine => string.Equals(line, ignoredLine, StringComparison.OrdinalIgnoreCase)))
            return true;

        return false;
    }
}

