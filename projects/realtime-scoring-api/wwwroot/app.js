let missionSeconds = 2535;
setInterval(() => {
  missionSeconds++;
  const h = String(Math.floor(missionSeconds / 3600)).padStart(2,'0');
  const m = String(Math.floor((missionSeconds % 3600) / 60)).padStart(2,'0');
  const s = String(missionSeconds % 60).padStart(2,'0');
  document.getElementById('mission-clock').textContent = `${h}:${m}:${s}`;
}, 1000);

async function loadData() {
  const [pRes, sRes, mRes] = await Promise.all([fetch('/api/pilots'), fetch('/api/scores'), fetch('/api/mission')]);
  const pilots = await pRes.json();
  const scores = await sRes.json();
  const mission = await mRes.json();

  // Mission panel
  document.getElementById('mp-name').textContent = mission.name;
  document.getElementById('mp-total').textContent = mission.totalTargets;
  document.getElementById('mp-engaged').textContent = mission.engaged;
  document.getElementById('mp-remaining').textContent = mission.remaining;
  document.getElementById('mp-prog').style.width = mission.completionPercent + '%';
  document.getElementById('mp-pct').textContent = mission.completionPercent + '%';

  // Leaderboard
  const tbody = document.getElementById('pilot-body');
  tbody.innerHTML = pilots.map(p => `
    <tr>
      <td><span class="rank-badge ${p.rank <= 3 ? 'rank-'+p.rank : 'rank-other'}">${p.rank <= 3 ? ['??','??','??'][p.rank-1] : p.rank}</span></td>
      <td><div class="callsign">${p.callsign}</div><div style="font-size:0.65rem;color:var(--muted)">${p.pilotId}</div></td>
      <td style="font-size:0.75rem;color:var(--text)">${p.aircraft}</td>
      <td style="font-family:'Share Tech Mono',monospace;text-align:center">${p.strikes}</td>
      <td class="${p.avgAccuracy > 93 ? 'acc-good' : 'acc-ok'}" style="font-family:'Share Tech Mono',monospace">${p.avgAccuracy}%</td>
      <td class="score-val">${p.totalScore.toLocaleString()}</td>
    </tr>
  `).join('');

  // Accuracy Chart
  new Chart(document.getElementById('accChart').getContext('2d'), {
    type: 'radar',
    data: {
      labels: pilots.map(p => p.callsign),
      datasets: [{
        label: 'Accuracy %', data: pilots.map(p => p.avgAccuracy),
        borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 2, pointBackgroundColor: '#f59e0b', pointRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { r: { min: 80, max: 100, ticks: { color: '#6b7280', font: { size: 9 }, backdropColor: 'transparent' }, grid: { color: 'rgba(245,158,11,0.1)' }, pointLabels: { color: '#e8e0c0', font: { size: 10, family: 'Share Tech Mono' } } } },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0a1018', borderColor: 'rgba(245,158,11,0.3)', borderWidth: 1, bodyColor: '#e8e0c0' } }
    }
  });

  // Score Feed
  renderFeed(scores);

  // Target Zone Grid
  const zones = ['Alpha-7','Bravo-3','Charlie-9','Delta-1','Echo-5','Foxtrot-2','Golf-4','Hotel-8','India-6','Juliet-10','Kilo-2','Lima-11'];
  const engaged = scores.map(s => s.targetZone);
  const grid = document.getElementById('radar-grid');
  grid.innerHTML = zones.map(z => {
    const isEngaged = engaged.includes(z);
    const isActive = z === 'Alpha-7' || z === 'Bravo-3';
    return `<div class="target-zone ${isEngaged ? 'engaged' : isActive ? 'active' : ''}">
      <div class="tz-name">${z}</div>
      <div class="tz-status ${isEngaged ? 'hit' : isActive ? 'active' : 'pending'}">${isEngaged ? '? HIT' : isActive ? '? ACTIVE' : '? PENDING'}</div>
    </div>`;
  }).join('');
}

let liveScores = [];
function renderFeed(scores) {
  liveScores = [...scores];
  const list = document.getElementById('feed-list');
  list.innerHTML = liveScores.map(s => `
    <div class="feed-item">
      <span class="feed-time">${s.timestamp}</span>
      <span class="feed-callsign">${s.callsign}</span>
      <span class="feed-zone">${s.targetZone}</span>
      <span class="feed-acc ${s.accuracy >= 93 ? 'acc-good' : 'acc-ok'}">${s.accuracy}%</span>
      <span class="feed-score">+${s.score.toLocaleString()}</span>
    </div>
  `).join('');
}

// Simulate live scores
const fakeStrikes = [
  { callsign:'VIPER', aircraft:'F-16', targetZone:'Golf-4', accuracy:97.1, score:9580 },
  { callsign:'COBRA', aircraft:'JF-17', targetZone:'Hotel-8', accuracy:93.3, score:8760 },
  { callsign:'HAWK', aircraft:'Mirage', targetZone:'India-6', accuracy:91.8, score:8200 },
];
let fakeIdx = 0;
setInterval(() => {
  const now = new Date();
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const fake = { ...fakeStrikes[fakeIdx % fakeStrikes.length], timestamp: ts, id: Date.now() };
  fakeIdx++;
  liveScores.unshift(fake);
  if (liveScores.length > 12) liveScores.pop();
  renderFeed(liveScores);
}, 6000);

document.addEventListener('DOMContentLoaded', loadData);
