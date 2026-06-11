'use client';
import { useEffect } from 'react';

// After React hydration, inline style hex values are normalised to rgb() by the browser.
// DARK_CSS shifts near-black backgrounds to deep navy (always active).
// LIGHT_CSS is added/removed when html.light toggles.
// Light mode CSS has higher specificity (html.light prefix) so it wins over dark overrides.

const DARK_CSS = `
/* ── DARK MODE: shift near-black inline backgrounds → deep navy ─────────── */

/* Page bg #07090F → #0C1625 */
.ea-page *[style*="background: rgb(7, 9, 15)"]     { background: #0A0A0A !important; }

/* Primary surface #0C1018 → #16243C */
.ea-page *[style*="background: rgb(12, 16, 24)"]   { background: #141414 !important; }

/* Secondary surface #0A111C → #12203A */
.ea-page *[style*="background: rgb(10, 17, 28)"]   { background: #111111 !important; }

/* Deep surfaces (#080F1A, #08101A, #08111A) → #0E1C30 */
.ea-page *[style*="background: rgb(8, 15, 26)"]    { background: #0D0D0D !important; }
.ea-page *[style*="background: rgb(8, 16, 26)"]    { background: #0D0D0D !important; }
.ea-page *[style*="background: rgb(8, 17, 26)"]    { background: #0D0D0D !important; }

/* #111820, #0C1220 */
.ea-page *[style*="background: rgb(17, 24, 32)"]   { background: #111111 !important; }
.ea-page *[style*="background: rgb(12, 18, 32)"]   { background: #0D0D0D !important; }

/* Very deep (#060D18, #050C16) → #091A2C */
.ea-page *[style*="background: rgb(6, 13, 24)"]    { background: #0A0A0A !important; }
.ea-page *[style*="background: rgb(5, 12, 22)"]    { background: #0A0A0A !important; }

/* #0A1220, #0A1625 → #0E1C30 */
.ea-page *[style*="background: rgb(10, 18, 32)"]   { background: #0D0D0D !important; }
.ea-page *[style*="background: rgb(10, 22, 37)"]   { background: #0D0D0D !important; }

/* Signals card back #0D1C2E → #122030 */
.ea-page *[style*="background: rgb(13, 28, 46)"]   { background: #111111 !important; }

/* Hover state #0F1620 → surface */
.ea-page *[style*="background: rgb(15, 22, 32)"]   { background: #141414 !important; }

/* #0A1220 alternate calculation */
.ea-page *[style*="background: rgb(13, 21, 37)"]   { background: #0D0D0D !important; }
`;

