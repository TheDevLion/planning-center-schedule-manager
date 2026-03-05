using PlanningCenterScheduleManager.Backend.Services.Parsing;
using Xunit;

namespace PlanningCenterScheduleManager.Backend.Tests.Services.Parsing;

public sealed class PlanningCenterServiceParserTests
{
    private readonly PlanningCenterServiceParser _parser = new();

    [Fact]
    public void IsDateLine_ReturnsTrue_AndParsedDate_WhenLineIsValidDate()
    {
        var isDateLine = _parser.IsDateLine("March 25, 2026", out var parsedDate);

        Assert.True(isDateLine);
        Assert.Equal(new DateTime(2026, 3, 25), parsedDate);
    }

    [Fact]
    public void Parse_SetsScheduleDate_FromMultilineInput()
    {
        const string rawOcrText =
            """
            Mordor March Run Sheet
            March 25, 2026
            09:00 Opening
            09:05 Council of the Wise: Objectives & Risks
            Gandalf
            """;

        var result = _parser.Parse(rawOcrText);

        Assert.Equal(
            new DateTime(2026, 3, 25, 0, 0, 0),
            result.Date
        );
    }

    [Fact]
    public void Parse_LeavesScheduleDateNull_WhenMultilineInputHasNoValidDateLine()
    {
        const string rawOcrText =
            """
            Mordor March Run Sheet
            Invalid Date
            09:00 Opening
            09:05 Council of the Wise: Objectives & Risks
            Gandalf
            """;

        var result = _parser.Parse(rawOcrText);

        Assert.Null(result.Date);
    }
}

