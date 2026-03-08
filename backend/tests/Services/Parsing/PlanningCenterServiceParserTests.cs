using PlanningCenterScheduleManager.Backend.Models;
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

    [Fact]
    public void Parse_MapsJourneyToMordorInput_ToExpectedSchedule()
    {
        const string rawOcrText =
            """
            Journey to Mordor
            March 1, 2026
            03/01
            9:30A
            9:30a
            9:30a
            9:30a
            03/01 Length
            11:00A
            in mins
            11:00a
            0:00 Council of Elrond Planning & Map Review
            Elrond
            11:00a
            11:00a
            0:00 Final Briefing of the Fellowship
            Gandalf
            9:34:52a
            4:52 Departure from Rivendell
            Aragorn
            11:04:52a 2:00 Encouragement and Courage Speech
            Samwise Gamgee
            9:36:52a
            11:06:52a 7:27 Crossing the Mines of Moria
            Gimli/Legolas
            9:44:19a
            11:14:19a 25:00 Guidance Through Lothlórien
            Galadriel
            10:09:19a 11:39:19a
            1:30 Secret Travel Toward Mordor
            Frodo Baggins
            10:10:49a 11:40:49a
            2:00 Rations & Water Check
            Samwise Gamgee
            10:12:49a 11:42:49a
            4:56 Navigating the Dead Marshes
            Gollum
            10:17:45a 11:47:45a
            2:30 Climb the Stairs of Cirith Ungol
            Frodo / Sam
            10:20:15a 11:50:15a
            1:00 Final March Across Mordor
            Samwise Gamgee
            10:21:15a 11:51:15a
            0:00 Destroy the One Ring in Mount Doom
            Frodo Baggins
            10:21:15a 11:51:15a
            51:15
            Notes
            """;

        var result = _parser.Parse(rawOcrText);

        Assert.Equal(new DateTime(2026, 3, 1, 0, 0, 0), result.Date);

        Assert.Collection(
            result.Activities,
            item => AssertActivity(item, 0, "Council of Elrond Planning & Map Review", "Elrond", "0:00"),
            item => AssertActivity(item, 1, "Final Briefing of the Fellowship", "Gandalf", "0:00"),
            item => AssertActivity(item, 2, "Departure from Rivendell", "Aragorn", "4:52"),
            item => AssertActivity(item, 3, "Encouragement and Courage Speech", "Samwise Gamgee", "2:00"),
            item => AssertActivity(item, 4, "Crossing the Mines of Moria", "Gimli/Legolas", "7:27"),
            item => AssertActivity(item, 5, "Guidance Through Lothlórien", "Galadriel", "25:00"),
            item => AssertActivity(item, 6, "Secret Travel Toward Mordor", "Frodo Baggins", "1:30"),
            item => AssertActivity(item, 7, "Rations & Water Check", "Samwise Gamgee", "2:00"),
            item => AssertActivity(item, 8, "Navigating the Dead Marshes", "Gollum", "4:56"),
            item => AssertActivity(item, 9, "Climb the Stairs of Cirith Ungol", "Frodo / Sam", "2:30"),
            item => AssertActivity(item, 10, "Final March Across Mordor", "Samwise Gamgee", "1:00"),
            item => AssertActivity(item, 11, "Destroy the One Ring in Mount Doom", "Frodo Baggins", "0:00")
        );
    }

    [Fact]
    public void Parse_MapsJourneyToMordorRunSheetInput_ToExpectedSchedule()
    {
        const string rawOcrText =
            """
            Journey to Mordor Run Sheet
            March 25, 2026
            03/25
            6:30A
            6:15a
            6:28a
            6:30a
            03/25
            8:00A
            7:45a
            7:58a
            8:00a
            6:35:28a
            6:40:28a
            6:41:28a
            6:47:42a
            6:50:12a
            7:10:12a
            7:15:12a
            7:18:50a
            7:23:50a
            7:27:50a
            7:27:50a
            8:05:28a
            8:10:28a
            8:11:28a
            8:17:42a
            8:20:12a
            8:40:12a
            8:45:12a
            8:48:50a
            8:53:50a
            8:57:50a
            8:57:50a
            Length
            in mins
            13:00
            2:00
            5:28
            5:00
            1:00
            6:14
            2:30
            20:00
            5:00
            3:38
            5:00
            4:00
            5:00
            57:50
            Notes
            Camp Setup, Gear Check & Road Music
            Departure Countdown from the Shire
            Crossing the Shire Fields
            Frodo
            Council Strategy Meeting
            Gandalf
            Blessing for the Road
            Elrond
            March Toward the Mountains
            Aragorn
            Scouting Ahead Through the Forest
            Legolas / Aragorn
            Stealth Plan to Enter Mordor
            Gandalf
            Map Reading & Route Confirmation
            Aragorn
            Courage Speech
            Legolas
            Group Resolve Before Final March
            Final Instructions
            Gandalf
            Departure Music
            """;

        var result = _parser.Parse(rawOcrText);

        Assert.Equal(new DateTime(2026, 3, 25, 0, 0, 0), result.Date);

        Assert.Collection(
            result.Activities,
            item => AssertActivity(item, 0, "Camp Setup, Gear Check & Road Music", null, "13:00"),
            item => AssertActivity(item, 1, "Departure Countdown from the Shire", null, "2:00"),
            item => AssertActivity(item, 2, "Crossing the Shire Fields", "Frodo", "5:28"),
            item => AssertActivity(item, 3, "Council Strategy Meeting", "Gandalf", "5:00"),
            item => AssertActivity(item, 4, "Blessing for the Road", "Elrond", "1:00"),
            item => AssertActivity(item, 5, "March Toward the Mountains", "Aragorn", "6:14"),
            item => AssertActivity(item, 6, "Scouting Ahead Through the Forest", "Legolas / Aragorn", "2:30"),
            item => AssertActivity(item, 7, "Stealth Plan to Enter Mordor", "Gandalf", "20:00"),
            item => AssertActivity(item, 8, "Map Reading & Route Confirmation", "Aragorn", "5:00"),
            item => AssertActivity(item, 9, "Courage Speech", "Legolas", "3:38"),
            item => AssertActivity(item, 10, "Group Resolve Before Final March", null, "5:00"),
            item => AssertActivity(item, 11, "Final Instructions", "Gandalf", "4:00"),
            item => AssertActivity(item, 12, "Departure Music", null, "5:00")
        );
    }

    [Fact]
    public void Parse_MapsSundayServicesInput_ToExpectedSchedule()
    {
        const string rawOcrText =
            """
            Sunday Services
            February 15, 2026
            02/15
            9:30A
            9:15a
            9:28a
            02/15 Length
            11:00A
            in mins
            10:45a
            10:58a
            13:00 Camp Setup in Rivendell & Travel Music
            9:30a
            11:00a
            2:00
            5:28
            Departure Countdown from Rivendell
            The Fellowship Theme
            Elrond
            9:35:28a
            11:05:28a
            5:00
            Purpose of the Quest to Destroy the Ring
            Gandalf
            9:40:28a
            11:10:28a
            1:00
            Blessing for the Fellowship
            Elrond
            9:41:28a
            11:11:28a
            6:14 March of the Fellowship
            Aragorn
            9:47:42a
            9:50:12a
            11:17:42a
            2:30
            Song of the Elves
            Legolas
            11:20:12a 20:00 Strategy for Entering Mordor
            Gandalf
            10:10:12a 11:40:12a
            5:00
            Reading of the Ancient Map
            Aragorn
            10:15:12a 11:45:12a
            3:38
            Song of Courage Before the Journey
            Pippin
            10:18:50a 11:48:50a
            10:23:50a 11:53:50a
            5:00
            Fellowship Resolve
            4:00
            Final Counsel Before Departure
            Gandalf
            10:27:50a 11:57:50a
            5:00 Road Music Toward Mordor
            10:27:50a 11:57:50a
            57:50
            Notes
            """;

        var result = _parser.Parse(rawOcrText);

        Assert.Equal(new DateTime(2026, 2, 15, 0, 0, 0), result.Date);

        Assert.Collection(
            result.Activities,
            item => AssertActivity(item, 0, "Camp Setup in Rivendell & Travel Music", null, "13:00"),
            item => AssertActivity(item, 1, "Departure Countdown from Rivendell", null, "2:00"),
            item => AssertActivity(item, 2, "The Fellowship Theme", "Elrond", "5:28"),
            item => AssertActivity(item, 3, "Purpose of the Quest to Destroy the Ring", "Gandalf", "5:00"),
            item => AssertActivity(item, 4, "Blessing for the Fellowship", "Elrond", "1:00"),
            item => AssertActivity(item, 5, "March of the Fellowship", "Aragorn", "6:14"),
            item => AssertActivity(item, 6, "Song of the Elves", "Legolas", "2:30"),
            item => AssertActivity(item, 7, "Strategy for Entering Mordor", "Gandalf", "20:00"),
            item => AssertActivity(item, 8, "Reading of the Ancient Map", "Aragorn", "5:00"),
            item => AssertActivity(item, 9, "Song of Courage Before the Journey", "Pippin", "3:38"),
            item => AssertActivity(item, 10, "Fellowship Resolve", null, "5:00"),
            item => AssertActivity(item, 11, "Final Counsel Before Departure", "Gandalf", "4:00"),
            item => AssertActivity(item, 12, "Road Music Toward Mordor", null, "5:00")
        );
    }

    private static void AssertActivity(Activity item, int expectedOrder, string expectedTitle, string? expectedResponsible, string? expectedDurationRaw)
    {
        Assert.Equal(expectedOrder, item.Order);
        Assert.Equal(expectedTitle, item.Title);
        Assert.Equal(expectedResponsible, item.Responsible);
        Assert.Equal(expectedDurationRaw, item.DurationRaw);
    }
}

