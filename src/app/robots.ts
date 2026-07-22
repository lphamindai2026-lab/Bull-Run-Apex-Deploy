import type { MetadataRoute } from 'next';

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('YOUR_') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'https://bull-run-apex-deploy.vercel.app';
}

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/terminal', '/ai-assistant', '/journal',
                '/portfolio', '/pricing', '/support', '/whats-new',
                '/og-image.jpg', '/icon-192.png', '/icon-512.png', '/favicon.svg'],
        disallow: ['/admin', '/settings', '/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/about', '/terminal', '/ai-assistant', '/journal',
                '/portfolio', '/pricing', '/support', '/whats-new'],
        disallow: ['/admin', '/settings', '/api/'],
      },
    ],
    sitemap:  `${base}/sitemap.xml`,
    host:     base,
  };
}
