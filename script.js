/**
 * ROYAL FURNITURE HOUSE — v2 script.js (vanilla JS, no build step)
 * Nav drawer · Hero + Testimonial sliders · Search/Filter/Sort · Quick View
 * Enquiry cart · Gallery lightbox · Validated contact form · Back-to-top
 * Respects prefers-reduced-motion: no autoplay / marquee / AOS when set.
 */
'use strict';

/* ---------- Helpers ---------- */
const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
const WA_NUMBER = '923000021231';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = (n) => 'PKR ' + Number(n).toLocaleString('en-PK');
const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
let lastFocus = null;
function lockScroll(on) { document.body.classList.toggle('no-scroll', !!on); }
function showToast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- AOS (disabled under reduced motion) ---------- */
if (window.AOS) {
  if (reducedMotion) { $$('[data-aos]').forEach((el) => el.removeAttribute('data-aos')); }
  else { AOS.init({ duration: 800, easing: 'ease-out-quad', once: true, offset: 55 }); }
}

/* ---------- Navbar + mobile drawer ---------- */
const navbar = $('#navbar'), burger = $('#burger'), navMenu = $('#navMenu'), navOverlay = $('#navOverlay');
const nmLinks = $$('.nm-link', navMenu);
function setNav(open) {
  if (!navMenu || !burger) return;
  navMenu.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  if (navOverlay) navOverlay.classList.toggle('show', open);
  lockScroll(open);
}
if (burger) burger.addEventListener('click', () => setNav(!navMenu.classList.contains('open')));
if (navOverlay) navOverlay.addEventListener('click', () => setNav(false));
nmLinks.forEach((l) => l.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) { setNav(false); burger.focus(); }
});

/* Scroll: solid navbar, active link, back-to-top (rAF-throttled) */
const btt = $('#btt');
let ticking = false;
function onScroll() {
  if (navbar) navbar.classList.toggle('solid', window.scrollY > 55);
  if (btt) btt.classList.toggle('show', window.scrollY > 550);
  let cur = '';
  $$('section[id]').forEach((s) => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  nmLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
onScroll();

/* ---------- Hero slideshow (pause on hover/focus + tab hidden) ---------- */
const heroSlides = $$('.hs'), heroDots = $$('.hdot');
let hsIdx = 0, hsTimer = null;
function goSlide(idx) {
  if (!heroSlides.length) return;
  heroSlides[hsIdx].classList.remove('active'); heroDots[hsIdx].classList.remove('active');
  hsIdx = (idx + heroSlides.length) % heroSlides.length;
  heroSlides[hsIdx].classList.add('active'); heroDots[hsIdx].classList.add('active');
}
function startSlide() { if (reducedMotion || !heroSlides.length || hsTimer) return; hsTimer = setInterval(() => goSlide(hsIdx + 1), 5000); }
function stopSlide() { clearInterval(hsTimer); hsTimer = null; }
heroDots.forEach((dot, i) => dot.addEventListener('click', () => { stopSlide(); goSlide(i); startSlide(); }));
const heroEl = $('.hero');
if (heroEl) {
  heroEl.addEventListener('mouseenter', stopSlide);
  heroEl.addEventListener('mouseleave', startSlide);
  heroEl.addEventListener('focusin', stopSlide);
  heroEl.addEventListener('focusout', startSlide);
  let hx = 0;
  heroEl.addEventListener('touchstart', (e) => { hx = e.touches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', (e) => {
    const dx = hx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { stopSlide(); goSlide(dx > 0 ? hsIdx + 1 : hsIdx - 1); startSlide(); }
  }, { passive: true });
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stopSlide(); stopT(); } else { startSlide(); startT(); }
});
startSlide();

