import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import FounderPhoto from "@/components/FounderPhoto";
import CustomCursor from "@/components/ui/CustomCursor";
import AIChatbot from "@/components/ui/AIChatbot";
import "./globals.css";

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('YOUR_') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost') &&
      !process.env.NEXT_PUBLIC_SITE_URL.includes('7471s')) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'https://bull-run-apex-deploy.vercel.app';
}

const SITE_URL  = getSiteUrl();
const SITE_NAME = 'Bull Run Apex AI';
const FOUNDER   = 'Himanshu Bhmniya';

export const metadata: Metadata = {
  title: {
    default:  `${SITE_NAME} — AI-Powered Institutional Trading Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `${SITE_NAME} by ${FOUNDER} — The world's most advanced AI trading platform. ` +
    `TradingView charts, Smart Money Concepts auto-detection, Gemini/Claude/GPT-4o AI coaching, ` +
    `behavioral trade journal, portfolio analytics. Start free with $100,000 simulation.`,
  keywords: [
    'Bull Run Apex AI', 'Himanshu Bhmniya', 'AI trading platform',
    'institutional trading', 'Smart Money Concepts', 'TradingView', 'crypto trading',
  ],
  authors:   [{ name: FOUNDER }],
  creator:   FOUNDER,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — The Future of AI Trading`,
    description: `Trade like an institution. AI coaching, SMC auto-detection, live markets. Founded by ${FOUNDER}.`,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${SITE_NAME}` }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@BullRunApexAI',
    creator: '@HimanshuBhmniya',
    title: `${SITE_NAME} — AI Trading Platform`,
    description: `The most advanced AI trading platform. Founded by ${FOUNDER}.`,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index:true, follow:true, 'max-image-preview':'large', 'max-snippet':-1 },
  },
  icons: {
    icon: [{ url:'/favicon.svg', type:'image/svg+xml' }, { url:'/icon-192.png', sizes:'192x192' }],
    apple: [{ url:'/icon-192.png' }],
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || '' },
  category: 'Finance & Trading',
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5,
  themeColor: '#0A0A0A',
};

