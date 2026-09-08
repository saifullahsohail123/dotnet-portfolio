var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/threats", () => new[]
{
    new { id=1, sourceIp="185.234.218.47", country="Russia", city="Moscow", attackType="DDoS", severity="Critical", status="Active", timestamp="2026-09-08 22:41:05", targetSystem="Auth Gateway", packetsPerSec=2400000 },
    new { id=2, sourceIp="103.152.220.18", country="China", city="Beijing", attackType="SQL Injection", severity="High", status="Blocked", timestamp="2026-09-08 22:38:22", targetSystem="User Database", packetsPerSec=0 },
    new { id=3, sourceIp="194.87.68.211", country="Romania", city="Bucharest", attackType="Brute Force", severity="High", status="Active", timestamp="2026-09-08 22:35:11", targetSystem="SSH Login", packetsPerSec=0 },
    new { id=4, sourceIp="45.140.167.99", country="Netherlands", city="Amsterdam", attackType="Phishing", severity="Medium", status="Investigating", timestamp="2026-09-08 22:30:44", targetSystem="Email Gateway", packetsPerSec=0 },
    new { id=5, sourceIp="91.108.4.200", country="Germany", city="Frankfurt", attackType="Port Scan", severity="Low", status="Mitigated", timestamp="2026-09-08 22:28:00", targetSystem="Firewall", packetsPerSec=0 },
    new { id=6, sourceIp="198.54.117.215", country="USA", city="Dallas", attackType="XSS Attack", severity="Medium", status="Blocked", timestamp="2026-09-08 22:22:15", targetSystem="Web API", packetsPerSec=0 },
    new { id=7, sourceIp="5.188.206.14", country="Ukraine", city="Kyiv", attackType="DDoS", severity="Critical", status="Active", timestamp="2026-09-08 22:18:03", targetSystem="CDN Layer", packetsPerSec=1800000 },
    new { id=8, sourceIp="116.48.241.90", country="South Korea", city="Seoul", attackType="Zero-Day Exploit", severity="Critical", status="Investigating", timestamp="2026-09-08 22:10:55", targetSystem="API Gateway", packetsPerSec=0 },
    new { id=9, sourceIp="81.95.44.187", country="Brazil", city="Sao Paulo", attackType="MITM", severity="High", status="Blocked", timestamp="2026-09-08 22:05:30", targetSystem="TLS Terminator", packetsPerSec=0 },
    new { id=10, sourceIp="37.49.225.106", country="Iran", city="Tehran", attackType="Ransomware C2", severity="Critical", status="Active", timestamp="2026-09-08 21:58:10", targetSystem="Internal Network", packetsPerSec=0 },
});

app.MapGet("/api/stats", () => new
{
    activeThreats = 4,
    blocked = 3,
    mitigated = 1,
    investigating = 2,
    totalDetectedToday = 47,
    criticalAlerts = 4
});

app.MapGet("/api/hourly", () =>
{
    var rng = new Random(7);
    return Enumerable.Range(0, 24).Select(h => new { hour = $"{h:D2}:00", count = rng.Next(1, 15) });
});

app.Run();
