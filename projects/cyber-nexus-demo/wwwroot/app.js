// Cyber Nexus App
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}
setInterval(updateClock, 1000); updateClock();

async function loadStats() {
  const res = await fetch('/api/stats');
  const d = await res.json();
  document.getElementById('kpi-active').textContent = d.activeThreats;
  document.getElementById('kpi-blocked').textContent = d.blocked;
  document.getElementById('kpi-invest').textContent = d.investigating;
  document.getElementById('kpi-total').textContent = d.totalDetectedToday;
}

let threats = [];
async function loadThreats() {
  const res = await fetch('/api/threats');
  threats = await res.json();
  renderThreats(threats);
  buildTypeChart(threats);
}

function renderThreats(data) {
  const body = document.getElementById('threat-body');
  body.innerHTML = data.map(t => `
    <tr>
      <td style="color:var(--muted)">${t.timestamp.slice(11,19)}</td>
      <td class="ip">${t.sourceIp}</td>
      <td style="color:var(--text)">${t.country}<br/><span style="color:var(--muted);font-size:0.65rem">${t.city}</span></td>
      <td class="attack-type">${t.attackType}</td>
      <td style="color:var(--muted);font-size:0.7rem">${t.targetSystem}</td>
      <td><span class="sev-badge sev-${t.severity}">${t.severity}</span></td>
      <td><span class="status-badge status-${t.status}">${t.status}</span></td>
    </tr>
  `).join('');
}

function buildTypeChart(data) {
  const counts = {};
  data.forEach(t => { counts[t.attackType] = (counts[t.attackType] || 0) + 1; });
  const labels = Object.keys(counts);
  const vals = Object.values(counts);
  const colors = ['#ff3366','#00ff88','#00c4ff','#ffdd00','#ff8c00','#c084fc'];
  const ctx = document.getElementById('typeChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: vals, backgroundColor: colors.slice(0,labels.length), borderWidth: 0 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      plugins: { legend: { position: 'right', labels: { color: '#4a7c59', font: { size: 10, family: 'Share Tech Mono' }, boxWidth: 10, padding: 8 } }, tooltip: { backgroundColor: '#071018', borderColor: 'rgba(0,255,136,0.2)', borderWidth: 1, titleColor: '#00ff88', bodyColor: '#c8e6c9' } }
    }
  });
}

async function loadHourly() {
  const res = await fetch('/api/hourly');
  const data = await res.json();
  const ctx = document.getElementById('hourlyChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.hour),
      datasets: [{ label: 'Threats', data: data.map(d => d.count), backgroundColor: 'rgba(0,255,136,0.3)', borderColor: '#00ff88', borderWidth: 1 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#071018', borderColor: 'rgba(0,255,136,0.2)', borderWidth: 1, titleColor: '#00ff88', bodyColor: '#c8e6c9' } },
      scales: { x: { ticks: { color: '#4a7c59', font: { size: 8, family: 'Share Tech Mono' }, maxTicksLimit: 12 }, grid: { display: false } }, y: { ticks: { color: '#4a7c59', font: { size: 9, family: 'Share Tech Mono' } }, grid: { color: 'rgba(0,255,136,0.05)' } } }
    }
  });
}

// Simulate live threat injection every 8 seconds
const fakeSources = [
  { sourceIp:'203.0.113.42', country:'China', city:'Shanghai', attackType:'SQLi', severity:'High', status:'Active', targetSystem:'API Layer' },
  { sourceIp:'185.220.101.5', country:'Russia', city:'St. Petersburg', attackType:'DDoS', severity:'Critical', status:'Active', targetSystem:'CDN' },
  { sourceIp:'46.161.27.100', country:'Iran', city:'Tehran', attackType:'Phishing', severity:'Medium', status:'Investigating', targetSystem:'Mail Server' },
];
let fakeIdx = 0;
setInterval(() => {
  const now = new Date();
  const ts = now.toISOString().replace('T',' ').slice(0,19);
  const fake = {...fakeSources[fakeIdx % fakeSources.length], id: Date.now(), timestamp: ts};
  fakeIdx++;
  threats.unshift(fake);
  if (threats.length > 15) threats.pop();
  renderThreats(threats);
  // update active count
  const activeEl = document.getElementById('kpi-active');
  const current = parseInt(activeEl.textContent) || 4;
  activeEl.textContent = current + 1;
}, 8000);

document.addEventListener('DOMContentLoaded', () => {
  loadStats(); loadThreats(); loadHourly();
});
