/**
 * ROYAL FURNITURE HOUSE — script.js
 * Navbar · Hero Slideshow · Product Filter · Testimonial Slider
 * Gallery Lightbox · Contact Form · Back-to-Top · Smooth Scroll
 */
'use strict';

/* ── AOS ── */
AOS.init({ duration:800, easing:'ease-out-quad', once:true, offset:55 });

/* ══════════════════════════
   NAVBAR
══════════════════════════ */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
const nmLinks = navMenu ? navMenu.querySelectorAll('.nm-link') : [];

// Scroll solid
window.addEventListener('scroll', () => {
  navbar.classList.toggle('solid', window.scrollY > 55);
  highlightNav();
  bttToggle();
}, { passive:true });

// Active link
function highlightNav() {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) cur = s.id;
  });
  nmLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
}

// Burger toggle
if (burger) {
  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
}

// Close on link click
nmLinks.forEach(l => l.addEventListener('click', () => {
  navMenu.classList.remove('open');
  burger && burger.classList.remove('open');
  burger && burger.setAttribute('aria-expanded', 'false');
}));

// Close on outside click
document.addEventListener('click', e => {
  if (navMenu && !navMenu.contains(e.target) && burger && !burger.contains(e.target)) {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ══════════════════════════
   HERO SLIDESHOW
══════════════════════════ */
const heroSlides = document.querySelectorAll('.hs');
const heroDots   = document.querySelectorAll('.hdot');
let hsIdx = 0, hsTimer;

function goSlide(idx) {
  heroSlides[hsIdx].classList.remove('active');
  heroDots[hsIdx].classList.remove('active');
  hsIdx = (idx + heroSlides.length) % heroSlides.length;
  heroSlides[hsIdx].classList.add('active');
  heroDots[hsIdx].classList.add('active');
}

function startSlide() { hsTimer = setInterval(() => goSlide(hsIdx + 1), 5000); }
function stopSlide()  { clearInterval(hsTimer); }

heroDots.forEach((dot, i) => dot.addEventListener('click', () => { stopSlide(); goSlide(i); startSlide(); }));
if (heroSlides.length) startSlide();

// Touch swipe on hero
let hTouchX = 0;
const heroEl = document.querySelector('.hero');
if (heroEl) {
  heroEl.addEventListener('touchstart', e => { hTouchX = e.touches[0].clientX; }, { passive:true });
  heroEl.addEventListener('touchend', e => {
    const dx = hTouchX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { stopSlide(); goSlide(dx > 0 ? hsIdx + 1 : hsIdx - 1); startSlide(); }
  }, { passive:true });
}

/* ══════════════════════════
   PRODUCT FILTER
══════════════════════════ */
const fBtns = document.querySelectorAll('.fbtn');
const pCards = document.querySelectorAll('.pcard');

fBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    pCards.forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hidden', !show);
      if (show) { c.style.animation = 'fadeUp .4s ease both'; }
    });
  });
});

/* ══════════════════════════
   TESTIMONIAL SLIDER
══════════════════════════ */
const tTrack = document.getElementById('ttrack');
const tDots  = document.querySelectorAll('.tdot');
const tPrev  = document.getElementById('tprev');
const tNext  = document.getElementById('tnext');
let tIdx = 0, tTimer;
const tTotal = tDots.length;

function goT(idx) {
  tIdx = ((idx % tTotal) + tTotal) % tTotal;
  if (tTrack) tTrack.style.transform = `translateX(-${tIdx * 100}%)`;
  tDots.forEach((d, i) => d.classList.toggle('active', i === tIdx));
}

function startT() { tTimer = setInterval(() => goT(tIdx + 1), 5500); }
function stopT()  { clearInterval(tTimer); }

if (tPrev) tPrev.addEventListener('click', () => { stopT(); goT(tIdx - 1); startT(); });
if (tNext) tNext.addEventListener('click', () => { stopT(); goT(tIdx + 1); startT(); });
tDots.forEach((d, i) => d.addEventListener('click', () => { stopT(); goT(i); startT(); }));

// Swipe
let tTouchX = 0;
if (tTrack) {
  tTrack.addEventListener('touchstart', e => { tTouchX = e.touches[0].clientX; }, { passive:true });
  tTrack.addEventListener('touchend',   e => {
    const dx = tTouchX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { stopT(); goT(dx > 0 ? tIdx + 1 : tIdx - 1); startT(); }
  }, { passive:true });
}
startT();

/* ══════════════════════════
   GALLERY LIGHTBOX
══════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');

document.querySelectorAll('.gitem').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img || !lightbox) return;
    lbImg.src = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLb() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 400);
}
if (lbClose) lbClose.addEventListener('click', closeLb);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target === document.querySelector('.lb-inner')) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLb(); });

/* ══════════════════════════
   CONTACT FORM
══════════════════════════ */
const cForm   = document.getElementById('cform');
const fSucc   = document.getElementById('fsuccess');
const cSubBtn = document.getElementById('csub');

if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cname')?.value.trim();
    const phone= document.getElementById('cphone')?.value.trim();
    const msg  = document.getElementById('cmsg')?.value.trim();
    const subj = document.getElementById('csubject')?.value || 'General Inquiry';

    if (!name || !phone || !msg) { shakeEl(cForm); return; }

    if (cSubBtn) { cSubBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending…'; cSubBtn.disabled = true; }

    const waText = encodeURIComponent(
      `Hello Royal Furniture House!\n\nName: ${name}\nPhone: ${phone}\nInterested In: ${subj}\n\nMessage:\n${msg}`
    );

    setTimeout(() => {
      if (fSucc) fSucc.classList.add('show');
      cForm.reset();
      if (cSubBtn) { cSubBtn.innerHTML = '<i class="ri-send-plane-fill"></i> Send Message'; cSubBtn.disabled = false; }
      window.open(`https://wa.me/923000021231?text=${waText}`, '_blank', 'noopener,noreferrer');
      setTimeout(() => fSucc?.classList.remove('show'), 7000);
    }, 900);
  });
}

function shakeEl(el) {
  el.style.animation = 'shake .45s ease';
  setTimeout(() => { el.style.animation = ''; }, 500);
}

/* ══════════════════════════
   BACK TO TOP
══════════════════════════ */
const btt = document.getElementById('btt');
function bttToggle() { btt?.classList.toggle('show', window.scrollY > 550); }
if (btt) btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ══════════════════════════
   SMOOTH SCROLL
══════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight : 76;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior:'smooth' });
  });
});

/* ══════════════════════════
   FOOTER YEAR
══════════════════════════ */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* ══════════════════════════
   INJECT KEYFRAMES
══════════════════════════ */
const ks = document.createElement('style');
ks.textContent = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-9px)} 40%{transform:translateX(9px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
`;
document.head.appendChild(ks);

/* Initial scroll check */
window.dispatchEvent(new Event('scroll'));
