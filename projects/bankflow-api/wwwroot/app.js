// BankFlow Dashboard App
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtFull = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(n));

function animateCount(el, target, isMoney = true, duration = 1200) {
  const start = 0;
  const startTime = performance.now();
  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * ease;
    el.textContent = isMoney ? fmt(current) : Math.round(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const BADGE_CLASS = { Business: 'badge-business', Savings: 'badge-savings', Current: 'badge-current' };

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    animateCount(document.getElementById('kpi-worth'), data.netWorth);
    animateCount(document.getElementById('kpi-deposits'), data.totalDeposits);
    animateCount(document.getElementById('kpi-withdrawals'), data.totalWithdrawals);
    animateCount(document.getElementById('kpi-accounts'), data.activeAccounts, false);
    animateCount(document.getElementById('stat-accounts'), data.activeAccounts, false);
    animateCount(document.getElementById('stat-net'), data.netWorth);
  } catch(e) { console.error('Stats error', e); }
}

async function loadAccounts() {
  try {
    const res = await fetch('/api/accounts');
    const accounts = await res.json();
    const container = document.getElementById('account-cards');
    container.innerHTML = accounts.map(a => `
      <div class="account-card">
        <div><span class="account-type-badge ${BADGE_CLASS[a.type] || 'badge-current'}">${a.type}</span></div>
        <div class="account-holder">${a.holder}</div>
        <div class="account-number">${a.accountNumber}</div>
        <div class="account-balance">${fmt(a.balance)}</div>
        <div class="account-currency">${a.currency} &bull; ${a.status}</div>
      </div>
    `).join('');
  } catch(e) { console.error('Accounts error', e); }
}

async function loadTransactions() {
  try {
    const res = await fetch('/api/transactions');
    const txs = await res.json();
    const acctMap = { 1: 'BF-001', 2: 'BF-002', 3: 'BF-003', 4: 'BF-004' };
    const body = document.getElementById('tx-body');
    body.innerHTML = txs.map(t => `
      <tr>
        <td class="tx-date">${t.date}</td>
        <td><div class="tx-desc">${t.description}</div></td>
        <td><span class="cat-badge">${t.category}</span></td>
        <td style="color:var(--text-muted);font-size:0.75rem;">${acctMap[t.accountId] || '—'}</td>
        <td style="text-align:right;" class="${t.txType === 'Credit' ? 'tx-amount-credit' : 'tx-amount-debit'}">
          ${t.txType === 'Credit' ? '+' : '-'}${fmtFull(t.amount)}
        </td>
      </tr>
    `).join('');
  } catch(e) { console.error('TX error', e); }
}

async function loadChart() {
  // Generate balance history client-side (matches server seed)
  const labels = [];
  const balances = [];
  let bal = 240000;
  const seedRng = (() => { let s = 42; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; })();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    bal += seedRng() * 10000 - 3000;
    balances.push(Math.round(bal));
  }

  const ctx = document.getElementById('balanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Portfolio Balance',
        data: balances,
        borderColor: '#f0b429',
        backgroundColor: 'rgba(240,180,41,0.08)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#f0b429',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: '#141e33', titleColor: '#f1f5f9', bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
        callbacks: { label: (ctx) => ' $' + ctx.parsed.y.toLocaleString() }
      }},
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 10 }, maxTicksLimit: 8 } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 10 }, callback: (v) => '$' + (v/1000).toFixed(0) + 'k' } }
      }
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadAccounts();
  loadTransactions();
  loadChart();
  // Nav interactions
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
