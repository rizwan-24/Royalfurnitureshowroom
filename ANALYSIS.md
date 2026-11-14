# Analysis — Royal Furniture House v1 → v2

Source reviewed: `~/workspace/projects/royal-furniture/`
(`index.html` 853 lines, `style.css` 1407 lines, `script.js` 248 lines).
Original repo: `rizwan-24/Royalfurnitureshowroom`, branch `main`.

## What was good in v1

- **Complete, real content.** All 8 products with exact PKR prices, real
  testimonials, real phone/address/hours, and a working WhatsApp contact
  flow. No placeholder copy anywhere.
- **Strong, consistent branding.** Forest green + champagne gold, Cormorant
  Garamond display + DM Sans body, and the same Unsplash photography
  throughout — worth preserving untouched.
- **Good bones.** Hero slideshow, category filter, gallery lightbox,
  testimonial slider, and WhatsApp form were all present and wired up;
  v2 extends them rather than rebuilding from scratch.
- **Performance basics already there.** `loading="lazy"` and
  `width`/`height` on most images, font preconnects.

## Responsive gaps found in v1 (with file/line references)

| # | Gap | Where in v1 | Impact |
| --- | --- | --- | --- |
| 1 | Viewport blocks pinch-zoom | `index.html:5` — `maximum-scale=1.0` | Accessibility failure: users who need zoom cannot zoom on mobile. |
| 2 | `overflow-x: hidden` only, on `body` | `style.css:55` | `hidden` on body alone does not reliably stop horizontal scroll from wide children; `clip` on both `html` and `body` is the robust fix. |
| 3 | Hero title too big on small phones | `style.css:330` — `clamp(42px, 6.5vw, 82px)` | 42px minimum is wide for a 320–360px screen; long words / the two-line title can crowd or clip. |
| 4 | Hero left offset uses `100vw` | `style.css:315` — `margin-left:max(28px, calc((100vw - var(--con)) / 2))` | `100vw` includes the scrollbar width, a classic horizontal-overflow source. |
| 5 | Desktop-first media queries only | `style.css:1331–1407` — breakpoints 1100 / 960 / 780 / 520px only | No rules at 360px; the smallest phones were an afterthought, not the base. Container padding was a fixed 28px at every width. |
| 6 | Filter row wraps | `style.css:564–572` — `.filter-row { flex-wrap: wrap }` | On a 360px screen the four pill buttons wrap into a tall, ragged block and push products down. |
| 7 | Product grid jumps 4 → 3 → 2 → 1 | `style.css:592, 1332, 1381, 1392` | No 640px step; cards are cramped at ~600px and the 4-col desktop grid is the default, not the enhancement. |
| 8 | Mobile nav: no scroll lock, no Escape, no overlay | `script.js:31–62` | Menu opens but the page behind it still scrolls; keyboard users cannot Escape out of it; `aria-expanded` was set but there was no outside-click overlay. |
| 9 | Touch targets under 44px | `style.css:413–424` (scroll arrow 48px is fine, but) `style.css:1315` dots 8px, `style.css:1285` lightbox close offset `-16px` off-screen, `.pwa` 38px (`style.css:632`) | Dots, the WhatsApp icon button, and the lightbox close button are hard to tap accurately on phones. |
| 10 | Floating buttons can collide | `style.css:1260, 1307` — WhatsApp `bottom:28px`, back-to-top `bottom:98px` (only 70px apart at 520px: 18px / 82px) | On short screens / when the keyboard is open the two fixed buttons can overlap each other. |
| 11 | About visuals overflow on mobile | `style.css:729–752` — `.av-small { right:-30px }`, `.av-badge { left:-24px }` | Negative offsets push the badge/thumbnail outside the viewport on narrow screens (only partly corrected at 780px: `right:-12px`, `left:-10px`). |
| 12 | Gallery spans collapse abruptly | `style.css:1383` — at ≤780px `.gitem--wide/.gitem--tall` lose their spans | Fine in itself, but combined with fixed `grid-auto-rows:170px` the gallery looked cramped at 390px with no intermediate step. |
| 13 | Testimonial header wraps badly | `style.css:1398–1403` — `.tcard-head { flex-wrap:wrap }` only at ≤520px | At 360–520px the avatar, name, and stars could still collide before the wrap kicked in; stars had `margin-left:auto` with no min-width guard. |
| 14 | No reduced-motion support | `script.js:8–9` — `AOS.init(...)` unconditionally; `style.css` marquee/zoom animations unconditional | Users with “Reduce motion” on still got autoplay, marquee, and Ken Burns zoom. |
| 15 | Lightbox: no Prev/Next, no counter, no keyboard arrows | `index.html` lightbox block; `script.js:143–171` | Only Esc/close; users could not step through the 9 images. |
| 16 | Contact form: no inline errors, no phone validation | `script.js:175–204` | Empty submit only shook the form; an invalid phone number was accepted and sent to WhatsApp. |
| 17 | No search, sort, Quick View, or cart | — | Shoppers could only filter by 4 categories; no way to find “desk” quickly, compare prices, or send one combined enquiry. |
| 18 | No favicon, no JSON-LD, no skip link | `index.html:1–30` | No favicon file in the repo (a `favicon_io.zip` was present instead); no structured data; keyboard users had no skip link. |
| 19 | Map iframe fixed height | `index.html:728` — `height="240"` inline | Fixed height with `width="100%"` is usable but does not scale with the contact column on very small screens. |
| 20 | Footer grid jumps 4 → 2 → 1 | `style.css:1170, 1334, 1396` | No 640px step; at 360px the footer columns had no explicit stacking until 520px. |

