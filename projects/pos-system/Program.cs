var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles(); app.UseStaticFiles();

app.MapGet("/api/products", () => new[]
{
    new { id=1, name="Gurjan Plywood 4x8", sku="PLY-GUR-48", category="Plywood", price=2800.0, stock=142, unit="Sheet", status="In Stock" },
    new { id=2, name="Commercial Plywood 3x6", sku="PLY-COM-36", category="Plywood", price=1400.0, stock=89, unit="Sheet", status="In Stock" },
    new { id=3, name="MDF Board 8mm", sku="MDF-8MM-48", category="MDF", price=1200.0, stock=12, unit="Sheet", status="Low Stock" },
    new { id=4, name="Hardwood Lumber Teak", sku="HWD-TEK-01", category="Hardwood", price=8500.0, stock=35, unit="Cubic Ft", status="In Stock" },
    new { id=5, name="Laminate Sheet Oak", sku="LAM-OAK-48", category="Laminate", price=650.0, stock=0, unit="Sheet", status="Out of Stock" },
    new { id=6, name="Flex Plywood 4x8", sku="PLY-FLX-48", category="Plywood", price=3200.0, stock=28, unit="Sheet", status="In Stock" },
    new { id=7, name="Marine Plywood 19mm", sku="PLY-MAR-19", category="Plywood", price=4100.0, stock=7, unit="Sheet", status="Low Stock" },
    new { id=8, name="Blockboard 25mm", sku="BBD-25MM-48", category="MDF", price=1900.0, stock=54, unit="Sheet", status="In Stock" },
    new { id=9, name="Sapwood Lumber", sku="HWD-SAP-01", category="Hardwood", price=5200.0, stock=18, unit="Cubic Ft", status="In Stock" },
    new { id=10, name="Laminate Sheet Walnut", sku="LAM-WAL-48", category="Laminate", price=780.0, stock=4, unit="Sheet", status="Low Stock" },
    new { id=11, name="Veneer Sheet Rosewood", sku="VEN-ROS-48", category="Laminate", price=1100.0, stock=66, unit="Sheet", status="In Stock" },
    new { id=12, name="OSB Board 12mm", sku="OSB-12MM-48", category="MDF", price=950.0, stock=93, unit="Sheet", status="In Stock" },
});

app.MapGet("/api/sales", () => new[]
{
    new { id=1, time="10:42 AM", items="Gurjan Plywood x4, MDF 8mm x2", total=13800.0, payment="Cash", cashier="Ahmad" },
    new { id=2, time="11:15 AM", items="Hardwood Teak x1, Laminate Oak x3", total=10450.0, payment="Card", cashier="Ahmad" },
    new { id=3, time="12:03 PM", items="Commercial Plywood x8", total=11200.0, payment="Cash", cashier="Bilal" },
    new { id=4, time="12:48 PM", items="Marine Plywood x3, Blockboard x2", total=16100.0, payment="Card", cashier="Ahmad" },
    new { id=5, time="01:22 PM", items="Flex Plywood x5", total=16000.0, payment="Cash", cashier="Bilal" },
    new { id=6, time="02:10 PM", items="Veneer Rosewood x10", total=11000.0, payment="Card", cashier="Ahmad" },
    new { id=7, time="03:35 PM", items="OSB Board x6, MDF 8mm x3", total=9300.0, payment="Cash", cashier="Bilal" },
    new { id=8, time="04:20 PM", items="Sapwood Lumber x2", total=10400.0, payment="Card", cashier="Ahmad" },
});

app.MapGet("/api/dailystats", () => new { totalSales = 8, totalRevenue = 98250.0, itemsSold = 44, topProduct = "Gurjan Plywood 4x8" });

app.Run();
