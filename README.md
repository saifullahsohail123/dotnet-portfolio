# dotnet-portfolio — ASP.NET Core Project Demos

Senior Full Stack Developer Portfolio — C# / ASP.NET Core, React, Next.js

This repo contains **7 fully-interactive ASP.NET Core 8 demo applications** — each a themed SPA serving a mock JSON API and a rich frontend dashboard, runnable with just `dotnet run`.

## Projects

| Folder | Description |
|--------|-------------|
| [`bankflow-api`](projects/bankflow-api) | Fintech Banking Dashboard — account portfolio, Chart.js analytics, live counter animations |
| [`cyber-nexus-demo`](projects/cyber-nexus-demo) | Cybersecurity CTI Command Center — live threat feed, MITRE ATT&CK heatmap, real-time simulation |
| [`agriverse-demo`](projects/agriverse-demo) | Precision Agriculture Monitor — sensor gauges, crop health meters, yield forecast charts |
| [`roshan-ai-demo`](projects/roshan-ai-demo) | Clinical GDM Risk Detection — patient table, AI risk predictor with interactive sliders |
| [`mobify-platform`](projects/mobify-platform) | Business Intelligence Dashboard — sortable/filterable Polaris grid, revenue trend charts |
| [`realtime-scoring-api`](projects/realtime-scoring-api) | Live Aerial Scoring System (NASTECP) — pilot leaderboard, radar target map, live strike feed |
| [`pos-system`](projects/pos-system) | Point-of-Sale System — interactive product catalog, cart with GST/discount, daily sales report |

## How to Run

```powershell
cd projects/bankflow-api
dotnet run
# Open http://localhost:5000
```

All apps use ASP.NET Core static file middleware + mock JSON endpoints. No database setup required.
