var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles(); app.UseStaticFiles();

app.MapGet("/api/sales", () => new[]
{
    new { id=1, date="2026-09-08", region="Rawalpindi", product="Polaris Pro", units=142, revenue=71000.0, category="Enterprise" },
    new { id=2, date="2026-09-08", region="Lahore", product="Mobify Core", units=89, revenue=26700.0, category="SMB" },
    new { id=3, date="2026-09-08", region="Karachi", product="API Gateway Pack", units=220, revenue=44000.0, category="Developer" },
    new { id=4, date="2026-09-07", region="Islamabad", product="Polaris Pro", units=175, revenue=87500.0, category="Enterprise" },
    new { id=5, date="2026-09-07", region="Peshawar", product="Mobify Core", units=63, revenue=18900.0, category="SMB" },
    new { id=6, date="2026-09-06", region="Rawalpindi", product="Analytics Suite", units=48, revenue=38400.0, category="Enterprise" },
    new { id=7, date="2026-09-06", region="Karachi", product="Polaris Pro", units=201, revenue=100500.0, category="Enterprise" },
    new { id=8, date="2026-09-05", region="Lahore", product="API Gateway Pack", units=310, revenue=62000.0, category="Developer" },
    new { id=9, date="2026-09-05", region="Islamabad", product="Analytics Suite", units=72, revenue=57600.0, category="Enterprise" },
    new { id=10, date="2026-09-04", region="Rawalpindi", product="Mobify Core", units=118, revenue=35400.0, category="SMB" },
});

app.MapGet("/api/metrics", () => new
{
    dailyRevenue = 141700.0,
    weeklyRevenue = 541200.0,
    monthlyRevenue = 2184000.0,
    requestsPerMin = 10247,
    totalUsers = 48392,
    conversionRate = 3.4
});

app.MapGet("/api/daily", () =>
{
    var rng = new Random(99);
    return Enumerable.Range(0, 14).Select(i => {
        var d = DateTime.Now.AddDays(-13 + i);
        return new { date = d.ToString("MMM dd"), revenue = Math.Round(120000 + rng.NextDouble() * 60000), users = 1200 + rng.Next(0, 600) };
    });
});

app.Run();
