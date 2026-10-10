const $ = s => document.querySelector(s), grid = $('#grid'), PAGE = 12;
const ORDER = [37616, 37501, 37512, 37534, 36028, 36039, 36050, 18273, 20242, 18255];
const icon = src => src.startsWith('<svg') ? src : `<img src="${src}" style="width:38px;height:38px;object-fit:contain;pointer-events:none">`;
const ICONS = {
  'All': '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>',
  'Handheld': 'https://images.sharepal.in/categories/gaming-consoles/ps5/ps-portal-remote-player/ps-portal-on-rent-1.webp',
  'GTA VI': 'https://images.sharepal.in/category-icons/gta-vi.webp',
  'PS5 Console': 'https://images.sharepal.in/sub-category-card/ps5-console-on-rent-sharepal.webp',
  'Xbox Console': 'https://images.sharepal.in/sub-category-card/xbox-console-on-rent-sharepal.webp',
  'VR': 'https://images.sharepal.in/sub-category-card/vr-on-rent-sharepal.webp',
  'Racing Wheel': 'https://images.sharepal.in/categories/gaming-consoles/gaming-accessories/logitech-G29-driving-force-racing-wheel/logitech-g29-racing-wheel-on-rent-sharepal-1.webp',
  'Big Screen Gaming': 'https://images.sharepal.in/categories/gaming-consoles/big-screen-gaming/products/ps5-with-2-controllers-with-projector-on-rent+.webp',
  'PS5 Games': 'https://images.sharepal.in/categories/gaming-consoles/ps5/ps5-with-fc25/ps5-with-fc25-with-100-games-with-2-controllerS-on-rent-sharepal-1.webp'
};
const CATS = [['All', icon(ICONS['All']), () => 1], ['Handheld', icon(ICONS['Handheld']), p => /portal/i.test(p.name)], ['GTA VI', icon(ICONS['GTA VI']), p => /gta/i.test(p.name)], ['PS5 Console', icon(ICONS['PS5 Console']), p => /^ps5/i.test(p.name) && !/wheel/i.test(p.name)], ['Xbox Console', icon(ICONS['Xbox Console']), p => /xbox/i.test(p.name)], ['VR', icon(ICONS['VR']), p => /vr|quest|vision/i.test(p.name)], ['Racing Wheel', icon(ICONS['Racing Wheel']), p => /wheel/i.test(p.name)], ['Big Screen Gaming', icon(ICONS['Big Screen Gaming']), p => /projector|big screen/i.test(p.name)], ['PS5 Games', icon(ICONS['PS5 Games']), p => /digital game|fc2\d|cricket|uncharted/i.test(p.name)]];
const MENU = {
  Photography: [['DJI Drones', 'Pocket Cameras', 'Mirrorless Cameras', 'Professional Cameras', 'DSLR Gimbal Combos', 'Tripod and camera accessories'], ['Wearables', '360 Cameras', 'Vlogging', 'GoPro Cameras', 'Mobile Gimbals', 'Action Camera Mounts'], ['iPhones', 'Action Cameras', 'UNLMTD Vlogging', 'Insta360 Cameras', 'Wireless & Collar Mics', 'Action Camera Add ons'], ['Cameras', 'DSLR Cameras', 'Wildlife Photography', 'DJI Cameras', 'DSLR Lens']],
  Gaming: [['Handheld', 'GTA VI', 'PS5 Console', 'Xbox Console'], ['VR', 'Racing Wheel', 'Big Screen Gaming', 'PS5 Games']],
  Outdoor: [['Trekking Gear', 'Riding Gear', 'Camping Gear', 'Trekking Shoes'], ['Snow Boots', 'Trekking Jackets', 'Trek/Snow Pants', 'Trek Accessories'], ['Winter Jackets', 'Riding Jackets', 'Riding Boots', 'Riding Essentials'], ['Riding Luggage', 'Backpacks', 'Binoculars', 'Camping Tents'], ['Camping Stools & Tables', 'Sleeping Bags & Mats']],
  Entertainment: [['Beauty', 'Headphones', 'Laptops', 'Wearables'], ['Speakers', 'Mics', 'VR', 'Projectors']]
};
const st = { all: [], cat: 'All', shown: PAGE, days: 0, cart: new Set(), joined: new Set(JSON.parse(localStorage.joined || '[]')), query: '', user: localStorage.user || null, compare: new Set() };
// header tabs + mega menu
const tabs = $('#tabs'), mega = $('#mega'); let ht;
tabs.innerHTML = Object.keys(MENU).map(t => `<a href="#" class="${t == 'Gaming' ? 'on' : ''}" data-t="${t}">${t}</a>`).join('');
const open = t => { clearTimeout(ht); const m = MENU[t]; mega.style.gridTemplateColumns = `repeat(${m.length},auto)`; mega.innerHTML = m.map(c => `<div>${c.map(x => `<a href="#" style="display:block;margin:8px 0">${x}</a>`).join('')}</div>`).join(''); mega.classList.add('show') };
const close = () => { ht = setTimeout(() => mega.classList.remove('show'), 150) };
tabs.onmouseover = e => e.target.dataset.t && open(e.target.dataset.t); tabs.onmouseleave = close; mega.onmouseenter = () => clearTimeout(ht); mega.onmouseleave = close;
tabs.onclick = e => e.preventDefault();
// sidebar
const side = $('#side'); const drawSide = () => side.innerHTML = CATS.map(c => `<a href="#" class="cat ${c[0] == st.cat ? 'on' : ''}" data-c="${c[0]}"><span>${c[1]}</span><em>${c[0]}</em></a>`).join(''); drawSide();
side.onclick = e => { const a = e.target.closest('.cat'); if (!a) return; e.preventDefault(); st.cat = a.dataset.c; st.shown = PAGE; drawSide(); render() };
// products
grid.innerHTML = '<div class="sk"></div>'.repeat(8);
const load = window.PRODUCTS ? Promise.resolve(window.PRODUCTS) : fetch('products.json').then(r => r.json());
load.then(d => { const rank = p => { const i = ORDER.indexOf(p.id); return i < 0 ? 99 : i }; st.all = d.products.map((p, i) => ({ ...p, i })).sort((a, b) => rank(a) - rank(b) || a.i - b.i); render() }).catch(() => grid.innerHTML = '<p class="empty">Could not load products. Please refresh.</p>');
const promo = n => n == 0 ? `<div class="promo p1"><h5>Become an <em>Asset Partner.</em> Earn Monthly.</h5><p>Upto ₹10,000 instant wallet credits · 10% off · 10% cashback</p><button class="cta">Know More ↗</button></div>` : `<div class="promo p2"><p>Got gear you dont use anymore?</p><h5>Rent Out Your Gear on SharePal</h5><button class="cta" style="margin-top:10px">Earn With Us ↗</button></div>`;
const rupee = n => '₹' + n.toLocaleString('en-IN');
function card(p, i) {
  const tag = p.tag ? `<span class="tag ${p.tag.split(' ')[0]}">${p.tag}</span>` : '';
  const cmpUI = `<label class="cmp-lbl"><input type="checkbox" class="cmp-chk" data-cmp="${p.id}" ${st.compare.has(p.id)?'checked':''}> Compare</label>`;
  const img = `<div class="imgb">${cmpUI}${tag}<img src="${p.image}" alt="${p.name} on rent in Bangalore" loading="lazy"></div>`;
  const dl = `style="animation-delay:${(i % 12) * 35}ms"`;
  if (p.tag == 'Vote to Launch') { const n = st.joined.has(p.id) ? 71 : 70; return `<article class="card" ${dl}>${img}<div class="vote">🚀 Launching at 1k votes. Get notified first!<div class="bar"><i style="width:${n / 10}%"></i></div><div>${n}/1000 Joined</div></div><h3 class="cn" style="min-height:0">${p.name}</h3><button class="join ${st.joined.has(p.id) ? 'on' : ''}" data-j="${p.id}">${st.joined.has(p.id) ? '✓ On waitlist' : 'Join Waitlist'}</button></article>` }
  if (p.out_of_stock) {
    return `<article class="card oos" ${dl}>
      ${img}
      <h3 class="cn">${p.name}</h3>
      <div class="pr-oos">
        <div class="oos-info">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Unavailable
        </div>
        <button class="oos-btn">Check Availability</button>
      </div>
    </article>`;
  }

  const price = st.days ? `<b>${rupee(p.per_day_rent * st.days)}</b>for ${st.days} day${st.days > 1 ? 's' : ''}` : `<span>Starting from</span><b>${rupee(p.per_day_rent)}<small> /day</small></b>`;
  return `<article class="card" ${dl}>${img}<h3 class="cn">${p.name}</h3><div class="pr"><div>${price}</div><button class="add ${st.cart.has(p.id) ? 'done' : ''}" data-a="${p.id}" aria-label="Add ${p.name}">${st.cart.has(p.id) ? '✓' : '+'}</button></div></article>`;
}
function render() {
  let l = st.all.filter(CATS.find(c => c[0] == st.cat)[2]);
  if (st.query) l = l.filter(p => p.name.toLowerCase().includes(st.query));
  const v = l.slice(0, st.shown);
  $('#total').innerHTML = `<span style="color:#9ca3af">Total items:</span> ${l.length} items`;
  grid.innerHTML = v.length ? v.map((p, i) => (i && i % 4 == 0 && i % 8 == 4 ? promo(0) : i && i % 8 == 0 ? promo(1) : '') + card(p, i)).join('') : '<p class="empty">Nothing found. Try a different category or search term.</p>';
  $('#showing').textContent = `Showing ${v.length} of ${l.length} results`; $('#moreBtn').hidden = v.length >= l.length
}
$('#moreBtn').onclick = () => { st.shown += PAGE; render() };
document.addEventListener('click', e => {
  const a = e.target.closest('[data-a]'), j = e.target.closest('[data-j]');
  if (a) {
    const id = +a.dataset.a; if (!st.days) { toast('Select rental dates to add to cart'); $('#dlg').showModal(); return }
    st.cart.has(id) ? st.cart.delete(id) : st.cart.add(id); const c = $('#cartN'); c.hidden = !st.cart.size; c.textContent = st.cart.size; c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 200); render()
  }
  if (j) { const id = +j.dataset.j; st.joined.has(id) ? st.joined.delete(id) : st.joined.add(id); localStorage.joined = JSON.stringify([...st.joined]); toast(st.joined.has(id) ? "You're on the waitlist" : 'Removed from waitlist'); render() }
});
// dates
const dlg = $('#dlg'), d1 = $('#d1'), d2 = $('#d2'), iso = d => d.toISOString().slice(0, 10); d1.min = d2.min = iso(new Date());
['#selBtn', '#dDel', '#dPick', '#floatBtn'].forEach(s => $(s).onclick = () => dlg.showModal());
d1.onchange = () => { d2.min = d1.value; if (d2.value < d1.value) d2.value = '' };
$('#ok').onclick = e => {
  if (!d1.value || !d2.value) { e.preventDefault(); $('#err').textContent = 'Please pick both dates.'; return }
  st.days = Math.max(1, Math.round((new Date(d2.value) - new Date(d1.value)) / 864e5)); $('#err').textContent = '';
  $('#dDel span').textContent = d1.value; $('#dPick span').textContent = d2.value; $('#floatBtn').classList.add('hide'); render(); toast(`Showing prices for ${st.days} day${st.days > 1 ? 's' : ''}`)
};
$('#recForm').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('Thanks! We got your recommendation.') };
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1800) }
// reviews + footer
const R = [['Satyaki', 'Kolkata • Trekking Gear', 'Have used their services twice now. They never disappoint. Quick responses, polite, transparent, hassle free, great products as well.'], ['Afrana', 'Bangalore • Gaming Console', 'It\'s an amazing service, starting from the quality of the gear provided to the pickup and drop at doorstep facility.'], ['Kanthikiran', 'Bangalore • Riding Gear', 'I am a regular customer and order ps4. It\'s very affordable and booking an order is super easy and user friendly website.'], ['Pankaj', 'Mumbai • Action Cameras', 'The experience with share pal is awesome. The camera, service provided by them is good. Overall I am happy.'], ['Jayaramam', 'Mumbai • Riding Gear', 'Great company amazing products at affordable prices and great service. Would recommend share pal to everybody.'], ['Manish', 'Mumbai • Gaming Console', 'I like the way sharepal work and really enjoyed the ps4. Will order again. Thanks sharepal.'], ['Rakesh', 'Mumbai • Trekking Gear', 'Ordered 2 pair of shoes & 3 trekking poles. Shoes were in mint condition, very well cleaned and sanitized.']];
const card2 = r => `<div class="rc"><div class="st"><b>G</b>★★★★★</div><p>“ ${r[2]} ”</p><small><b>${r[0]}</b><br>${r[1]}</small></div>`;
$('#track').innerHTML = (R.map(card2).join('')).repeat(4);
const F = { 'Action Cameras': ['Action Cameras', 'Pocket Cameras', 'GoPro Cameras', 'DJI Cameras', 'DJI Drones', '360 Cameras'], Cameras: ['DSLR Cameras', 'Cameras', 'iPhones', 'DSLR Gimbal Combos', 'Wildlife Photography'], 'Trekking Gear': ['Trekking Gear', 'Trekking Jackets', 'Trek/Snow Pants', 'Trekking Shoes', 'Trek Accessories'], 'Riding Gear': ['Riding Gear', 'Riding Luggage', 'Riding Jackets', 'Riding Essentials', 'Riding Boots', 'Binoculars'], 'Creator Gear': ['Wireless & Collar Mics', 'Professional Cameras', 'Mirrorless Cameras', 'Vlogging', 'Mobile Gimbals'], 'Gaming Console': ['PS5 Games', 'PS5 Console', 'VR', 'Racing Wheel', 'Big Screen Gaming', 'Xbox Console'], 'Winter Wear': ['Snow Boots', 'Winter Jackets', 'Backpacks'], 'Camping Gear': ['Camping Gear', 'Camping Stools & Tables', 'Camping Tents', 'Sleeping Bags & Mats'], 'Audio Visual': ['Projectors', 'VR', 'Mics', 'Speakers'] };
const col = (h, l) => `<div><h6>${h}</h6>${l.map(x => `<a href="#">${x}</a>`).join('')}</div>`;
$('#fcols').innerHTML = Object.entries(F).map(([h, l]) => col(h, l)).join('');
$('#fcols2').innerHTML = [['SharePal', ['About', 'Why SharePal', 'Sitemap', 'CarePal']], ['Become a Pal', ['SharePal for Creators', 'Careers', 'SharePal for Brands', 'Asset Funding Program', 'Rent Your Gear']], ['Information', ['How it works?', 'FAQs', 'Verification', 'Cancellation Policy', 'Life at Sharepal']], ['Policies', ['Terms & Condition', 'Shipping policy', 'Damage Policy', 'Terms of Use', 'Privacy Policy']], ['Need Help', ['Contact Support', 'Contact Us', 'care@sharepal.in']]].map(([h, l]) => col(h, l)).join('');

