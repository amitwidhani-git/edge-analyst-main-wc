// Logs affiliate link clicks. No DB yet — events land in server/Vercel logs
// as structured JSON (prefixed AFFILIATE_CLICK) so they're easy to grep/filter.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const { affiliateId, placement, page } = body ?? {};
  if (!affiliateId) return new Response(null, { status: 400 });

  console.log('AFFILIATE_CLICK', JSON.stringify({
    affiliateId,
    placement: placement ?? null,
    page: page ?? null,
    referer: request.headers.get('referer'),
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for'),
    ts: new Date().toISOString(),
  }));

  return new Response(null, { status: 204 });
}
