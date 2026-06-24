export default function sitemap() {
  const base = 'https://www.edgeanalysts.com'
  const now  = new Date()
  return [
    { url: base,                  lastModified: now, changeFrequency: 'daily',  priority: 1.0 },
    { url: `${base}/fixtures`,    lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/intelligence`, lastModified: now, changeFrequency: 'daily',  priority: 0.9 },
    { url: `${base}/insights`,    lastModified: now, changeFrequency: 'daily',  priority: 0.9 },
    { url: `${base}/wc2026`,      lastModified: now, changeFrequency: 'daily',  priority: 0.8 },
    { url: `${base}/rankings`,    lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/syndicate`,   lastModified: now, changeFrequency: 'monthly',priority: 0.5 },
  ]
}