// Location & Top Icons Functionality
$('#cityBtn').onclick = () => $('#cityDlg').showModal();
window.setCity = (city) => { $('#cityLoc').textContent = city; $('#cityDlg').close(); toast('Location changed to ' + city); };
$('#searchBtn').onclick = () => { $('#searchDlg').showModal(); $('#searchInput').focus(); };
$('#doSearch').onclick = () => { st.query = $('#searchInput').value.toLowerCase(); $('#searchDlg').close(); st.shown = PAGE; render(); if (st.query) toast(`Showing results for "${st.query}"`); };
$('#searchInput').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); $('#doSearch').click(); } };
window.remCart = (id) => { st.cart.delete(id); $('#cartBtn').click(); render(); };
$('#cartBtn').onclick = () => {
  const c = $('#cartItems');
  if (!st.cart.size) { c.innerHTML = '<p class="empty" style="padding:20px">Your cart is empty.</p>'; $('#cartTotal').textContent = ''; }
  else {
    let tot = 0;
    c.innerHTML = [...st.cart].map(id => {
      const p = st.all.find(x => x.id == id); if (!p) return '';
      const days = st.days || 1; const price = p.per_day_rent * days; tot += price;
      return `<div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;border-bottom:1px solid var(--ln);padding-bottom:12px"><img src="${p.image}" width="60" height="60" style="object-fit:contain;background:#f3f4f6;border-radius:8px"><div style="flex:1"><b>${p.name}</b><br><span style="color:var(--mute)">₹${p.per_day_rent} x ${days} day(s)</span></div><b style="font-size:15px">₹${price}</b><button type="button" onclick="remCart(${id})" style="color:#dc2626;font-size:16px;padding:4px">✕</button></div>`;
    }).join('');
    $('#cartTotal').textContent = `Total Payable: ₹${tot}`;
  }
  $('#cartDlg').showModal();
};
if (st.user) $('#loginBtn').innerHTML = `<img src="user.svg" width="20" height="20" alt="">Hi, ${st.user.slice(0, 4)}...`;
$('#loginBtn').onclick = () => {
  if (st.user) {
    if (confirm("Do you want to logout?")) {
      st.user = null; delete localStorage.user;
      $('#loginBtn').innerHTML = `<img src="user.svg" width="20" height="20" alt="">Hi, Login`;
      toast("Logged out successfully");
    }
  } else { $('#loginDlg').showModal(); }
};
let isSignup = false;
$('#toggleSignup').onclick = (e) => { e.preventDefault(); isSignup = !isSignup; $('#loginTitle').textContent = isSignup ? "Create Account" : "Login"; $('#toggleSignup').textContent = isSignup ? "Already have an account? Login" : "New here? Create Account"; };
$('#btnSendOtp').onclick = () => {
  const phone = $('#loginPhone').value;
  if (!phone.match(/^[0-9]{10}$/)) return $('#loginErr').textContent = "Enter valid 10-digit number";
  $('#loginErr').textContent = ""; $('#loginStep1').hidden = true; $('#loginStep2').hidden = false;
  $('#otpSentMsg').textContent = `OTP sent to +91 ${phone}`; $('#loginOtp').focus(); toast("OTP sent! (Enter any 4 digits)");
};
$('#btnVerifyOtp').onclick = () => {
  const otp = $('#loginOtp').value;
  if (!otp.match(/^[0-9]{4}$/)) return $('#otpErr').textContent = "Enter 4-digit OTP";
  const phone = $('#loginPhone').value;
  st.user = phone; localStorage.user = phone; $('#otpErr').textContent = "";
  $('#loginBtn').innerHTML = `<img src="user.svg" width="20" height="20" alt="">Hi, ${phone.slice(0, 4)}...`;
  $('#loginDlg').close(); toast(isSignup ? "Account created successfully!" : "Logged in successfully!");
  setTimeout(() => { $('#loginStep1').hidden = false; $('#loginStep2').hidden = true; $('#loginPhone').value = ''; $('#loginOtp').value = ''; }, 300);
};