## What v2 fixed (and where)

- **Viewport / zoom:** removed `maximum-scale` (`index.html`, head).
- **Overflow:** `overflow-x: clip` on `html` + `body`, `min-width: 0` on every
  grid child, `max-width: 100%` on images/iframes, `box-sizing: border-box`
  everywhere (`style.css`, reset section).
- **Hero:** title `clamp(34px, 9vw, 82px)`; hero body is a centred
  `max-width` container (no `100vw` margin); stats are a 2-col grid on
  phones and 1-col under 380px; buttons stack full-width under 520px with
  `min-height: 48px` (`style.css`, hero section + 360/480/768 queries).
- **Mobile-first breakpoints:** 360 / 480 / 640 / 768 / 1024 / 1280
  (`min-width`), container padding 16px → 20px → 28px.
- **Filters:** horizontal scroll with `overflow-x: auto`, `scroll-snap`,
  hidden scrollbar, full-bleed padding on mobile; centred and static on
  desktop (`style.css`, `.filter-row`).
- **Grids:** 1 col <640, 2 col 640–1023, 3 col 1024–1279, 4 col products
  ≥1280; gallery uses the same steps with wide/tall spans restored ≥768px.
- **Nav drawer:** off-canvas drawer + overlay, closes on link / overlay /
  Escape, `aria-expanded` updates, body scroll locks (`script.js`, nav
  section; `style.css`, navbar).
- **Touch targets:** dots are 44px hit areas (8px visual), `.pwa` is 44px,
  lightbox close/nav are 48px and inside the viewport, floating buttons are
  16px / 84px apart on mobile and 24px / 96px on desktop.
- **About visuals:** badge/thumbnail sit inside the container on mobile
  (`right: 0`, `left: 0`); the negative offsets only apply ≥768px.
- **Reduced motion:** `prefers-reduced-motion` media query kills the
  slideshow zoom, marquee, and bounce; JS skips AOS and both autoplay
  timers when it is set.
- **Lightbox:** Prev/Next buttons, ←/→ keys, `n / 9` counter, focus return.
- **Contact form:** inline errors for name / Pakistani phone
  (`03XX-XXXXXXX`, `+92` allowed) / message; focus moves to the first error.
- **New features:** search + sort + live count + empty state; Quick View
  modal; enquiry cart drawer with PKR total and a single WhatsApp message;
  JSON-LD `FurnitureStore`; skip link; inline-SVG favicon; `theme-color`.
- **Sliders:** hero + testimonials pause on hover/focus and when the tab
  is hidden (`visibilitychange`).

## Deliberately unchanged

Prices, phone number, address, hours, testimonials, stats, image URLs,
fonts, and the forest-green/gold palette are byte-for-byte the same as v1.
Quick View “Size (approx.)” values are the only derived data: the original
site published no exact dimensions, so sizes are labelled approx. and taken
from the product descriptions (see `README.md` → Notes).