const LIGHT_CSS = `
/* ── LIGHT MODE: rgb()-based overrides (post-hydration) ────────────────── */

html.light .ea-page { background: #EDF1F7 !important; }

/* Dark surfaces → white / light grey */
html.light .ea-page *[style*="background: rgb(7, 9, 15)"]     { background: #EDF1F7 !important; }
html.light .ea-page *[style*="background: rgb(12, 16, 24)"]   { background: #FFFFFF !important; }
html.light .ea-page *[style*="background: rgb(10, 17, 28)"]   { background: #F2F5FA !important; }
html.light .ea-page *[style*="background: rgb(8, 15, 26)"]    { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(8, 16, 26)"]    { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(8, 17, 26)"]    { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(17, 24, 32)"]   { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(12, 18, 32)"]   { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(13, 21, 37)"]   { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(6, 13, 24)"]    { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(5, 12, 22)"]    { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(10, 18, 32)"]   { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(10, 22, 37)"]   { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(13, 28, 46)"]   { background: #FFFFFF !important; }
html.light .ea-page *[style*="background: rgb(15, 22, 32)"]   { background: #FFFFFF !important; }

/* Post-hydration dark-mode navy values → white */
html.light .ea-page *[style*="background: rgb(22, 36, 60)"]   { background: #FFFFFF !important; }
html.light .ea-page *[style*="background: rgb(18, 32, 58)"]   { background: #F2F5FA !important; }
html.light .ea-page *[style*="background: rgb(14, 28, 48)"]   { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(9, 26, 44)"]    { background: #E6ECF5 !important; }
html.light .ea-page *[style*="background: rgb(18, 32, 48)"]   { background: #F2F5FA !important; }

/* Gradient card backgrounds → white */
html.light .ea-page *[style*="linear-gradient(160deg, rgb"]    { background: #FFFFFF !important; }
html.light .ea-page *[style*="linear-gradient(135deg, rgb"]    { background: #FFFFFF !important; }
html.light .ea-page *[style*="linear-gradient(180deg, rgb"]    { background: #FFFFFF !important; }
html.light .ea-page *[style*="linear-gradient(90deg, rgb"]     { background: #FFFFFF !important; }

/* Dark rgba overlays → very subtle or transparent */
html.light .ea-page *[style*="background: rgba(0, 0, 0"]       { background: rgba(0,0,0,0.04)     !important; }
html.light .ea-page *[style*="background: rgba(7, 9, 15"]      { background: rgba(0,0,0,0.03)     !important; }
html.light .ea-page *[style*="background: rgba(12, 16, 24"]    { background: rgba(0,0,0,0.03)     !important; }
html.light .ea-page *[style*="background: rgba(8, 15, 26"]     { background: rgba(0,0,0,0.02)     !important; }

/* Accent tints — keep but much subtler on white */
html.light .ea-page *[style*="background: rgba(24, 83, 180"]   { background: rgba(24,83,180,0.06)  !important; }
html.light .ea-page *[style*="background: rgba(74, 127, 212"]  { background: rgba(24,83,180,0.07)  !important; }
html.light .ea-page *[style*="background: rgba(200, 255, 0"]   { background: rgba(0,122,79,0.08)   !important; }
html.light .ea-page *[style*="background: rgba(229, 62, 62"]   { background: rgba(229,62,62,0.07)  !important; }
html.light .ea-page *[style*="background: rgba(240, 165, 0"]   { background: rgba(180,120,0,0.07)  !important; }

/* ── TEXT COLOURS ─────────────────────────────────────────────────────────── */

/* White / near-white → dark navy */
html.light .ea-page *[style*="color: rgb(255, 255, 255)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(240, 244, 255)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(232, 236, 242)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(224, 232, 240)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(208, 216, 232)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(200, 212, 236)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(192, 200, 216)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(188, 200, 216)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(184, 200, 216)"]      { color: #1A2640 !important; }
html.light .ea-page *[style*="color: rgb(160, 176, 192)"]      { color: #2E3D58 !important; }

/* Semi-transparent white → readable */
html.light .ea-page *[style*="color: rgba(238, 242, 250"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgba(224, 232, 240"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgba(232, 236, 242"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgba(255, 255, 255"]      { color: #5A6A82 !important; }

/* Mid-tone muted text → readable on white */
html.light .ea-page *[style*="color: rgb(138, 154, 172)"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgb(154, 170, 187)"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgb(154, 170, 184)"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgb(138, 154, 176)"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgb(122, 138, 156)"]      { color: #5A6A82 !important; }
html.light .ea-page *[style*="color: rgb(106, 138, 172)"]      { color: #5A6A82 !important; }

/* Very dark "invisible on dark bg" text → readable dim */
html.light .ea-page *[style*="color: rgb(58, 74, 92)"]         { color: #6A7A96 !important; }
html.light .ea-page *[style*="color: rgb(74, 90, 108)"]        { color: #6A7A96 !important; }
html.light .ea-page *[style*="color: rgb(90, 106, 124)"]       { color: #6A7A96 !important; }
html.light .ea-page *[style*="color: rgb(42, 58, 76)"]         { color: #6A7A96 !important; }
html.light .ea-page *[style*="color: rgb(106, 122, 140)"]      { color: #6A7A96 !important; }
html.light .ea-page *[style*="color: rgb(90, 122, 156)"]       { color: #6A7A96 !important; }

/* Pink / miss text → deeper red */
html.light .ea-page *[style*="color: rgb(255, 179, 179)"],
html.light .ea-page *[style*="color: rgb(255, 184, 184)"],
html.light .ea-page *[style*="color: rgb(255, 170, 170)"],
html.light .ea-page *[style*="color: rgb(255, 176, 176)"],
html.light .ea-page *[style*="color: rgb(138, 176, 160)"]      { color: #2E3D58 !important; }

/* Neon green → deep readable green */
html.light .ea-page *[style*="color: rgb(200, 255, 0)"]        { color: #5B7A00 !important; }
html.light .ea-page *[style*="color: rgba(200, 255, 0"]        { color: #5B7A00 !important; }
html.light .ea-page *[style*="color: rgb(0, 204, 128)"]        { color: #5B7A00 !important; }

/* Blue mid — stay blue, slightly darker for white bg */
html.light .ea-page *[style*="color: rgb(74, 127, 212)"]       { color: #2D6BC4 !important; }

/* Ghosted watermark numbers */
html.light .ea-page *[style*="color: rgba(24, 83, 180, 0.05)"] { color: rgba(0,0,0,0.04) !important; }
html.light .ea-page *[style*="color: rgba(24, 83, 180, 0.06)"] { color: rgba(0,0,0,0.04) !important; }

/* ── BORDERS ─────────────────────────────────────────────────────────────── */

html.light .ea-page *[style*="border: 1px solid rgba(238, 242, 250"],
html.light .ea-page *[style*="border-top: 1px solid rgba(238, 242, 250"],
html.light .ea-page *[style*="border-bottom: 1px solid rgba(238, 242, 250"],
html.light .ea-page *[style*="border-left: 1px solid rgba(238, 242, 250"],
html.light .ea-page *[style*="border-right: 1px solid rgba(238, 242, 250"] {
  border-color: rgba(24,83,180,0.12) !important;
}

html.light .ea-page *[style*="border: 1px solid rgb(229, 62, 62)"],
html.light .ea-page *[style*="border: 1px solid rgba(229, 62, 62"] {
  border-color: rgba(229,62,62,0.4) !important;
}

/* Glowing green borders → subtler */
html.light .ea-page *[style*="border: 1px solid rgba(200, 255, 0"],
html.light .ea-page *[style*="border-bottom: 2px solid rgb(200, 255, 0)"],
html.light .ea-page *[style*="border-top: 2px solid rgb(200, 255, 0)"],
html.light .ea-page *[style*="border-top: 3px solid rgb(200, 255, 0)"] {
  border-color: rgba(0,122,79,0.5) !important;
}

/* ── NAV (post-hydration) ─────────────────────────────────────────────────── */

html.light .ea-nav {
  background:    rgba(255,255,255,0.94) !important;
  border-bottom: 1px solid rgba(24,83,180,0.12) !important;
  box-shadow:    0 1px 3px rgba(0,0,0,0.08) !important;
}
html.light .ea-nav *[style*="color: rgb(232, 236, 242)"],
html.light .ea-nav *[style*="color: rgb(224, 232, 240)"],
html.light .ea-nav *[style*="color: rgb(255, 255, 255)"] { color: #1A2640 !important; }
html.light .ea-nav a[style*="color: rgba(224, 232, 240"] { color: #5A6A82 !important; }
html.light .ea-nav a[style*="color: rgb(154, 170, 187)"] { color: #5A6A82 !important; }
html.light .ea-nav a[style*="color: rgb(200, 255, 0)"]   { color: #5B7A00 !important; }
html.light .ea-nav button[style*="color: rgba(224, 232, 240"] { color: #5A6A82 !important; }
`;

export default function ThemeOverrides() {
  useEffect(() => {
    const DARK_ID  = 'ea-dark-overrides';
    const LIGHT_ID = 'ea-light-overrides';

    // Dark overrides always active — shift near-black inline styles to navy.
    if (!document.getElementById(DARK_ID)) {
      const el = document.createElement('style');
      el.id = DARK_ID;
      el.textContent = DARK_CSS;
      document.head.appendChild(el);
    }

    // Light overrides injected/removed when html.light class changes.
    const sync = () => {
      const isLight = document.documentElement.classList.contains('light');
      const existing = document.getElementById(LIGHT_ID);
      if (isLight && !existing) {
        const el = document.createElement('style');
        el.id = LIGHT_ID;
        el.textContent = LIGHT_CSS;
        document.head.appendChild(el);
      } else if (!isLight && existing) {
        existing.remove();
      }
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