$('.chat').onclick = () => $('#chatWin').classList.toggle('show');
$('#closeChat').onclick = () => $('#chatWin').classList.remove('show');
$('#chatForm').onsubmit = (e) => {
  e.preventDefault(); const inp = $('#chatInput'), val = inp.value.trim(); if (!val) return;
  const b = $('#chatBody'); b.innerHTML += `<div class="msg user">${val}</div>`; inp.value = ''; b.scrollTop = b.scrollHeight;
  setTimeout(() => { b.innerHTML += `<div class="msg bot">Our team is busy right now, but please leave your details. We'll get back to you!</div>`; b.scrollTop = b.scrollHeight; }, 1000);
};
document.querySelectorAll('.tabs a').forEach(a => a.addEventListener('click', () => toast('Navigating to ' + a.textContent)));
$('#goCheckoutBtn').onclick = () => {
  if (!st.cart.size) return toast('Your cart is empty!');
  if (!st.user) { $('#cartDlg').close(); toast("Please login to checkout"); $('#loginDlg').showModal(); return; }
  let tot = 0;
  [...st.cart].forEach(id => { const p = st.all.find(x => x.id == id); if (p) tot += p.per_day_rent * (st.days || 1); });
  $('#checkoutSummary').innerHTML = `<b>Items:</b> ${st.cart.size}<br><b>Amount Payable:</b> ₹${tot}`;
  $('#payBtn').textContent = `Pay ₹${tot}`;
  $('#cartDlg').close(); $('#checkoutDlg').showModal();
};
$('#checkoutDlg form').onsubmit = e => {
  st.cart.clear(); render(); $('#cartN').hidden = true;
  toast("🎉 Payment Successful! Your order is confirmed.");
};
document.querySelectorAll('.tabs a').forEach(a => a.addEventListener('click', () => toast('Navigating to ' + a.textContent)));

