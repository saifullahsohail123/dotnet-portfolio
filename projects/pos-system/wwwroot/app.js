const pkr = (n) => 'PKR ' + Math.round(n).toLocaleString();
let products = [], cart = [];

function updateTime() {
  const now = new Date();
  document.getElementById('pos-time').textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
setInterval(updateTime, 1000); updateTime();

async function loadProducts() {
  const res = await fetch('/api/products');
  products = await res.json();
  renderProducts(products);
}

let activeCategory = '';
function renderProducts(data) {
  const q = document.getElementById('search-prod').value.toLowerCase();
  const filtered = data.filter(p => (!activeCategory || p.category === activeCategory) && (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
  const grid = document.getElementById('product-grid');
  grid.innerHTML = filtered.map(p => {
    const stockPct = Math.min((p.stock / 100) * 100, 100);
    const key = p.status.replace(' ', '-');
    return `
    <div class="product-card ${p.stock === 0 ? 'out-of-stock' : ''}" onclick="addToCart(${p.id})">
      <span class="status-badge sb-${key}">${p.status}</span>
      <div class="prod-cat">${p.category}</div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-sku">${p.sku}</div>
      <div class="prod-price">${pkr(p.price)} <span class="prod-unit">/ ${p.unit}</span></div>
      <div class="prod-stock-bar">
        <div class="stock-label"><span>Stock: ${p.stock} ${p.unit}s</span></div>
        <div class="stock-track"><div class="stock-fill stock-${key}" style="width:${stockPct}%"></div></div>
      </div>
    </div>`;
  }).join('') || '<div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">No products found</div>';
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  const existing = cart.find(c => c.id === productId);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) { container.innerHTML = '<div class="cart-empty">No items added. Click a product to add.</div>'; updateTotals(); return; }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-name">${item.name}</div>
      <button class="ci-qty-btn" onclick="changeQty(${item.id},-1)">-</button>
      <span class="ci-qty">${item.qty}</span>
      <button class="ci-qty-btn" onclick="changeQty(${item.id},1)">+</button>
      <div class="ci-price">${pkr(item.price * item.qty)}</div>
      <span class="ci-remove" onclick="removeItem(${item.id})">?</span>
    </div>
  `).join('');
  updateTotals();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  renderCart();
}

function removeItem(id) { cart = cart.filter(c => c.id !== id); renderCart(); }

function updateTotals() {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const discount = Math.min(parseFloat(document.getElementById('discount-inp').value) || 0, 100);
  const discounted = subtotal * (1 - discount / 100);
  const tax = discounted * 0.17;
  const total = discounted + tax;
  document.getElementById('subtotal').textContent = pkr(subtotal);
  document.getElementById('tax-amt').textContent = pkr(tax);
  document.getElementById('total-amt').textContent = pkr(total);
}

document.getElementById('discount-inp').addEventListener('input', updateTotals);

document.getElementById('process-btn').addEventListener('click', () => {
  if (cart.length === 0) { alert('Please add items to the cart first.'); return; }
  cart = []; renderCart();
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
});

document.getElementById('search-prod').addEventListener('input', () => renderProducts(products));

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    renderProducts(products);
  });
});

async function loadSales() {
  const [sRes, dRes] = await Promise.all([fetch('/api/sales'), fetch('/api/dailystats')]);
  const sales = await sRes.json();
  const stats = await dRes.json();
  document.getElementById('h-sales').textContent = stats.totalSales;
  document.getElementById('h-rev').textContent = pkr(stats.totalRevenue);
  document.getElementById('h-items').textContent = stats.itemsSold;

  const txList = document.getElementById('tx-list');
  txList.innerHTML = sales.slice().reverse().map(s => `
    <div class="tx-item">
      <div class="tx-top"><span class="tx-time">${s.time}</span><span class="tx-total">${pkr(s.total)}</span></div>
      <div class="tx-desc">${s.items}</div>
      <div class="tx-payment">${s.payment} &bull; Cashier: ${s.cashier}</div>
    </div>
  `).join('');

  const hours = ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];
  const salesByHour = [0,13800,10450,11200,16100,16000,11000,9300,10400];
  new Chart(document.getElementById('hourly-chart').getContext('2d'), {
    type: 'bar',
    data: { labels: hours, datasets: [{ label: 'Revenue', data: salesByHour, backgroundColor: 'rgba(13,148,136,0.6)', borderColor: '#0d9488', borderWidth: 1, borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', bodyColor: '#f8fafc', callbacks: { label: ctx => ' PKR ' + ctx.raw.toLocaleString() } } }, scales: { x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } }, y: { ticks: { color: '#94a3b8', font: { size: 9 }, callback: v => 'PKR ' + (v/1000).toFixed(0) + 'k' }, grid: { color: '#f1f5f9' } } } }
  });
}

document.addEventListener('DOMContentLoaded', () => { loadProducts(); loadSales(); });
