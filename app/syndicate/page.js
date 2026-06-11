"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SyndicatePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* custom cursor */
  useEffect(() => {
    document.body.style.cursor = 'none';
    const cur  = document.getElementById('ea-cur');
    const dot  = document.getElementById('ea-dot');
    const ring = document.getElementById('ea-ring');
    if (!cur || !dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, rafId;
    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      let isDark = true;
      for (const sec of document.querySelectorAll('[data-theme]')) {
        const { top, bottom } = sec.getBoundingClientRect();
        if (e.clientY >= top && e.clientY < bottom) { isDark = sec.dataset.theme === 'dark'; break; }
      }
      dot.style.background   = isDark ? '#F7F5F0' : '#080808';
      ring.style.borderColor = isDark ? 'rgba(247,245,240,.55)' : 'rgba(8,8,8,.55)';
    };
    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      cur.style.left  = mx + 'px'; cur.style.top  = my + 'px';
      ring.style.left = (rx - mx) + 'px'; ring.style.top = (ry - my) + 'px';
      rafId = requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loop);
    const add = () => document.body.classList.add('lp-hovering');
    const rem = () => document.body.classList.remove('lp-hovering');
    document.querySelectorAll('a,button,input').forEach(el => {
      el.addEventListener('mouseenter', add);
      el.addEventListener('mouseleave', rem);
    });
    return () => {
      document.body.style.cursor = '';
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <>
      {/* ── cursor ──────────────────────────────────────────────────────────── */}
      <div id="ea-cur" style={{ position:'fixed', zIndex:9998, pointerEvents:'none', top:0, left:0 }} aria-hidden="true">
        <div id="ea-ring" style={{ width:36, height:36, border:'1.5px solid rgba(247,245,240,.55)', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'width .2s,height .2s,border-color .2s' }} />
        <div id="ea-dot"  style={{ width:6, height:6, background:'#F7F5F0', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'transform .08s,background .2s' }} />
      </div>

      <div data-theme="dark" style={{
        background: '#080808', minHeight: '100vh', color: '#F7F5F0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: 'clamp(64px,10vw,120px) clamp(24px,6vw,80px)',
      }}>

        {/* eyebrow */}
        <p style={{
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#C8FF00', marginBottom: 24,
        }}>Coming Soon</p>

        {/* headline */}
        <h1 style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: 'clamp(80px,14vw,180px)', lineHeight: 0.88,
          letterSpacing: '0.01em', fontWeight: 400,
          color: '#F7F5F0', margin: '0 0 32px',
        }}>Syndicate</h1>

        {/* descriptor */}
        <p style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontSize: 'clamp(14px,1.5vw,18px)', fontWeight: 300, lineHeight: 1.7,
          color: 'rgba(247,245,240,0.75)', maxWidth: 480, margin: '0 0 56px',
        }}>
          The Edge Analysts fantasy football league. Model-backed picks, a real prize pool,
          and a leaderboard that doesn't lie. We're building it now.
        </p>

        {/* divider */}
        <div style={{ width: 48, height: 1, background: 'rgba(247,245,240,0.12)', marginBottom: 56 }} />

        {/* email capture */}
        {submitted ? (
          <div style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#C8FF00',
          }}>You're on the list. We'll be in touch.</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <label htmlFor="syndicate-email" style={{ position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0 0 0 0)', whiteSpace:'nowrap' }}>Email address</label>
            <input
              id="syndicate-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: 10, letterSpacing: '0.08em',
                background: 'rgba(247,245,240,0.05)',
                border: '1px solid rgba(247,245,240,0.15)',
                borderRadius: 3, padding: '13px 20px',
                color: '#F7F5F0', outline: 'none', width: 260,
              }}
            />
            <button type="submit" style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#C8FF00', color: '#080808',
              border: 'none', borderRadius: 3, padding: '13px 28px',
              cursor: 'none',
            }}>Notify me</button>
          </form>
        )}

        {/* back link */}
        <Link href="/" style={{
          marginTop: 64,
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
          fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(247,245,240,0.75)', textDecoration: 'underline',
        }}>← Back to Edge Analysts</Link>
      </div>

      <style>{`
        body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important;}
        body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important;}
        input::placeholder { color: rgba(247,245,240,0.55); }
        input:focus { border-color: rgba(200,255,0,0.4) !important; }
      `}</style>
    </>
  );
}
