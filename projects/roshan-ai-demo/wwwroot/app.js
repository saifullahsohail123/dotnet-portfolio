async function loadData() {
  const [pRes, sRes, tRes] = await Promise.all([fetch('/api/patients'), fetch('/api/stats'), fetch('/api/trends')]);
  const patients = await pRes.json();
  const stats = await sRes.json();
  const trends = await tRes.json();

  document.getElementById('k-total').textContent = stats.totalPatients;
  document.getElementById('k-high').textContent = stats.highRisk;
  document.getElementById('k-med').textContent = stats.mediumRisk;
  document.getElementById('k-low').textContent = stats.lowRisk;
  document.getElementById('hdr-acc').textContent = stats.modelAccuracy + '%';

  const tbody = document.getElementById('patient-body');
  tbody.innerHTML = patients.map(p => `
    <tr>
      <td style="font-family:monospace;color:#6366f1">${p.id}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.age}</td>
      <td>${p.bmi}</td>
      <td>${p.bp}</td>
      <td style="font-weight:600;color:${p.glucose > 140 ? '#dc2626' : p.glucose > 110 ? '#d97706' : '#059669'}">${p.glucose}</td>
      <td style="color:${p.hba1c > 6.5 ? '#dc2626' : p.hba1c > 6.0 ? '#d97706' : '#059669'}">${p.hba1c}%</td>
      <td>Wk ${p.gestWeek}</td>
      <td>
        <div class="risk-bar risk-${p.riskLevel}">
          <span style="min-width:30px">${p.riskScore}</span>
          <div class="rb-track"><div class="rb-fill" style="width:${p.riskScore}%"></div></div>
        </div>
      </td>
      <td><span class="risk-badge rb-${p.riskLevel}">${p.riskLevel}</span></td>
    </tr>
  `).join('');

  new Chart(document.getElementById('riskChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['High Risk', 'Medium Risk', 'Low Risk'], datasets: [{ data: [stats.highRisk, stats.mediumRisk, stats.lowRisk], backgroundColor: ['#ef4444','#f59e0b','#10b981'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { labels: { color: '#64748b', font: { size: 11 }, padding: 12 } }, tooltip: { backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1, titleColor: '#0f172a', bodyColor: '#64748b' } } }
  });

  new Chart(document.getElementById('trendChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: trends.weeks,
      datasets: [
        { label: 'High Risk', data: trends.high, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4 },
        { label: 'Medium Risk', data: trends.medium, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4 },
        { label: 'Low Risk', data: trends.low, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4 },
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#64748b', font: { size: 11 }, boxWidth: 12, padding: 12 } }, tooltip: { backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1, titleColor: '#0f172a', bodyColor: '#64748b' } }, scales: { x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#f1f5f9' } }, y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#f1f5f9' } } } }
  });
}

// Slider logic
const sliders = ['age','bmi','glucose','hba1c','bp','week'];
sliders.forEach(id => {
  const el = document.getElementById('sl-' + id);
  const val = document.getElementById('val-' + id);
  el.addEventListener('input', () => { val.textContent = el.value; });
});

document.getElementById('assess-btn').addEventListener('click', () => {
  const age = +document.getElementById('sl-age').value;
  const bmi = +document.getElementById('sl-bmi').value;
  const glucose = +document.getElementById('sl-glucose').value;
  const hba1c = +document.getElementById('sl-hba1c').value;
  const bp = +document.getElementById('sl-bp').value;
  const week = +document.getElementById('sl-week').value;

  let score = 0;
  if (age > 35) score += 15; else if (age > 28) score += 8;
  if (bmi > 30) score += 20; else if (bmi > 25) score += 10;
  if (glucose > 140) score += 30; else if (glucose > 110) score += 15;
  if (hba1c > 6.5) score += 20; else if (hba1c > 5.7) score += 10;
  if (bp > 140) score += 10; else if (bp > 125) score += 5;
  if (week > 24) score += 5;
  score = Math.min(score, 99);

  const level = score >= 60 ? 'high' : score >= 35 ? 'medium' : 'low';
  const label = score >= 60 ? 'HIGH RISK' : score >= 35 ? 'MEDIUM RISK' : 'LOW RISK';
  const advice = score >= 60
    ? 'Immediate clinical intervention recommended. Refer to endocrinologist. Monitor glucose 4x/day.'
    : score >= 35
    ? 'Monitor closely. Dietary modifications and 2-week follow-up appointment advised.'
    : 'Risk is low. Continue standard prenatal monitoring. Next screening at week 28.';

  const rCard = document.getElementById('result-card');
  rCard.className = 'result-card result-' + level;
  rCard.style.display = 'block';
  rCard.innerHTML = `<div class="result-score">${score}%</div><div class="result-label">${label}</div><div class="result-advice">${advice}</div>`;
});

document.addEventListener('DOMContentLoaded', loadData);