/* ---------- Products: search + filter + sort + count ---------- */
const fBtns = $$('.fbtn'), pCards = $$('.pcard'), prodGrid = $('#prodGrid');
const searchInput = $('#prodSearch'), searchClear = $('#searchClear'), sortSel = $('#prodSort');
const resultCount = $('#resultCount'), emptyState = $('#emptyState');
let activeFilter = 'all';
function applyProducts() {
  const q = (searchInput ? searchInput.value.trim().toLowerCase() : '');
  if (searchClear) searchClear.hidden = !q;
  const visible = pCards.filter((c) => {
    const okCat = activeFilter === 'all' || c.dataset.cat === activeFilter;
    const hay = `${c.dataset.name || ''} ${c.dataset.cat || ''} ${c.textContent || ''}`.toLowerCase();
    const okQ = !q || hay.includes(q);
    const show = okCat && okQ;
    c.classList.toggle('hidden', !show);
    return show;
  });
  // Sort only the visible cards, keeping Featured = original DOM order.
  const mode = sortSel ? sortSel.value : 'featured';
  const ordered = [...visible].sort((a, b) => {
    if (mode === 'price-asc') return (+a.dataset.price) - (+b.dataset.price);
    if (mode === 'price-desc') return (+b.dataset.price) - (+a.dataset.price);
    return pCards.indexOf(a) - pCards.indexOf(b);
  });
  ordered.forEach((c) => prodGrid.appendChild(c));
  if (resultCount) resultCount.textContent = `Showing ${visible.length} of ${pCards.length} products`;
  if (emptyState) emptyState.hidden = visible.length !== 0;
}
fBtns.forEach((btn) => btn.addEventListener('click', () => {
  fBtns.forEach((b) => b.classList.remove('active')); btn.classList.add('active');
  activeFilter = btn.dataset.f; applyProducts();
}));
if (searchInput) searchInput.addEventListener('input', applyProducts);
if (searchClear) searchClear.addEventListener('click', () => { searchInput.value = ''; applyProducts(); searchInput.focus(); });
if (sortSel) sortSel.addEventListener('change', applyProducts);
$('#resetFilters')?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  activeFilter = 'all';
  fBtns.forEach((b) => b.classList.toggle('active', b.dataset.f === 'all'));
  if (sortSel) sortSel.value = 'featured';
  applyProducts();
});
// Category cards can pre-select a filter.
$$('[data-filter-link]').forEach((a) => a.addEventListener('click', () => {
  const f = a.dataset.filterLink;
  fBtns.forEach((b) => b.classList.toggle('active', b.dataset.f === f));
  activeFilter = f; applyProducts();
}));
applyProducts();

/* ---------- Product data (read from the card's own data attributes) ---------- */
function cardData(id) {
  const card = $(`.pcard[data-id="${id}"]`); if (!card) return null;
  const img = card.querySelector('img');
  return {
    id, name: card.dataset.name, price: +card.dataset.price,
    cat: card.querySelector('.pcat')?.textContent || '',
    desc: card.querySelector('.pcard-body p')?.textContent || '',
    material: card.dataset.material || '', size: card.dataset.size || '', seats: card.dataset.seats || '',
    img: img ? img.src : '', alt: img ? img.alt : ''
  };
}

