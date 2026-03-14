using PlanningCenterScheduleManager.Backend.Models;
using System.Globalization;
using System.Text.RegularExpressions;

namespace PlanningCenterScheduleManager.Backend.Services.Parsing;

public class PlanningCenterServiceParser
{
    private static readonly string[] IgnoredExactLines =
    [
        "Length",
        "in mins",
        "Notes"
    ];

    public Schedule Parse(string rawOcrText)
    {
        List<Activity> result = new List<Activity>();
        var splitLines = rawOcrText.Split('\n');

        DateTime? fileDate = null;
        List<string> durations = new();
        List<string?> responsibles = new();
        List<string> activities = new();
        string? pendingAmbiguous = null;
        var previousLineHadDurationOnly = false;

        for (int i = 0; i < splitLines.Length; i++)
        {
            var line = splitLines[i].Trim();

            // Check file date line
            if (fileDate == null && IsDateLine(line, out var parsedDate))
            {
                fileDate = parsedDate;
                continue;
            }
            else if (fileDate == null) // Can only start reading activities, responsibles and duration after reading the file date
                continue;

            if (CanLineBeIgnored(line))
                continue;

            // Check Duration (alone in line or mixed with activity)
            var hasDuration = LineContainsDuration(line, out var duration);
            if (hasDuration && duration != null)
                durations.Add(duration);

            // Check Activity (alone in line or mixed with activity)
            if (!LineContainsActivity(line, out var activityText))
            {
                previousLineHadDurationOnly = hasDuration;
                continue;
            }

            // A duration-only line followed by a short token (e.g., "Light")
            // should prefer activity classification instead of responsible.
            if (previousLineHadDurationOnly)
            {
                if (pendingAmbiguous != null)
                {
                    if (activities.Count > responsibles.Count && IsResponsibleCandidateInLine(pendingAmbiguous))
                        AddResponsibleOrFallbackToActivity(activities, responsibles, pendingAmbiguous);
                    else
                        AddActivity(activities, responsibles, pendingAmbiguous);

                    pendingAmbiguous = null;
                }

                AddActivity(activities, responsibles, activityText);
                previousLineHadDurationOnly = false;
                continue;
            }

            // Dirty lines are always activity (never responsible).
            var isDirtyForResponsible = IsDirtyLineForResponsible(line);

            // Ambiguous line can be either responsible or activity.
            var isAmbiguous = IsResponsibleCandidateInLine(activityText) && !hasDuration && !isDirtyForResponsible;

            // Resolve previous ambiguous line using current line context.
            if (pendingAmbiguous != null)
            {
                // Ambiguous -> ambiguous: only assign pending as responsible when it is a strong responsible candidate.
                if (isAmbiguous && activities.Count > responsibles.Count)
                {
                    if (IsStrongResponsibleCandidateInLine(pendingAmbiguous))
                        AddResponsibleOrFallbackToActivity(activities, responsibles, pendingAmbiguous);
                    else
                        AddActivity(activities, responsibles, pendingAmbiguous);

                    pendingAmbiguous = activityText;
                    continue;
                }

                if (ShouldTreatPendingAsResponsible(activities, responsibles, hasDuration, activityText, pendingAmbiguous))
                    AddResponsibleOrFallbackToActivity(activities, responsibles, pendingAmbiguous);
                else
                    AddActivity(activities, responsibles, pendingAmbiguous);

                pendingAmbiguous = null;
            }

            if (isAmbiguous)
            {
                pendingAmbiguous = activityText;
                continue;
            }

            AddActivity(activities, responsibles, activityText);
            previousLineHadDurationOnly = false;
        }

        // If the stream ended with ambiguity, prefer activity.
        if (pendingAmbiguous != null)
            AddActivity(activities, responsibles, pendingAmbiguous);

        while (responsibles.Count < activities.Count)
            responsibles.Add(null);

        RebalanceAmbiguousActivities(activities, responsibles, durations.Count);
        RebalanceTrailingPhantomActivityAndDuration(activities, responsibles, durations);

        for (int i = 0; i < activities.Count; i++)
        {
            var responsible = i < responsibles.Count ? responsibles[i] : null;
            var durationValue = i < durations.Count ? durations[i] : null;
            result.Add(new Activity(i, activities[i], responsible, durationValue));
        }

        return new Schedule(result, fileDate);
    }

    public void RebalanceAmbiguousActivities(List<string> activities, List<string?> responsibles, int targetActivitiesCount)
    {
        if (targetActivitiesCount <= 0)
            return;

        while (activities.Count > targetActivitiesCount)
        {
            var movedAny = false;

            for (int i = activities.Count - 1; i >= 1; i--)
            {
                var candidate = activities[i];
                var previousResponsible = responsibles[i - 1];

                if (!IsResponsibleCandidateInLine(candidate))
                    continue;

                if (!string.IsNullOrWhiteSpace(previousResponsible))
                    continue;

                responsibles[i - 1] = candidate;
                activities.RemoveAt(i);
                responsibles.RemoveAt(i);
                movedAny = true;
                break;
            }

            if (!movedAny)
                break;
        }
    }

