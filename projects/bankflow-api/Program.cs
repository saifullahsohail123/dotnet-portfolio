var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Mock API endpoints
app.MapGet("/api/accounts", () => new[]
{
    new { id = 1, accountNumber = "BF-001-2024", holder = "James Mitchell", type = "Business", balance = 284750.60, currency = "USD", status = "Active" },
    new { id = 2, accountNumber = "BF-002-2024", holder = "Sarah Chen", type = "Savings", balance = 47320.15, currency = "USD", status = "Active" },
    new { id = 3, accountNumber = "BF-003-2024", holder = "Omar Farouq", type = "Current", balance = 12980.00, currency = "USD", status = "Active" },
    new { id = 4, accountNumber = "BF-004-2024", holder = "Priya Nair", type = "Business", balance = 530100.45, currency = "USD", status = "Active" },
});

app.MapGet("/api/transactions", () => new[]
{
    new { id = 1, accountId = 1, date = "2026-09-08", description = "Salary Credit", category = "Income", amount = 8500.00, txType = "Credit" },
    new { id = 2, accountId = 1, date = "2026-09-07", description = "Amazon AWS Services", category = "Tech", amount = -320.50, txType = "Debit" },
    new { id = 3, accountId = 2, date = "2026-09-07", description = "Grocery Store", category = "Food", amount = -85.20, txType = "Debit" },
    new { id = 4, accountId = 1, date = "2026-09-06", description = "Client Payment - Nextech", category = "Income", amount = 15200.00, txType = "Credit" },
    new { id = 5, accountId = 3, date = "2026-09-06", description = "Electricity Bill", category = "Utilities", amount = -142.00, txType = "Debit" },
    new { id = 6, accountId = 2, date = "2026-09-05", description = "Netflix Subscription", category = "Entertainment", amount = -15.99, txType = "Debit" },
    new { id = 7, accountId = 4, date = "2026-09-05", description = "Wholesale Purchase", category = "Business", amount = -42000.00, txType = "Debit" },
    new { id = 8, accountId = 1, date = "2026-09-04", description = "Wire Transfer In", category = "Transfer", amount = 25000.00, txType = "Credit" },
    new { id = 9, accountId = 2, date = "2026-09-03", description = "ATM Withdrawal", category = "Cash", amount = -500.00, txType = "Debit" },
    new { id = 10, accountId = 3, date = "2026-09-03", description = "Freelance Payment", category = "Income", amount = 3200.00, txType = "Credit" },
    new { id = 11, accountId = 1, date = "2026-09-02", description = "Azure Cloud Subscription", category = "Tech", amount = -890.00, txType = "Debit" },
    new { id = 12, accountId = 4, date = "2026-09-01", description = "Export Revenue", category = "Income", amount = 120000.00, txType = "Credit" },
});

app.MapGet("/api/stats", () => new
{
    totalAccounts = 4,
    totalDeposits = 172100.00,
    totalWithdrawals = 43953.69,
    netWorth = 875151.20,
    activeAccounts = 4
});

app.Run();
