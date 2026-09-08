var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles(); app.UseStaticFiles();

app.MapGet("/api/pilots", () => new[]
{
    new { rank=1, pilotId="P-001", callsign="VIPER", aircraft="F-16 Fighting Falcon", strikes=12, avgAccuracy=96.4, totalScore=94820, country="PAF" },
    new { rank=2, pilotId="P-004", callsign="COBRA", aircraft="JF-17 Thunder", strikes=10, avgAccuracy=94.8, totalScore=88640, country="PAF" },
    new { rank=3, pilotId="P-007", callsign="HAWK", aircraft="Mirage ROSE III", strikes=11, avgAccuracy=93.2, totalScore=84210, country="PAF" },
    new { rank=4, pilotId="P-012", callsign="FALCON", aircraft="F-16 Fighting Falcon", strikes=9, avgAccuracy=91.7, totalScore=77500, country="PAF" },
    new { rank=5, pilotId="P-003", callsign="THUNDER", aircraft="JF-17 Thunder", strikes=8, avgAccuracy=89.3, totalScore=68920, country="PAF" },
    new { rank=6, pilotId="P-009", callsign="EAGLE", aircraft="Mirage ROSE III", strikes=7, avgAccuracy=87.1, totalScore=58750, country="PAF" },
});

app.MapGet("/api/scores", () => new[]
{
    new { id=1, pilotId="P-001", callsign="VIPER", aircraft="F-16", targetZone="Alpha-7", accuracy=98.2, score=9820, timestamp="22:41:05" },
    new { id=2, pilotId="P-004", callsign="COBRA", aircraft="JF-17", targetZone="Bravo-3", accuracy=95.1, score=9100, timestamp="22:39:22" },
    new { id=3, pilotId="P-007", callsign="HAWK", aircraft="Mirage", targetZone="Delta-1", accuracy=93.8, score=8750, timestamp="22:37:45" },
    new { id=4, pilotId="P-001", callsign="VIPER", aircraft="F-16", targetZone="Charlie-9", accuracy=96.7, score=9420, timestamp="22:35:10" },
    new { id=5, pilotId="P-012", callsign="FALCON", aircraft="F-16", targetZone="Alpha-7", accuracy=91.4, score=8200, timestamp="22:33:02" },
    new { id=6, pilotId="P-003", callsign="THUNDER", aircraft="JF-17", targetZone="Echo-5", accuracy=88.9, score=7500, timestamp="22:30:44" },
    new { id=7, pilotId="P-009", callsign="EAGLE", aircraft="Mirage", targetZone="Bravo-3", accuracy=87.3, score=7100, timestamp="22:28:15" },
    new { id=8, pilotId="P-004", callsign="COBRA", aircraft="JF-17", targetZone="Foxtrot-2", accuracy=94.5, score=8980, timestamp="22:25:30" },
});

app.MapGet("/api/mission", () => new
{
    name = "OPERATION FALCON STRIKE",
    status = "ACTIVE",
    duration = "00:42:15",
    totalTargets = 12,
    engaged = 8,
    remaining = 4,
    completionPercent = 67
});

app.Run();