    public void RebalanceTrailingPhantomActivityAndDuration(List<string> activities, List<string?> responsibles, List<string> durations)
    {
        if (activities.Count < 2 || durations.Count == 0)
            return;

        var hasSummaryDurationTail = HasSummaryDurationTail(durations);
        var lastIndex = activities.Count - 1;
        var previousIndex = lastIndex - 1;

        if (lastIndex < responsibles.Count &&
            previousIndex >= 0 &&
            previousIndex < responsibles.Count &&
            IsResponsibleCandidateInLine(activities[lastIndex]) &&
            string.IsNullOrWhiteSpace(responsibles[previousIndex]) &&
            (hasSummaryDurationTail || durations.Count >= activities.Count))
        {
            responsibles[previousIndex] = activities[lastIndex];
            activities.RemoveAt(lastIndex);
            responsibles.RemoveAt(lastIndex);

            if (durations.Count > 0)
                durations.RemoveAt(durations.Count - 1);
        }

        while (durations.Count > activities.Count)
            durations.RemoveAt(durations.Count - 1);
    }

    public bool HasSummaryDurationTail(List<string> durations)
    {
        if (durations.Count < 2)
            return false;

        var lastSeconds = ParseDurationSeconds(durations[^1]);
        if (lastSeconds is null)
            return false;

        long sumPrevious = 0;
        for (int i = 0; i < durations.Count - 1; i++)
        {
            var seconds = ParseDurationSeconds(durations[i]);
            if (seconds is null)
                return false;
            sumPrevious += seconds.Value;
        }

        return sumPrevious == lastSeconds.Value;
    }

    public static int? ParseDurationSeconds(string duration)
    {
        if (string.IsNullOrWhiteSpace(duration))
            return null;

        var parts = duration.Trim().Split(':');
        if (parts.Length != 2)
            return null;

        if (!int.TryParse(parts[0], out var minutes) || !int.TryParse(parts[1], out var seconds))
            return null;

        if (minutes < 0 || seconds < 0 || seconds > 59)
            return null;

        return minutes * 60 + seconds;
    }

    public bool ShouldTreatPendingAsResponsible(List<string> activities, List<string?> responsibles, bool currentLineHasDuration, string currentActivityText, string pendingAmbiguousText)
    {
        var hasOpenActivity = activities.Count > responsibles.Count;
        if (!hasOpenActivity)
            return false;

        var currentIsClearlyActivity = !IsResponsibleCandidateInLine(currentActivityText);

        if (currentLineHasDuration)
            return IsResponsibleCandidateInLine(pendingAmbiguousText);

        return currentIsClearlyActivity;
    }

    public bool IsStrongResponsibleCandidateInLine(string line)
    {
        var normalized = line.Trim();
        if (normalized.Contains("/"))
            return true;

        // Strong signal for person-like name in ambiguous contexts with next line duration.
        return Regex.IsMatch(normalized, @"^[\p{L}][\p{L}\p{M}'-]*$");
    }

    public static bool IsDirtyLineForResponsible(string line)
    {
        // Any digit means this line is not a clean responsible-only line.
        return Regex.IsMatch(line, @"\d");
    }

    public static int CountWords(string line)
    {
        return Regex.Matches(line, @"[\p{L}][\p{L}\p{M}'-]*").Count;
    }

    public static void AddActivity(List<string> activities, List<string?> responsibles, string activityText)
    {
        if (activities.Count > responsibles.Count)
            responsibles.Add(null);

        activities.Add(activityText);
    }

    public static void AddResponsibleOrFallbackToActivity(List<string> activities, List<string?> responsibles, string responsibleText)
    {
        if (activities.Count > responsibles.Count)
            responsibles.Add(responsibleText);
        else
            AddActivity(activities, responsibles, responsibleText);
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

        // Ex.: "03/01 Length", "03/01 in mins", "03/01 Notes"
        if (Regex.IsMatch(line, @"^\d{2}/\d{2}\s+(?<label>.+)$"))
        {
            var label = Regex.Match(line, @"^\d{2}/\d{2}\s+(?<label>.+)$").Groups["label"].Value.Trim();

            if (IgnoredExactLines.Any(x => string.Equals(x, label, StringComparison.OrdinalIgnoreCase)))
                return true;
        }

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

    public bool IsResponsibleCandidateInLine(string line)
    {
        // If line in format "Name" | "Name Surname" || "Name1/Name2" || "Name1 / Name2" return true
        if (Regex.IsMatch(line, @"^(?:[\p{L}][\p{L}\p{M}'-]*|[\p{L}][\p{L}\p{M}'-]*\s+[\p{L}][\p{L}\p{M}'-]*|[\p{L}][\p{L}\p{M}'-]*\s*/\s*[\p{L}][\p{L}\p{M}'-]*)$"))
            return true;

        return false;
    }

    public bool LineContainsActivity(string line, out string activity)
    {
        // Ignore numeric/time prefixes and start from the first word that begins with a letter.
        var firstWordMatch = Regex.Match(line, @"(?:^|[\s])(?<activityStart>[\p{L}][\p{L}\p{M}'-]*)");
        if (!firstWordMatch.Success)
        {
            activity = string.Empty;
            return false;
        }

        var startIndex = firstWordMatch.Groups["activityStart"].Index;
        var candidate = line[startIndex..].Trim();

        if (string.IsNullOrWhiteSpace(candidate))
        {
            activity = string.Empty;
            return false;
        }

        activity = candidate;
        return true;
    }
}
