const fmt = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
let allSales = [];
let sortCol = 'date', sortDir = -1;

async function loadData() {
  const [mRes, sRes, dRes] = await Promise.all([fetch('/api/metrics'), fetch('/api/sales'), fetch('/api/daily')]);
  const metrics = await mRes.json();
  allSales = await sRes.json();
  const daily = await dRes.json();

  document.getElementById('hk-daily').textContent = fmt(metrics.dailyRevenue);
  document.getElementById('hk-weekly').textContent = fmt(metrics.weeklyRevenue);
  document.getElementById('hk-users').textContent = metrics.totalUsers.toLocaleString();
  document.getElementById('hk-cvr').textContent = metrics.conversionRate + '%';

  renderTable(allSales);

  // Revenue Chart
  new Chart(document.getElementById('revenueChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: daily.map(d => d.date),
      datasets: [
        { label: 'Revenue', data: daily.map(d => d.revenue), borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3, yAxisID: 'y' },
        { label: 'Users', data: daily.map(d => d.users), borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.05)', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 3, yAxisID: 'y1' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 12 } }, tooltip: { backgroundColor: '#1a1630', borderColor: 'rgba(168,85,247,0.3)', borderWidth: 1, titleColor: '#f1f0ff', bodyColor: '#94a3b8' } },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 7 }, grid: { color: 'rgba(168,85,247,0.06)' } },
        y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$' + (v/1000).toFixed(0) + 'k' }, grid: { color: 'rgba(168,85,247,0.06)' } },
        y1: { position: 'right', ticks: { color: '#06b6d4', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // Category Chart
  const cats = {}; allSales.forEach(s => { cats[s.category] = (cats[s.category] || 0) + s.revenue; });
  new Chart(document.getElementById('catChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: Object.keys(cats), datasets: [{ data: Object.values(cats), backgroundColor: ['#a855f7','#06b6d4','#ec4899'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10, padding: 10 } }, tooltip: { backgroundColor: '#1a1630', borderColor: 'rgba(168,85,247,0.3)', borderWidth: 1, callbacks: { label: c => ' ' + fmt(c.raw) } } } }
  });
}

function renderTable(data) {
  const body = document.getElementById('sales-body');
  body.innerHTML = data.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.region}</td>
      <td style="font-weight:600">${s.product}</td>
      <td><span class="cat-badge cat-${s.category}">${s.category}</span></td>
      <td style="text-align:right;font-family:monospace">${s.units.toLocaleString()}</td>
      <td style="text-align:right;font-weight:700;color:#a855f7">${fmt(s.revenue)}</td>
    </tr>
  `).join('');
  document.getElementById('showing-count').textContent = data.length;
}

// Sorting
document.querySelectorAll('.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col;
    if (sortCol === col) sortDir *= -1; else { sortCol = col; sortDir = -1; }
    const sorted = [...allSales].sort((a, b) => {
      const av = a[col], bv = b[col];
      return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
    });
    renderTable(sorted);
  });
});

// Search + filter
function applyFilters() {
  const query = document.getElementById('search-box').value.toLowerCase();
  const region = document.getElementById('region-filter').value;
  const filtered = allSales.filter(s => {
    const match = !query || [s.product, s.region, s.category].some(v => v.toLowerCase().includes(query));
    const rMatch = !region || s.region === region;
    return match && rMatch;
  });
  renderTable(filtered);
}
document.getElementById('search-box').addEventListener('input', applyFilters);
document.getElementById('region-filter').addEventListener('change', applyFilters);

// Live req counter simulation
let reqRate = 10247;
setInterval(() => {
  reqRate += Math.round((Math.random() - 0.4) * 200);
  reqRate = Math.max(9000, Math.min(12000, reqRate));
  document.getElementById('req-live').textContent = reqRate.toLocaleString();
}, 1500);

document.addEventListener('DOMContentLoaded', loadData);
