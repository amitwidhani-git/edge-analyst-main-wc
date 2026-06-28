"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Fixtures',      href: '/fixtures'    },
  { label: 'Intelligence',  href: '/intelligence' },
  { label: 'Rankings',      href: '/rankings'     },
  { label: 'Knockout',      href: '/knockout'     },
  { label: 'Insights',      href: '/insights'     },
  { label: 'Syndicate',     href: '/syndicate'    },
];

export default function GlobalNav() {
  const [dark,      setDark]      = useState(true);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [wcData,    setWcData]    = useState([]);
  const pathname = usePathname();

  /* fetch WC fixtures for ticker */
  useEffect(() => {
    fetch('/api/wc2026').then(r => r.json()).then(d => {
      const ms = (d.matches || [])
        .filter(m => m.status === 'upcoming' || m.status === 'live')
        .sort((a,b) => a.date.localeCompare(b.date))
        .slice(0, 20);
      setWcData(ms);
    }).catch(() => {});
  }, []);

  /* nav theme observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setDark(e.target.dataset.theme === 'dark'); }),
      { rootMargin: '-56px 0px 0px 0px', threshold: 0 }
    );
    document.querySelectorAll('[data-theme]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const bg         = dark ? 'rgba(8,8,8,0.88)'        : 'rgba(247,245,240,0.92)';
  const textColor  = dark ? '#F7F5F0'                  : '#080808';
  const mutedColor = dark ? 'rgba(247,245,240,0.65)'   : 'rgba(8,8,8,0.65)';
  const borderColor= dark ? 'rgba(247,245,240,0.06)'   : 'rgba(8,8,8,0.06)';
  const tickerDuration = 120; // slower ticker speed to match Edge-Analysts reference

  /* build ticker items from live WC fixtures */
  const tickerItems = wcData.length > 0
    ? wcData.map(m => {
        const best = Math.max(m.bestH||0, m.bestD||0, m.bestA||0);
        const mkt  = m.bestH===best ? `${m.home} Win ${m.bestH?.toFixed(2)}`
                   : m.bestA===best ? `${m.away} Win ${m.bestA?.toFixed(2)}`
                   : `Draw ${m.bestD?.toFixed(2)}`;
        return `${m.home.toUpperCase()} vs ${m.away.toUpperCase()} · ${m.date} · ${mkt} · Model: ${m.prediction?.toUpperCase()} ${m.confidence}%`;
      })
    : [
        "SPAIN vs CABO VERDE · GRP H · 15 Jun · Spain Win 1.06 · Model: SPAIN 94%",
        "FRANCE vs IRAQ · GRP I · 16 Jun · France Win 1.12 · Model: FRANCE 88%",
        "ARGENTINA vs ALGERIA · GRP J · 14 Jun · Argentina Win 1.18 · Model: ARGENTINA 84%",
        "ENGLAND vs PANAMA · GRP L · 17 Jun · England Win 1.14 · Model: ENGLAND 91%",
        "BRAZIL vs MOROCCO · GRP C · 13 Jun · Brazil Win 1.32 · Model: BRAZIL 75%",
      ];

  return (
    <>
      <style>{`
        @keyframes ea-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ea-nav-link { transition: color .18s; }
        .ea-nav-link:hover { color: #C8FF00 !important; }
        .ea-nav-link.active { color: #C8FF00 !important; }
      `}</style>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: bg, backdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${borderColor}`,
        transition: 'background .3s, border-color .3s',
      }}>
        {/* ── TICKER ──────────────────────────────────────────────────────── */}
        <div role="region" aria-label="Live match ticker" style={{
          height: 28, overflow: 'hidden',
          borderBottom: `1px solid ${borderColor}`,
          background: dark ? 'rgba(0,0,0,.35)' : 'rgba(247,245,240,.4)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', height: '100%',
            animation: `ea-ticker ${tickerDuration}s linear infinite`,
            whiteSpace: 'nowrap', width: 'max-content',
          }}>
            {/* Duplicate for seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 8.5, letterSpacing: '.12em', textTransform: 'uppercase',
                color: dark ? 'rgba(247,245,240,.6)' : 'rgba(8,8,8,.6)',
                paddingRight: 48,
              }}>
                <span style={{ color: '#C8FF00', marginRight: 8 }}>⚽</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── MAIN NAV ────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px,3vw,56px)', height: 50,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <svg width="18" height="16" viewBox="1 -1 62 58" fill="none" aria-hidden="true">
              <path d="M4 22 L32 2 L60 22" stroke={textColor} strokeWidth="7" strokeLinejoin="miter" fill="none"/>
              <path d="M4 38 L32 18 L60 38" stroke={textColor} strokeWidth="7" strokeLinejoin="miter" fill="none"/>
              <path d="M4 54 L32 34 L60 54" stroke={textColor} strokeWidth="7" strokeLinejoin="miter" fill="none"/>
            </svg>
            <span style={{
              fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
              fontSize: 15, letterSpacing: '.1em', color: textColor, lineHeight: 1,
            }}>EDGE ANALYSTS</span>
            <span style={{
              fontFamily: "var(--font-mono,'DM Mono',monospace)",
              fontSize: 7.5, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#C8FF00', border: '1px solid rgba(200,255,0,.3)',
              padding: '2px 6px', borderRadius: 2, marginLeft: 4,
            }}>WC 2026</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} aria-label="Main">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || pathname?.startsWith(href + '/');
              return (
                <Link key={href} href={href}
                  className={`ea-nav-link${active ? ' active' : ''}`}
                  style={{
                    fontFamily: "var(--font-mono,'DM Mono',monospace)",
                    fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: active ? '#C8FF00' : mutedColor, textDecoration: 'none',
                  }}>{label}</Link>
              );
            })}
          </nav>

          {/* Mobile burger */}
          <button type="button" onClick={() => setMenuOpen(o => !o)} aria-label="Menu" aria-expanded={menuOpen} aria-controls="ea-mobile-menu"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            className="ea-burger">
            <span style={{ display: 'block', width: 22, height: 1.5, background: textColor, marginBottom: 5 }}/>
            <span style={{ display: 'block', width: 16, height: 1.5, background: textColor }}/>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="ea-mobile-menu" style={{ background: dark?'#080808':'#F7F5F0', borderTop:`1px solid ${borderColor}`, padding:'16px 24px' }}>
            {NAV_LINKS.map(({label,href}) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ display:'block', padding:'10px 0', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:textColor, textDecoration:'none', borderBottom:`1px solid ${borderColor}` }}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media(max-width:768px){ .ea-burger{display:block!important} nav[aria-label="Main"]{display:none!important} }
      `}</style>
    </>
  );
}