function buildSchemas() {
  const org = {
    '@context':'https://schema.org','@type':'Organization','@id':`${SITE_URL}/#org`,
    name:SITE_NAME, url:SITE_URL,
    logo:`${SITE_URL}/icon-512.png`,
    founder:{ '@type':'Person', name:FOUNDER, url:`${SITE_URL}/about` },
    contactPoint:{ '@type':'ContactPoint', email:'bullrunapex@gmail.com', contactType:'customer support' },
    sameAs:['https://www.instagram.com/legacy_boy_1','https://t.me/lphamindai_bot'],
  };
  const person = {
    '@context':'https://schema.org','@type':'Person','@id':`${SITE_URL}/about#founder`,
    name:'Himanshu Bhmniya', url:`${SITE_URL}/about`,
    jobTitle:'Founder & CEO', worksFor:{'@id':`${SITE_URL}/#org`},
    sameAs:['https://www.instagram.com/legacy_boy_1','https://t.me/lphamindai_bot'],
  };
  const website = {
    '@context':'https://schema.org','@type':'WebSite','@id':`${SITE_URL}/#website`,
    name:SITE_NAME, url:SITE_URL, publisher:{'@id':`${SITE_URL}/#org`},
  };
  return [org, person, website];
}

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const schemas = buildSchemas();

  return (
    <html lang="en" dir="ltr">
      <head>
        {schemas.map((s,i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(s)}} />
        ))}
        <link rel="preconnect" href="https://s3.tradingview.com" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body style={{background:'#0A0A0A', cursor:'none'}}>

        {/* Custom gold cursor */}
        <CustomCursor />

        {/* AI Chatbot — always visible */}
        <AIChatbot />

        {/* Ambient auras */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/3 h-[600px] w-[600px] rounded-full blur-[160px] opacity-[0.04]"
               style={{background:'#FFD700'}} />
          <div className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full blur-[140px] opacity-[0.03]"
               style={{background:'#9D4EDD'}} />
        </div>

        {/* Skip link */}
        <a href="#main-content"
           className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]
                      focus:rounded-lg focus:bg-[#FFD700] focus:px-4 focus:py-2 focus:text-sm
                      focus:font-bold focus:text-black">
          Skip to main content
        </a>

        {/* Mobile header */}
        <MobileHeader user={user} />

        {/* App shell */}
        <div className="flex flex-1 overflow-hidden min-h-screen">
          <Sidebar user={user} />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t py-10" style={{borderColor:'rgba(255,215,0,0.08)',background:'#0A0A0A'}}
                    role="contentinfo">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                  {/* Brand */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center font-black text-sm"
                           style={{background:'linear-gradient(135deg,#FFD700,#FFA500)',color:'#0A0A0A'}}>▲</div>
                      <span className="text-sm font-black text-white">Bull Run Apex AI</span>
                    </div>
                    <p className="text-[11px] leading-relaxed mb-3" style={{color:'#444'}}>
                      The world's most advanced AI-powered institutional trading platform.
                    </p>
                    <a href="/about" className="flex items-center gap-2 group w-fit">
                      <FounderPhoto size="sm" showBorder showGlow className="!h-7 !w-7 rounded-lg" />
                      <div>
                        <p className="text-[10px] font-bold text-white group-hover:text-[#FFD700] transition-colors">Himanshu Bhmniya</p>
                        <p className="text-[9px] font-mono" style={{color:'#9D4EDD'}}>Founder & CEO</p>
                      </div>
                    </a>
                  </div>

                  {/* Platform */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{color:'#FFD700'}}>Platform</p>
                    <ul className="space-y-2">
                      {[['Terminal','/terminal'],['AI Assistant','/ai-assistant'],['Journal','/journal'],['Portfolio','/portfolio'],["What's New",'/whats-new']].map(([l,h]) => (
                        <li key={h}><a href={h} className="text-[11px] transition-colors hover:text-[#FFD700]" style={{color:'#444'}}>{l}</a></li>
                      ))}
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{color:'#FFD700'}}>Company</p>
                    <ul className="space-y-2">
                      {[['About Himanshu','/about'],['Pricing','/pricing'],['Support','/support']].map(([l,h]) => (
                        <li key={h}><a href={h} className="text-[11px] transition-colors hover:text-[#FFD700]" style={{color:'#444'}}>{l}</a></li>
                      ))}
                    </ul>
                  </div>

                  {/* Social */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{color:'#FFD700'}}>Connect</p>
                    <ul className="space-y-2.5">
                      {[
                        { l:'Instagram @legacy_boy_1',    href:'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==', col:'#E1306C' },
                        { l:'Telegram Bot',               href:'https://t.me/lphamindai_bot',                                        col:'#0088CC' },
                        { l:'WhatsApp Channel',           href:'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i',             col:'#25D366' },
                        { l:'bullrunapex@gmail.com',      href:'mailto:bullrunapex@gmail.com',                                       col:'#FFD700' },
                      ].map(s => (
                        <li key={s.l}>
                          <a href={s.href} target={s.href.startsWith('http')?'_blank':undefined}
                             rel="noopener noreferrer"
                             className="text-[11px] transition-colors"
                             style={{color:s.col}}>{s.l}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
                     style={{borderColor:'rgba(255,215,0,0.06)'}}>
                  <div className="flex items-center gap-3 text-[10px] font-mono" style={{color:'#333'}}>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22FF88] pulse-gold-anim" />
                      All Systems Operational
                    </span>
                    <span>v5.0.0</span>
                  </div>
                  <p className="text-[10px] font-mono" style={{color:'#333'}}>
                    © 2026 <span style={{color:'#FFD700'}}>Bull Run Apex AI</span> · Founded by{' '}
                    <a href="/about" className="transition-colors hover:text-[#9D4EDD]" style={{color:'#9D4EDD'}}>Himanshu Bhmniya</a>
                    {' '}· Paper Trading Only
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
