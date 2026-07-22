import type { MetadataRoute } from 'next';

function getSiteUrl(): string {
  // Priority: explicit env var → Vercel auto URL → localhost
  if (process.env.NEXT_PUBLIC_SITE_URL &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('YOUR_') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  // Vercel provides VERCEL_PROJECT_PRODUCTION_URL for the stable alias
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL && !process.env.VERCEL_URL.includes('lphamindai2026-7471s')) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Hardcoded stable production alias as final fallback
  return 'https://bull-run-apex-deploy.vercel.app';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now  = new Date();

  return [
    { url: base,                      lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/about`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/terminal`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/ai-assistant`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/journal`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/pricing`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/portfolio`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/whats-new`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/support`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
