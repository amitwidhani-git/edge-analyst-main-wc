"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "ea-cookie-consent";

const CATEGORIES = [
  {
    id: "necessary",
    label: "Strictly Necessary",
    description: "Required for the site to function. Cannot be disabled.",
    locked: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Help us understand how visitors interact with the site (e.g. Ahrefs Analytics). No personal data is sold.",
    locked: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Used to deliver relevant content and track campaign performance.",
    locked: false,
  },
];

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveConsent(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, ts: Date.now() }));
  } catch {}
}

export default function CookieBanner() {
  const [visible, setVisible]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs]       = useState({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const stored = loadConsent();
    if (!stored) setVisible(true);
  }, []);

  function acceptAll() {
    const p = { necessary: true, analytics: true, marketing: true };
    saveConsent(p);
    setVisible(false);
  }

  function rejectAll() {
    const p = { necessary: true, analytics: false, marketing: false };
    saveConsent(p);
    setVisible(false);
  }

  function savePrefs() {
    saveConsent(prefs);
    setVisible(false);
  }

  function toggle(id) {
    setPrefs(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes ea-cookie-in { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .ea-cb { animation: ea-cookie-in .35s cubic-bezier(.22,1,.36,1) both; }
        .ea-cb-btn { transition: background .15s, color .15s, border-color .15s; }
        .ea-cb-btn:hover { opacity: .85; }
        .ea-cb-toggle { appearance: none; -webkit-appearance: none; position: relative; width: 36px; height: 20px; border-radius: 10px; cursor: pointer; transition: background .2s; outline: none; }
        .ea-cb-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .2s; }
        .ea-cb-toggle:checked { background: #C8FF00 !important; }
        .ea-cb-toggle:checked::after { transform: translateX(16px); }
        .ea-cb-toggle:focus-visible { box-shadow: 0 0 0 2px #C8FF00; }
      `}</style>

      {/* Backdrop for expanded state */}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(8,8,8,.55)", backdropFilter: "blur(2px)" }}
          aria-hidden="true"
        />
      )}

      <div
        className="ea-cb"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "rgba(12,12,12,.97)",
          borderTop: "1px solid rgba(200,255,0,.18)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* ── Compact banner ── */}
        <div style={{ padding: "16px clamp(16px,3vw,48px)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{
              margin: 0,
              fontFamily: "var(--font-body,'Outfit',sans-serif)",
              fontSize: 12,
              color: "rgba(247,245,240,.75)",
              lineHeight: 1.5,
            }}>
              We use cookies to analyse site performance and improve your experience.{" "}
              <a
                href="/privacy"
                style={{ color: "#C8FF00", textDecoration: "underline", textDecorationColor: "rgba(200,255,0,.4)" }}
              >
                Privacy Policy
              </a>
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Manage Preferences */}
            <button
              className="ea-cb-btn"
              onClick={() => setExpanded(e => !e)}
              style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 9,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                padding: "9px 18px",
                border: "1px solid rgba(247,245,240,.15)",
                borderRadius: 2,
                background: "transparent",
                color: "rgba(247,245,240,.6)",
                cursor: "pointer",
              }}
            >
              {expanded ? "Close" : "Manage Preferences"}
            </button>

            {/* Reject All */}
            <button
              className="ea-cb-btn"
              onClick={rejectAll}
              style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 9,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                padding: "9px 18px",
                border: "1px solid rgba(247,245,240,.25)",
                borderRadius: 2,
                background: "transparent",
                color: "#F7F5F0",
                cursor: "pointer",
              }}
            >
              Reject All
            </button>

            {/* Accept All */}
            <button
              className="ea-cb-btn"
              onClick={acceptAll}
              style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 9,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                padding: "9px 18px",
                border: "1px solid #C8FF00",
                borderRadius: 2,
                background: "#C8FF00",
                color: "#080808",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Accept All
            </button>
          </div>
        </div>

        {/* ── Expanded preferences panel ── */}
        {expanded && (
          <div style={{
            borderTop: "1px solid rgba(247,245,240,.07)",
            padding: "20px clamp(16px,3vw,48px) 24px",
          }}>
            <p style={{
              margin: "0 0 16px",
              fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
              fontSize: 18,
              letterSpacing: ".08em",
              color: "#F7F5F0",
            }}>
              Cookie Preferences
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "12px 16px",
                    border: "1px solid rgba(247,245,240,.07)",
                    borderRadius: 2,
                    background: "rgba(247,245,240,.02)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}>
                      <span style={{
                        fontFamily: "var(--font-mono,'DM Mono',monospace)",
                        fontSize: 10,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: prefs[cat.id] ? "#C8FF00" : "rgba(247,245,240,.6)",
                      }}>
                        {cat.label}
                      </span>
                      {cat.locked && (
                        <span style={{
                          fontFamily: "var(--font-mono,'DM Mono',monospace)",
                          fontSize: 7.5,
                          letterSpacing: ".1em",
                          textTransform: "uppercase",
                          color: "rgba(247,245,240,.3)",
                          border: "1px solid rgba(247,245,240,.1)",
                          padding: "1px 6px",
                          borderRadius: 2,
                        }}>
                          Always On
                        </span>
                      )}
                    </div>
                    <p style={{
                      margin: 0,
                      fontFamily: "var(--font-body,'Outfit',sans-serif)",
                      fontSize: 11,
                      color: "rgba(247,245,240,.45)",
                      lineHeight: 1.5,
                    }}>
                      {cat.description}
                    </p>
                  </div>

                  <label style={{ flexShrink: 0, display: "flex", alignItems: "center", cursor: cat.locked ? "default" : "pointer" }}>
                    <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                      {cat.label}
                    </span>
                    <input
                      type="checkbox"
                      className="ea-cb-toggle"
                      checked={prefs[cat.id]}
                      disabled={cat.locked}
                      onChange={() => !cat.locked && toggle(cat.id)}
                      style={{
                        background: prefs[cat.id] ? "#C8FF00" : "rgba(247,245,240,.12)",
                        border: "none",
                        opacity: cat.locked ? 0.5 : 1,
                        cursor: cat.locked ? "default" : "pointer",
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button
                className="ea-cb-btn"
                onClick={rejectAll}
                style={{
                  fontFamily: "var(--font-mono,'DM Mono',monospace)",
                  fontSize: 9,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  padding: "9px 18px",
                  border: "1px solid rgba(247,245,240,.2)",
                  borderRadius: 2,
                  background: "transparent",
                  color: "rgba(247,245,240,.7)",
                  cursor: "pointer",
                }}
              >
                Reject All
              </button>
              <button
                className="ea-cb-btn"
                onClick={savePrefs}
                style={{
                  fontFamily: "var(--font-mono,'DM Mono',monospace)",
                  fontSize: 9,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  padding: "9px 22px",
                  border: "1px solid #C8FF00",
                  borderRadius: 2,
                  background: "#C8FF00",
                  color: "#080808",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Save My Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