// Compare Feature Logic
window.updateCmpBar = () => {
  const b = $('#cmpBar');
  if(st.compare.size === 0) { b.hidden = true; return; }
  b.hidden = false;
  $('#cmpText').textContent = `${st.compare.size} item${st.compare.size > 1 ? 's' : ''} selected to compare`;
  $('#cmpGo').disabled = st.compare.size !== 2;
};
document.addEventListener('change', e => {
  if (e.target.classList.contains('cmp-chk')) {
    const id = +e.target.dataset.cmp;
    if (e.target.checked) {
      if (st.compare.size >= 2) { e.target.checked = false; return toast('You can only compare 2 items at a time!'); }
      st.compare.add(id);
    } else { st.compare.delete(id); }
    updateCmpBar();
  }
});
$('#cmpClose').onclick = () => { st.compare.clear(); render(); updateCmpBar(); };
$('#cmpGo').onclick = () => {
  const items = [...st.compare].map(id => st.all.find(x => x.id == id));
  if (items.length !== 2) return;
  const getSpecs = (n) => {
    const s = n.toLowerCase();
    return {
      res: s.includes('ps5') || s.includes('series x') ? '4K @ 120Hz' : s.includes('series s') ? '1440p @ 120Hz' : s.includes('quest') ? '1832×1920 per eye' : '1080p @ 60Hz',
      store: s.includes('ps5') ? '825GB SSD' : s.includes('series x') ? '1TB Custom NVMe' : s.includes('quest') ? '128GB/512GB' : '512GB NVMe',
      ctrl: s.includes('controller') || s.includes('quest') ? '2 included' : '1 Wireless Controller'
    };
  };
  const s1 = getSpecs(items[0].name), s2 = getSpecs(items[1].name);
  $('#cmpContent').innerHTML = `
    <table class="cmp-tbl">
      <tr><th>Product</th><td><img src="${items[0].image}" width="60"><br><b>${items[0].name}</b></td><td><img src="${items[1].image}" width="60"><br><b>${items[1].name}</b></td></tr>
      <tr><th>Daily Rate</th><td>${rupee(items[0].per_day_rent)}/day</td><td>${rupee(items[1].per_day_rent)}/day</td></tr>
      <tr><th>Resolution</th><td>${s1.res}</td><td>${s2.res}</td></tr>
      <tr><th>Storage</th><td>${s1.store}</td><td>${s2.store}</td></tr>
      <tr><th>Controllers</th><td>${s1.ctrl}</td><td>${s2.ctrl}</td></tr>
    </table>
  `;
  $('#cmpDlg').showModal();
};

// Theme Toggle Logic
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
$('#themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';

$('#themeToggle').onclick = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  $('#themeToggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  toast(newTheme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled');
};

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('ServiceWorker registered with scope:', reg.scope))
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
}
