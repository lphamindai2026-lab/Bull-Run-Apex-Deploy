// Central site configuration — single source of truth
// All SEO, metadata, and structured data reads from here

export const SITE_NAME    = 'Bull Run Apex AI';
export const FOUNDER_NAME = 'Himanshu Bhmniya';
export const FOUNDER_ROLE = 'Founder & CEO';
export const SUPPORT_EMAIL = 'bullrunapex@gmail.com';

// Social links
export const SOCIAL = {
  instagram: 'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==',
  telegram:  'https://t.me/lphamindai_bot',
  whatsapp:  'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i',
  email:     'mailto:bullrunapex@gmail.com',
};

// Stable production URL — never uses SSO-protected preview URLs
export function getSiteUrl(): string {
  // 1. Explicit env var (set in Vercel dashboard)
  if (process.env.NEXT_PUBLIC_SITE_URL &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('YOUR_') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('7471s')) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  // 2. Vercel stable production URL (set automatically by Vercel)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // 3. Hardcoded stable alias — this never changes
  return 'https://bull-run-apex-deploy.vercel.app';
}