/* ---------- Quick View modal ---------- */
const qv = $('#quickModal');
let qvProduct = null;
function openQuick(id, trigger) {
  const d = cardData(id); if (!d || !qv) return;
  qvProduct = d; lastFocus = trigger || document.activeElement;
  $('#qvImg').src = d.img.replace(/w=\d+/, 'w=1000').replace(/q=\d+/, 'q=85');
  $('#qvImg').alt = d.alt; $('#qvCat').textContent = d.cat;
  $('#qvTitle').textContent = d.name; $('#qvDesc').textContent = d.desc;
  $('#qvMaterial').textContent = d.material; $('#qvSize').textContent = d.size; $('#qvSeats').textContent = d.seats;
  $('#qvPrice').textContent = money(d.price);
  $('#qvWa').href = waLink(`Hello Royal Furniture House!\n\nI want to order: ${d.name} — ${money(d.price)}.\nPlease confirm availability and delivery.`);
  $('#qvAdd').onclick = () => { addToCart(d.id); };
  qv.hidden = false; lockScroll(true);
  $('.modal-close', qv).focus();
}
function closeQuick() { if (!qv) return; qv.hidden = true; lockScroll(false); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
$$('[data-quick]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openQuick(b.dataset.quick, b); }));
$$('.pcard-img').forEach((el) => el.addEventListener('click', () => {
  const card = el.closest('.pcard'); if (card) openQuick(card.dataset.id, el);
}));
$$('[data-close-modal]', qv).forEach((el) => el.addEventListener('click', closeQuick));

/* ---------- Enquiry cart ---------- */
const cart = new Map(); // id -> qty (qty is 1 per product; repeated adds are ignored with a toast)
const cartDrawer = $('#cartDrawer'), cartOverlay = $('#cartOverlay'), cartBtn = $('#cartBtn');
const cartItemsEl = $('#cartItems'), cartEmpty = $('#cartEmpty'), cartFoot = $('#cartFoot');
function cartTotal() { let t = 0; cart.forEach((qty, id) => { const d = cardData(id); if (d) t += d.price * qty; }); return t; }
function renderCart() {
  const count = cart.size;
  const badge = $('#cartCount');
  if (badge) { badge.textContent = String(count); badge.dataset.empty = count === 0 ? 'true' : 'false'; }
  if (cartBtn) cartBtn.setAttribute('aria-label', `Open enquiry cart, ${count} item${count === 1 ? '' : 's'}`);
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  cart.forEach((qty, id) => {
    const d = cardData(id); if (!d) return;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `<img src="${d.img}" alt="" width="64" height="64" loading="lazy" decoding="async"/>
      <div><h4></h4><p></p></div>
      <button type="button" class="cart-remove" aria-label="Remove ${d.name} from enquiry"><i class="ri-delete-bin-line"></i></button>`;
    row.querySelector('h4').textContent = d.name;
    row.querySelector('p').textContent = money(d.price);
    row.querySelector('.cart-remove').addEventListener('click', () => { cart.delete(id); renderCart(); });
    cartItemsEl.appendChild(row);
  });
  const empty = count === 0;
  if (cartEmpty) cartEmpty.hidden = !empty;
  if (cartFoot) cartFoot.hidden = empty;
  if (!empty) {
    $('#cartTotal').textContent = money(cartTotal());
    const lines = [...cart.keys()].map((id, i) => { const d = cardData(id); return `${i + 1}. ${d.name} — ${money(d.price)}`; });
    $('#cartWa').href = waLink(`Hello Royal Furniture House!\n\nI would like to enquire about these items:\n${lines.join('\n')}\n\nTotal: ${money(cartTotal())}\nPlease confirm availability and delivery.`);
  }
}
function addToCart(id) {
  const d = cardData(id); if (!d) return;
  if (cart.has(id)) { showToast(`${d.name} is already in your enquiry`); return; }
  cart.set(id, 1); renderCart();
  const btn = $(`[data-add="${id}"]`);
  if (btn) { btn.classList.add('added'); btn.innerHTML = '<i class="ri-check-line"></i> Added'; }
  showToast(`${d.name} added to enquiry`);
}
$$('[data-add]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); addToCart(b.dataset.add); }));
function setCart(open) {
  if (!cartDrawer) return;
  cartDrawer.classList.toggle('open', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  if (cartOverlay) cartOverlay.hidden = !open;
  if (cartBtn) cartBtn.setAttribute('aria-expanded', String(open));
  lockScroll(open);
  if (open) $('#cartClose').focus();
  else if (cartBtn) cartBtn.focus();
}
if (cartBtn) cartBtn.addEventListener('click', () => setCart(true));
$('#cartClose')?.addEventListener('click', () => setCart(false));
if (cartOverlay) cartOverlay.addEventListener('click', () => setCart(false));
$('#cartClear')?.addEventListener('click', () => {
  cart.clear(); renderCart();
  $$('.btn-add.added').forEach((b) => { b.classList.remove('added'); b.innerHTML = '<i class="ri-shopping-bag-line"></i> Add to Enquiry'; });
});
renderCart();

/* ---------- Testimonial slider (swipe, dots, pause on hover/focus + tab hidden) ---------- */
const tTrack = $('#ttrack'), tDots = $$('.tdot');
const tPrev = $('#tprev'), tNext = $('#tnext');
let tIdx = 0, tTimer = null;
const tTotal = tDots.length || 3;
function goT(idx) {
  tIdx = ((idx % tTotal) + tTotal) % tTotal;
  if (tTrack) tTrack.style.transform = `translateX(-${tIdx * 100}%)`;
  tDots.forEach((d, i) => d.classList.toggle('active', i === tIdx));
}
function startT() { if (reducedMotion || !tTrack || tTimer) return; tTimer = setInterval(() => goT(tIdx + 1), 5500); }
function stopT() { clearInterval(tTimer); tTimer = null; }
if (tPrev) tPrev.addEventListener('click', () => { stopT(); goT(tIdx - 1); startT(); });
if (tNext) tNext.addEventListener('click', () => { stopT(); goT(tIdx + 1); startT(); });
tDots.forEach((d, i) => d.addEventListener('click', () => { stopT(); goT(i); startT(); }));
if (tTrack) {
  const slider = tTrack.closest('.tslider');
  slider.addEventListener('mouseenter', stopT); slider.addEventListener('mouseleave', startT);
  slider.addEventListener('focusin', stopT); slider.addEventListener('focusout', startT);
  let tx = 0;
  tTrack.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  tTrack.addEventListener('touchend', (e) => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { stopT(); goT(dx > 0 ? tIdx + 1 : tIdx - 1); startT(); }
  }, { passive: true });
}
startT();

/* ---------- Gallery lightbox: Prev/Next + keyboard + counter ---------- */
const lightbox = $('#lightbox'), lbImg = $('#lbImg'), lbCounter = $('#lbCounter');
const galItems = $$('.gitem');
let lbIdx = 0;
function showLb(idx) {
  lbIdx = (idx + galItems.length) % galItems.length;
  const img = galItems[lbIdx].querySelector('img');
  lbImg.src = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
  lbImg.alt = img.alt;
  if (lbCounter) lbCounter.textContent = `${lbIdx + 1} / ${galItems.length}`;
}
function openLb(idx, trigger) {
  if (!lightbox) return;
  lastFocus = trigger || document.activeElement;
  showLb(idx); lightbox.hidden = false; lockScroll(true);
  $('#lbClose').focus();
}
function closeLb() {
  if (!lightbox) return;
  lightbox.hidden = true; lockScroll(false);
  setTimeout(() => { lbImg.src = ''; }, 300);
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
galItems.forEach((item, i) => item.addEventListener('click', () => openLb(i, item)));
$('#lbClose')?.addEventListener('click', closeLb);
$('#lbPrev')?.addEventListener('click', () => showLb(lbIdx - 1));
$('#lbNext')?.addEventListener('click', () => showLb(lbIdx + 1));
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });

/* ---------- Global Escape: closes whichever overlay is open ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (lightbox && !lightbox.hidden) closeLb();
  else if (qv && !qv.hidden) closeQuick();
  else if (cartDrawer && cartDrawer.classList.contains('open')) setCart(false);
  else if (navMenu && navMenu.classList.contains('open')) setNav(false);
});
/* Lightbox arrows (only while it is open) */
document.addEventListener('keydown', (e) => {
  if (lightbox && !lightbox.hidden) {
    if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
    if (e.key === 'ArrowRight') showLb(lbIdx + 1);
  }
});

/* ---------- Contact form: inline validation + WhatsApp ---------- */
const cForm = $('#cform'), fSucc = $('#fsuccess'), cSubBtn = $('#csub');
function setErr(input, errEl, bad) {
  if (!input) return;
  input.setAttribute('aria-invalid', String(bad));
  if (errEl) errEl.hidden = !bad;
}
function validPakPhone(raw) {
  const digits = raw.replace(/[^\d+]/g, '');
  // 03XX-XXXXXXX (11 digits, starts 03) or +92 3XX XXXXXXX
  if (/^03\d{9}$/.test(digits)) return true;
  if (/^\+923\d{9}$/.test(digits)) return true;
  if (/^923\d{9}$/.test(digits)) return true;
  return false;
}
if (cForm) {
  ['cname', 'cphone', 'cmsg'].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => setErr(el, document.getElementById('err' + id.slice(1).charAt(0).toUpperCase() + id.slice(2)), false));
  });
  cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#cname').value.trim();
    const phone = $('#cphone').value.trim();
    const msg = $('#cmsg').value.trim();
    const subj = $('#csubject').value || 'General Inquiry';
    const nameBad = name.length < 2;
    const phoneBad = !validPakPhone(phone);
    const msgBad = msg.length < 5;
    setErr($('#cname'), $('#errName'), nameBad);
    setErr($('#cphone'), $('#errPhone'), phoneBad);
    setErr($('#cmsg'), $('#errMsg'), msgBad);
    if (nameBad || phoneBad || msgBad) {
      const firstBad = nameBad ? $('#cname') : phoneBad ? $('#cphone') : $('#cmsg');
      firstBad.focus();
      cForm.style.animation = 'shake .45s ease';
      setTimeout(() => { cForm.style.animation = ''; }, 500);
      return;
    }
    if (cSubBtn) { cSubBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending…'; cSubBtn.disabled = true; }
    const waText = `Hello Royal Furniture House!\n\nName: ${name}\nPhone: ${phone}\nInterested In: ${subj}\n\nMessage:\n${msg}`;
    setTimeout(() => {
      if (fSucc) fSucc.classList.add('show');
      cForm.reset();
      if (cSubBtn) { cSubBtn.innerHTML = '<i class="ri-send-plane-fill"></i> Send Message'; cSubBtn.disabled = false; }
      window.open(waLink(waText), '_blank', 'noopener,noreferrer');
      setTimeout(() => fSucc?.classList.remove('show'), 7000);
    }, 700);
  });
}

/* ---------- Smooth scroll (offset for fixed navbar) ---------- */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight : 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

/* ---------- Footer year ---------- */
const yrEl = $('#yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* Initial scroll state */
window.dispatchEvent(new Event('scroll'));
