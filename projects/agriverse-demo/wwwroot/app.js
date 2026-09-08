async function loadData() {
  const [farmsRes, sensorsRes, statsRes] = await Promise.all([fetch('/api/farms'), fetch('/api/sensors'), fetch('/api/stats')]);
  const farms = await farmsRes.json();
  const sensors = await sensorsRes.json();

  // Field Grid
  const grid = document.getElementById('field-grid');
  grid.innerHTML = farms.map(f => {
    const riskColor = f.diseaseRisk < 20 ? '#4ade80' : f.diseaseRisk < 50 ? '#fbbf24' : '#ef4444';
    return `
    <div class="field-card health-${f.health}">
      <span class="health-badge hb-${f.health}">${f.health}</span>
      <div class="field-name">${f.name}</div>
      <div class="field-crop">Crop: ${f.cropType} &bull; ${f.area.toLocaleString()} ha &bull; Scan: ${f.lastScan}</div>
      <div class="field-stats">
        <div class="fs-item"><div class="fs-label">Yield Forecast</div><div class="fs-val" style="color:#4ade80">${f.yieldForecast} t/ha</div></div>
        <div class="fs-item"><div class="fs-label">Disease Risk</div><div class="fs-val" style="color:${riskColor}">${f.diseaseRisk}%</div></div>
        <div class="fs-item"><div class="fs-label">Irrigation</div><div class="fs-val">${f.irrigationStatus}</div></div>
        <div class="fs-item"><div class="fs-label">Risk Level</div><div class="fs-val">${f.riskLevel}</div></div>
      </div>
      <div class="disease-bar">
        <div class="db-label">Disease Risk Index</div>
        <div class="db-track"><div class="db-fill" style="width:${f.diseaseRisk}%;background:${riskColor}"></div></div>
      </div>
    </div>`;
  }).join('');

  // Sensor Table
  const tbody = document.getElementById('sensor-body');
  tbody.innerHTML = sensors.map(s => {
    const mColor = s.moisture < 40 ? '#ef4444' : s.moisture > 65 ? '#4ade80' : '#fbbf24';
    const tColor = s.temperature > 36 ? '#ef4444' : s.temperature < 30 ? '#4ade80' : '#fbbf24';
    return `<tr>
      <td><strong>${s.zoneName} Zone</strong></td>
      <td><div class="bar-cell" style="color:${mColor}"><span>${s.moisture}%</span><div class="mini-bar"><div class="mini-fill" style="width:${s.moisture}%;background:${mColor}"></div></div></div></td>
      <td style="color:${tColor}">${s.temperature}°C</td>
      <td>${s.ph}</td>
      <td><div class="bar-cell"><span>${s.nitrogen}</span><div class="mini-bar"><div class="mini-fill" style="width:${s.nitrogen/3}%"></div></div></div></td>
      <td>${s.humidity}%</td>
      <td style="color:${s.moisture < 40 ? '#ef4444' : '#4ade80'}">${s.moisture < 40 ? '? Required' : s.moisture < 55 ? '?? Monitor' : '? Optimal'}</td>
    </tr>`;
  }).join('');

  // Health Chart
  const healthCounts = { Healthy: 0, Stressed: 0, Critical: 0 };
  farms.forEach(f => healthCounts[f.health]++);
  new Chart(document.getElementById('healthChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: Object.keys(healthCounts), datasets: [{ data: Object.values(healthCounts), backgroundColor: ['#4ade80','#fbbf24','#ef4444'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { labels: { color: '#d1fae5', font: { size: 11 }, boxWidth: 12, padding: 10 } }, tooltip: { backgroundColor: '#101c0d', borderColor: 'rgba(74,222,128,0.2)', borderWidth: 1 } } }
  });

  // Yield Chart
  new Chart(document.getElementById('yieldChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: farms.map(f => f.cropType),
      datasets: [{ label: 'Yield (t/ha)', data: farms.map(f => f.yieldForecast), backgroundColor: farms.map(f => f.health === 'Healthy' ? 'rgba(74,222,128,0.6)' : f.health === 'Stressed' ? 'rgba(251,191,36,0.6)' : 'rgba(239,68,68,0.6)'), borderRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#101c0d', borderColor: 'rgba(74,222,128,0.2)', borderWidth: 1, bodyColor: '#d1fae5' } }, scales: { x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(74,222,128,0.05)' } } } }
  });
}

document.addEventListener('DOMContentLoaded', loadData);
document.querySelectorAll && document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); }));
});
