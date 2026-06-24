export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/workspace/'],
      },
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'ClaudeBot',      allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
      { userAgent: 'OAI-SearchBot',  allow: '/' },
    ],
    sitemap: 'https://edgeanalysts.com/sitemap.xml',
  };
}

