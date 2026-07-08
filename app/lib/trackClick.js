// Fires a non-blocking beacon to /api/track-click. Safe to call from an
// onClick without preventDefault — the affiliate link navigation proceeds.
export function trackAffiliateClick(affiliateId, placement) {
  try {
    const payload = JSON.stringify({
      affiliateId,
      placement,
      page: typeof window !== 'undefined' ? window.location.pathname : null,
    });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/track-click', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }
  } catch {}
}
