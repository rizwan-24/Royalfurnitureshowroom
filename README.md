# Royal Furniture House — v2 (Fully Responsive)

A complete, ready-to-use rebuild of the Royal Furniture House single-page
website (Karachi, since 2012). Same business, same products and prices, same
forest-green + champagne-gold branding — rebuilt mobile-first so it works
perfectly on phones, tablets, and desktops.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole site: nav, hero, categories, products, about, why-us, gallery, testimonials, contact, footer, Quick View modal, enquiry cart drawer, lightbox |
| `style.css` | Mobile-first CSS, all breakpoints, no horizontal overflow |
| `script.js` | Vanilla JS only — no build step, no framework |
| `ANALYSIS.md` | What was good in v1, the responsive gaps found (with file/line refs), and what v2 fixed |
| `README.md` | This file |

## How to run locally

No server or build step is needed. Just open the file:

1. Double-click `index.html`, **or**
2. From this folder, run a tiny static server (recommended, so fonts/CDN
   assets load exactly as they will online):

```bash
cd royal-furniture-v2
python3 -m http.server 8000
# then open http://localhost:8000
```

> The site needs internet for Google Fonts, Remix Icons, AOS, and the
> Unsplash product photos. The layout, text, and buttons work offline;
> the photos/fonts fall back gracefully.

## How to deploy to GitHub Pages

The original repo is `rizwan-24/Royalfurnitureshowroom` (branch `main`).
These v2 files are **not** pushed automatically — deploy when ready:

**Option A — replace the site in the existing repo (recommended):**
```bash
# from a local clone of rizwan-24/Royalfurnitureshowroom
cp -r /path/to/royal-furniture-v2/* .
git add index.html style.css script.js
git commit -m "Rebuild: fully responsive v2 (search, Quick View, enquiry cart)"
git push origin main
```
Then in GitHub: **Settings → Pages → Source: Deploy from a branch →
Branch: `main` / `/ (root)`**. The site goes live at
`https://rizwan-24.github.io/Royalfurnitureshowroom/`.

**Option B — preview first:** push to a branch (`git checkout -b v2-preview`),
enable Pages on that branch, check it on a real phone, then merge to `main`.

## What changed in v2

**Responsive (top priority)**
- Mobile-first CSS, fluid container padding (16px <480px, 20px 480–768px, 28px above).
- Breakpoints at 360 / 480 / 640 / 768 / 1024 / 1280.
- No horizontal overflow at any width: `overflow-x: clip` on `html`/`body`,
  `min-width: 0` on grid children, `max-width: 100%` on media.
- Hero title `clamp(34px, 9vw, 82px)`; hero stats 2-col on phones, 1-col under 380px; hero buttons stack full-width under 520px, min-height 48px.
- Filter row scrolls horizontally on mobile instead of wrapping/overflowing.
- Grids: 1 col <640px, 2 col 640–1023px, 3 col 1024–1279px, 4 col products ≥1280px.
- Mobile nav is a proper drawer: closes on link click, outside click, and
  Escape; burger animates; `aria-expanded` updates; body scroll locks.
- All touch targets ≥44px. WhatsApp float (bottom 16px) and back-to-top
  (bottom 84px) can never overlap.
- Footer, testimonial header, contact grid, and About visuals all stack
  cleanly at 360px. Map iframe is fluid height.
- `prefers-reduced-motion` disables slideshow autoplay, marquee, and AOS.
- Viewport no longer blocks pinch-zoom (`maximum-scale` removed).

**New functionality**
- Product search + category filter + sort (Featured / Price low→high /
  high→low), live result count, and an empty state with a reset button.
- Quick View modal per product: bigger image, full description, price,
  material / size (approx.) / capacity, WhatsApp order button. Esc closes,
  focus returns to the card.
- Enquiry cart: “Add to Enquiry” on each product, drawer with count badge,
  remove items, PKR total, and one “Send Enquiry on WhatsApp” button that
  lists every item + total in a single message.
- Gallery lightbox with Prev/Next buttons, ←/→ keyboard keys, and a
  counter (e.g. `3 / 9`).
- Contact form validation: name required, Pakistani phone
  (`03XX-XXXXXXX`, `+92` accepted), message required — inline errors,
  focus moves to the first error; success opens WhatsApp prefilled.
- Hero + testimonial sliders: swipe, dots, pause on hover/focus, autoplay
  pauses when the tab is hidden.
- JSON-LD `FurnitureStore` schema, better meta description, skip-to-content
  link, aria labels, `:focus-visible` styles, lazy-loaded images with
  `decoding="async"` and width/height (no layout shift).
- Inline-SVG favicon (gold “R” monogram) — no `favicon_io.zip` needed.

**Preserved exactly**
- Royal Furniture House, Karachi, since 2012; phone 0300-0021231;
  WhatsApp `https://wa.me/923000021231`; Karachi Market, Karachi, Sindh;
  Mon–Sat 10AM–9PM, Sun 12PM–7PM.
- All 8 products, names, descriptions, and PKR prices (85,000 / 1,20,000 /
  65,000 / 95,000 / 38,000 / 42,000 / 1,10,000 / 28,000).
- Testimonials (Ahmed Raza, Fatima Siddiqui, Usman Khan), stats
  (12+ years, 5,000+ clients, 200+ designs, 100% solid wood), all Unsplash
  image URLs, fonts, and branding.

## Responsive test checklist

Test at 320, 360, 390, 768, 1024, 1280, and 1440px (DevTools device toolbar
or real devices). At every width, check:

- [ ] No horizontal scrollbar / no sideways scroll.
- [ ] Hero title fits, no text clipped; stats readable; buttons tappable.
- [ ] Nav drawer opens/closes (link, outside tap, Escape); burger animates.
- [ ] Filter row scrolls sideways; no filter button is cut off.
- [ ] Product grid columns match the width (1 / 2 / 3 / 4).
- [ ] Search “sofa” → 1 result; search “xyz” → empty state; sort low→high
      puts Vanity Dressing Table (28,000) first.
- [ ] Quick View opens, Esc closes, focus returns to the product card.
- [ ] Add 2 items to the enquiry cart → badge shows 2, total is correct,
      WhatsApp message lists both items + total.
- [ ] Gallery lightbox: Prev/Next work, counter reads e.g. `3 / 9`.
- [ ] Contact form: empty submit shows 3 inline errors; a valid
      `0300-0021231` number passes and opens WhatsApp.
- [ ] Footer stacks to 1 column at 360px; map fits the screen.
- [ ] WhatsApp float and back-to-top never overlap.
- [ ] With “Reduce motion” on (OS setting), the slideshow/marquee do not move.
- [ ] Pinch-zoom works on mobile (no `maximum-scale` blocking it).

## Notes / trade-offs

- Product “Size (approx.)” values in Quick View are labelled approx. because
  the original site gave no exact dimensions; they are derived from the
  product descriptions (e.g. king bed ≈ 72″ × 78″, conference table seats 10).
  Confirm exact sizes with the showroom before printing them anywhere else.
- The map still uses the original Google Maps embed for Karachi Market.
- No backend: enquiries go through WhatsApp, exactly as in v1.
