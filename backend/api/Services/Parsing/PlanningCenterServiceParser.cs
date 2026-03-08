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
        List<string> durations = new();
        List<string?> responsibles = new();
        List<string> activities = new();
        bool activityHasResponsible = false;
        
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

            // Check Responsibles (Alone in line). There is only one responsible between two activities
            if (!activityHasResponsible && IsResponsibleInLine(line))
            {
                responsibles.Add(line);
                activityHasResponsible = true;
                continue;
            }

            // Check Duration (alone in line or mixed with activity)
            if(LineContainsDuration(line, out var duration))
                durations.Add(line);

            // Check Activity (alone in line or mixed with activity)
            if(LineContainsActivity(line, out var activity))
            {
                activities.Add(activity);

                if (!activityHasResponsible) responsibles.Add(null);
                activityHasResponsible = false;
            }
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

    public bool LineContainsDuration(string line, out string? duration)
    {
        // Match "m:ss" or "mm:ss" when token is isolated by start/end or spaces.
        // Examples: "6:35", " 6:35 ", "Song 6:35 Next".
        var durationMatch = Regex.Match(line, @"(?:^|\s)(?<duration>\d{1,2}:\d{2})(?=\s|$)");
        if (durationMatch.Success)
        {
            duration = durationMatch.Groups["duration"].Value;
            return true;
        }

        duration = null;
        return false;
    }
    public bool IsResponsibleInLine(string line)
    {
        // If line in format "Name Surname" || "Name1/Name2" return true
        if (Regex.IsMatch(line, @"^(?:[\p{L}]+(?:\s+[\p{L}]+)+|[\p{L}]+(?:\s*\/\s*[\p{L}]+)+)$"))
            return true;

        return false;
    }

    public bool LineContainsActivity(string line, out string activity)
    {   
        // Ignore numeric/time prefixes and start from the first word that begins with a letter.
        var firstWordMatch = Regex.Match(line, @"(?:^|[\s])(?<activityStart>[\p{L}][\p{L}\p{M}'’-]*)");
        if (!firstWordMatch.Success)
        {
            activity = string.Empty;
            return false;
        }

        var startIndex = firstWordMatch.Groups["activityStart"].Index;
        var candidate = line[startIndex..];

        if (string.IsNullOrWhiteSpace(candidate))
        {
            activity = string.Empty;
            return false;
        }

        activity = candidate;
        return true;
    }
}

