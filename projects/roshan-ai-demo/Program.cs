var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles(); app.UseStaticFiles();

app.MapGet("/api/patients", () => new[]
{
    new { id="P-0041", name="Fatima Malik", age=28, bmi=31.2, bp="140/90", glucose=168, hba1c=7.4, gestWeek=26, riskLevel="High", riskScore=84 },
    new { id="P-0042", name="Ayesha Tariq", age=33, bmi=26.8, bp="118/76", glucose=102, hba1c=5.6, gestWeek=18, riskLevel="Low", riskScore=18 },
    new { id="P-0043", name="Sana Rahman", age=30, bmi=29.4, bp="132/84", glucose=145, hba1c=6.9, gestWeek=32, riskLevel="Medium", riskScore=61 },
    new { id="P-0044", name="Zara Hassan", age=25, bmi=24.1, bp="112/70", glucose=94, hba1c=5.2, gestWeek=14, riskLevel="Low", riskScore=12 },
    new { id="P-0045", name="Nadia Qureshi", age=38, bmi=35.6, bp="152/95", glucose=198, hba1c=8.1, gestWeek=30, riskLevel="High", riskScore=93 },
    new { id="P-0046", name="Hira Baig", age=31, bmi=27.9, bp="124/80", glucose=128, hba1c=6.4, gestWeek=22, riskLevel="Medium", riskScore=49 },
    new { id="P-0047", name="Maham Akhtar", age=27, bmi=22.5, bp="108/68", glucose=88, hba1c=5.0, gestWeek=10, riskLevel="Low", riskScore=9 },
    new { id="P-0048", name="Rukhsar Ali", age=36, bmi=33.2, bp="148/92", glucose=182, hba1c=7.8, gestWeek=28, riskLevel="High", riskScore=88 },
});

app.MapGet("/api/stats", () => new
{
    totalPatients = 8, highRisk = 3, mediumRisk = 2, lowRisk = 3, modelAccuracy = 94.7, predictionsToday = 8
});

app.MapGet("/api/trends", () =>
{
    var weeks = new[]{"Wk1","Wk2","Wk3","Wk4","Wk5","Wk6","Wk7","Wk8"};
    var high = new[]{1,2,1,3,2,3,3,3};
    var medium = new[]{2,1,2,1,2,2,2,2};
    var low = new[]{5,5,5,4,4,3,3,3};
    return new { weeks, high, medium, low };
});

app.Run();
