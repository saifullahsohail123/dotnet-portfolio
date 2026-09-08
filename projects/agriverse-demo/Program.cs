var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles(); app.UseStaticFiles();

app.MapGet("/api/farms", () => new[]
{
    new { id=1, name="Alpha Zone - Punjab", cropType="Wheat", area=1240, health="Healthy", riskLevel="Low", lastScan="2026-09-08", yieldForecast=4.8, diseaseRisk=6, irrigationStatus="Optimal" },
    new { id=2, name="Beta Zone - Sindh", cropType="Cotton", area=890, health="Stressed", riskLevel="Medium", lastScan="2026-09-07", yieldForecast=2.9, diseaseRisk=34, irrigationStatus="Required" },
    new { id=3, name="Gamma Zone - KPK", cropType="Sugarcane", area=2100, health="Healthy", riskLevel="Low", lastScan="2026-09-08", yieldForecast=6.2, diseaseRisk=9, irrigationStatus="Optimal" },
    new { id=4, name="Delta Zone - Balochistan", cropType="Tomato", area=560, health="Critical", riskLevel="High", lastScan="2026-09-06", yieldForecast=1.4, diseaseRisk=72, irrigationStatus="Critical" },
    new { id=5, name="Epsilon Zone - Punjab", cropType="Rice", area=1780, health="Healthy", riskLevel="Low", lastScan="2026-09-08", yieldForecast=5.1, diseaseRisk=11, irrigationStatus="Optimal" },
    new { id=6, name="Zeta Zone - Sindh", cropType="Maize", area=1020, health="Stressed", riskLevel="Medium", lastScan="2026-09-07", yieldForecast=3.6, diseaseRisk=28, irrigationStatus="Required" },
});

app.MapGet("/api/sensors", () => new[]
{
    new { zoneId=1, zoneName="Alpha", moisture=72.4, temperature=28.3, ph=6.8, nitrogen=185, humidity=65 },
    new { zoneId=2, zoneName="Beta", moisture=38.1, temperature=34.7, ph=7.2, nitrogen=142, humidity=42 },
    new { zoneId=3, zoneName="Gamma", moisture=68.9, temperature=26.5, ph=6.5, nitrogen=210, humidity=71 },
    new { zoneId=4, zoneName="Delta", moisture=22.3, temperature=39.8, ph=8.1, nitrogen=88, humidity=28 },
    new { zoneId=5, zoneName="Epsilon", moisture=75.6, temperature=27.1, ph=6.7, nitrogen=195, humidity=69 },
    new { zoneId=6, zoneName="Zeta", moisture=45.2, temperature=32.4, ph=7.0, nitrogen=156, humidity=51 },
});

app.MapGet("/api/stats", () => new
{
    totalFarms = 6, totalHectares = 7590, avgYieldForecast = 4.0, activeAlerts = 2, dataPoints = 50000000
});

app.Run();
