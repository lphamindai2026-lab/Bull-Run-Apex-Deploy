import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl, SITE_NAME, FOUNDER_NAME, SOCIAL, SUPPORT_EMAIL } from '@/lib/siteConfig';
import {
  TrendingUp, Brain, Shield, Globe, Star,
  ArrowRight, ExternalLink, Mail, CheckCircle
} from 'lucide-react';

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: `About Himanshu Bhmniya — Trader, Entrepreneur & Founder of Bull Run Apex AI`,
  description:
    `Himanshu Bhmniya is a Trader, Entrepreneur, and the Founder & CEO of Bull Run Apex AI — ` +
    `the world's most advanced AI-powered institutional trading platform. ` +
    `Connect on Instagram @legacy_boy_1 or email bullrunapex@gmail.com.`,
  keywords: [
    'Himanshu Bhmniya', 'Bull Run Apex AI founder', 'Himanshu Bhmniya trader',
    'Himanshu Bhmniya entrepreneur', 'Bull Run Apex AI CEO',
    'AI trading platform founder', 'institutional trading', 'legacy_boy_1',
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About Himanshu Bhmniya — Founder & CEO of Bull Run Apex AI',
    description:
      'Himanshu Bhmniya — Trader, Entrepreneur, and Founder & CEO of Bull Run Apex AI. ' +
      'Building the world\'s most advanced AI-powered institutional trading platform.',
    url:    `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630,
               alt: 'Himanshu Bhmniya — Founder of Bull Run Apex AI' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Himanshu Bhmniya — Founder & CEO of Bull Run Apex AI',
    description: 'Trader, Entrepreneur, and Founder of Bull Run Apex AI.',
    images:      [`${SITE_URL}/og-image.jpg`],
  },
};

// Schema.org structured data — Person + Organization
const personSchema = {
  '@context':  'https://schema.org',
  '@type':     'Person',
  '@id':       `${SITE_URL}/about#himanshu-bhmniya`,
  name:        'Himanshu Bhmniya',
  givenName:   'Himanshu',
  familyName:  'Bhmniya',
  url:         `${SITE_URL}/about`,
  image:       `${SITE_URL}/images/himanshu.svg`,
  description: 'Trader, Entrepreneur, and Founder & CEO of Bull Run Apex AI — the world\'s most advanced AI-powered institutional trading platform.',
  jobTitle:    'Founder & CEO',
  worksFor: {
    '@type': 'Organization',
    name:    SITE_NAME,
    url:     SITE_URL,
  },
  knowsAbout: [
    'Algorithmic Trading', 'Smart Money Concepts', 'Institutional Trading',
    'Artificial Intelligence', 'Financial Technology', 'Quantitative Finance',
    'Trading Psychology', 'Entrepreneurship',
  ],
  sameAs: [
    'https://www.instagram.com/legacy_boy_1',
    'https://t.me/lphamindai_bot',
    'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i',
  ],
  email:    SUPPORT_EMAIL,
  nationality: 'Indian',
};

const orgSchema = {
  '@context':  'https://schema.org',
  '@type':     'Organization',
  '@id':       `${SITE_URL}/#organization`,
  name:        SITE_NAME,
  url:         SITE_URL,
  logo:        `${SITE_URL}/icon-512.png`,
  image:       `${SITE_URL}/og-image.jpg`,
  description: 'The world\'s most advanced AI-powered institutional trading platform.',
  foundingDate: '2026',
  founder: {
    '@type': 'Person',
    name:    'Himanshu Bhmniya',
    url:     `${SITE_URL}/about`,
  },
  contactPoint: {
    '@type':       'ContactPoint',
    email:         SUPPORT_EMAIL,
    contactType:   'customer support',
  },
  sameAs: [
    'https://www.instagram.com/legacy_boy_1',
    'https://t.me/lphamindai_bot',
  ],
};

const ACHIEVEMENTS = [
  'Built an institutional-grade AI trading platform from the ground up',
  'Integrated Smart Money Concepts (SMC) auto-detection engine',
  'Created multi-model AI routing across Gemini, Claude, and GPT-4o',
  'Developed behavioral psychology coaching for traders',
  'Built a paper trading simulator with $100,000 simulation balance',
  'Launched a free platform accessible to every trader worldwide',
];

const EXPERTISE = [
  { icon: TrendingUp, label: 'Smart Money Concepts (SMC)',     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Brain,      label: 'AI & Machine Learning',          color: 'text-purple-400',  bg: 'bg-purple-500/10' },
  { icon: Shield,     label: 'Quantitative Risk Management',   color: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
  { icon: Globe,      label: 'Entrepreneurship & Leadership',  color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
];

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── HERO ── */}
        <section className="relative rounded-3xl border border-purple-500/20
          bg-gradient-to-br from-purple-950/40 via-[var(--apex-surface)] to-[var(--apex-surface)]
          overflow-hidden mb-12 p-8 sm:p-14"
          aria-labelledby="founder-heading">

          {/* Background glow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-500/8 blur-[60px]" />
          </div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">

            {/* Photo */}
            <div className="relative shrink-0">
              <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-2xl overflow-hidden border-2 border-purple-500/40
                shadow-2xl shadow-purple-500/20">
                <img
                  src="/images/himanshu.svg"
                  alt="Himanshu Bhmniya — Trader, Entrepreneur and Founder & CEO of Bull Run Apex AI"
                  className="h-full w-full object-cover"
                  width={176}
                  height={176}
                />
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center
                rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500
                border-2 border-[var(--apex-bg)] text-[#03060d] text-sm font-black shadow-lg"
                title="Verified Founder">
                ✓
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20
                bg-purple-500/5 px-3 py-1 text-xs font-mono text-purple-400 mb-4">
                <Star className="h-3 w-3" aria-hidden />
                Verified Founder & CEO
              </div>

              <h1 id="founder-heading" className="text-3xl sm:text-5xl font-black text-white mb-2">
                Himanshu Bhmniya
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                {['Trader', 'Entrepreneur', 'Founder & CEO'].map(role => (
                  <span key={role}
                    className="rounded-full border border-purple-500/20 bg-purple-500/10
                      px-3 py-0.5 text-xs font-bold text-purple-300">
                    {role}
                  </span>
                ))}
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Visionary <strong className="text-white">Trader</strong> and{' '}
                <strong className="text-white">Entrepreneur</strong> building the world&apos;s most
                advanced AI-powered institutional trading platform.{' '}
                <strong className="text-purple-400">Founder & CEO</strong> of{' '}
                <strong className="text-white">Bull Run Apex AI</strong> — democratizing
                professional-grade trading tools for every trader on the planet.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap items-center gap-3 mt-6 justify-center sm:justify-start">
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-pink-500/25
                    bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-400
                    hover:opacity-80 transition-all"
                  aria-label="Himanshu Bhmniya on Instagram @legacy_boy_1">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @legacy_boy_1
                </a>

                <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-blue-500/25
                    bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400
                    hover:opacity-80 transition-all"
                  aria-label="Bull Run Apex AI Telegram Bot">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </a>

                <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-green-500/25
                    bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400
                    hover:opacity-80 transition-all"
                  aria-label="Bull Run Apex AI WhatsApp Channel">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>

                <a href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/25
                    bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400
                    hover:opacity-80 transition-all"
                  aria-label="Email Himanshu Bhmniya">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          aria-label="Platform statistics">
          {[
            { val: '2026',   label: 'Founded',          color: 'text-white' },
            { val: '14+',    label: 'Markets Covered',  color: 'text-emerald-400' },
            { val: '4',      label: 'AI Models',        color: 'text-purple-400' },
            { val: '$100K',  label: 'Free Sim Balance', color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label}
              className="rounded-2xl border border-[var(--apex-border)]
                bg-[var(--apex-surface)]/60 p-5 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* ── ABOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <section className="rounded-2xl border border-[var(--apex-border)]
            bg-[var(--apex-surface)]/60 p-7"
            aria-labelledby="vision-heading">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" aria-hidden />
              </div>
              <h2 id="vision-heading" className="text-base font-black text-white">
                The Vision
              </h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Himanshu Bhmniya</strong> created{' '}
              <strong className="text-white">Bull Run Apex AI</strong> with one mission: to give every
              trader access to institutional-grade tools previously available only to hedge funds and
              professional trading desks.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mt-3">
              By combining TradingView charts, automated Smart Money Concepts, real-time order flow,
              multi-model AI coaching, and behavioral psychology tracking — the playing field is now level.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--apex-border)]
            bg-[var(--apex-surface)]/60 p-7"
            aria-labelledby="tech-heading">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-purple-400" aria-hidden />
              </div>
              <h2 id="tech-heading" className="text-base font-black text-white">
                Areas of Expertise
              </h2>
            </div>
            <ul className="space-y-2.5">
              {EXPERTISE.map(e => {
                const Icon = e.icon;
                return (
                  <li key={e.label} className="flex items-center gap-3">
                    <div className={`h-7 w-7 rounded-lg ${e.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-3.5 w-3.5 ${e.color}`} aria-hidden />
                    </div>
                    <span className="text-sm text-slate-300">{e.label}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* ── QUOTE ── */}
        <section className="relative rounded-3xl border border-purple-500/20
          bg-gradient-to-br from-purple-950/20 to-[var(--apex-surface)]
          p-8 sm:p-10 mb-12 overflow-hidden"
          aria-label="Founder quote">
          <div aria-hidden className="absolute top-4 right-4 text-[80px] leading-none
            text-purple-500/5 font-black select-none">"</div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-16 w-16 shrink-0 rounded-2xl overflow-hidden
              border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
              <img
                src="/images/himanshu.svg"
                alt="Himanshu Bhmniya"
                className="h-full w-full object-cover"
                width={64} height={64}
              />
            </div>
            <div>
              <blockquote className="text-lg sm:text-xl font-bold text-white
                leading-relaxed italic mb-4">
                &ldquo;Trading without understanding market structure is gambling.
                Bull Run Apex AI gives traders the institutional edge — automated SMC detection,
                AI psychology coaching, and real-time market intelligence — all in one place.&rdquo;
              </blockquote>
              <p className="text-purple-400 font-bold text-sm">— Himanshu Bhmniya</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Trader · Entrepreneur · Founder &amp; CEO, Bull Run Apex AI
              </p>
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section className="mb-12" aria-labelledby="achievements-heading">
          <h2 id="achievements-heading" className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden />
            Key Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i}
                className="flex items-start gap-3 rounded-xl border border-[var(--apex-border)]
                  bg-[var(--apex-surface)]/60 p-4">
                <span className="text-emerald-500 mt-0.5 shrink-0 font-black">✓</span>
                <p className="text-sm text-slate-300">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ORGANIZATION ── */}
        <section className="rounded-2xl border border-[var(--apex-border)]
          bg-[var(--apex-surface)]/60 p-7 mb-12"
          aria-labelledby="org-heading">
          <h2 id="org-heading" className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" aria-hidden />
            Bull Run Apex AI — Organization
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Organization',    val: 'Bull Run Apex AI' },
                  { label: 'Founder & CEO',   val: 'Himanshu Bhmniya' },
                  { label: 'Founded',         val: '2026' },
                  { label: 'Category',        val: 'Financial Technology (FinTech)' },
                  { label: 'Product',         val: 'AI-Powered Institutional Trading Platform' },
                  { label: 'Contact',         val: SUPPORT_EMAIL },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <dt className="text-slate-500 w-32 shrink-0">{item.label}:</dt>
                    <dd className="text-slate-200 font-semibold">{item.val}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                Official Channels
              </p>
              {[
                { label: 'Instagram',       href: SOCIAL.instagram, color: 'text-pink-400' },
                { label: 'Telegram Bot',    href: SOCIAL.telegram,  color: 'text-blue-400' },
                { label: 'WhatsApp',        href: SOCIAL.whatsapp,  color: 'text-green-400' },
                { label: SUPPORT_EMAIL,     href: `mailto:${SUPPORT_EMAIL}`, color: 'text-emerald-400' },
              ].map(l => (
                <a key={l.label} href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-2 text-sm ${l.color}
                    hover:opacity-80 transition-opacity`}>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-3xl border border-emerald-500/15
          bg-gradient-to-br from-emerald-500/5 to-[var(--apex-surface)]
          p-8 text-center"
          aria-labelledby="cta-heading">
          <div className="h-16 w-16 mx-auto rounded-2xl overflow-hidden
            border-2 border-purple-500/30 mb-4 shadow-lg shadow-purple-500/10">
            <img
              src="/images/himanshu.svg"
              alt="Himanshu Bhmniya"
              className="h-full w-full object-cover"
              width={64} height={64}
            />
          </div>
          <h2 id="cta-heading" className="text-xl font-black text-white mb-2">
            Start Trading with Apex AI Today
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Join the platform built by{' '}
            <strong className="text-emerald-400">Himanshu Bhmniya</strong>{' '}
            to trade smarter, learn faster, and grow consistently.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/terminal"
              className="flex items-center gap-2 rounded-xl
                bg-gradient-to-r from-emerald-500 to-cyan-500
                px-6 py-3 text-sm font-bold text-[#03060d]
                hover:opacity-90 transition-all">
              Launch Terminal <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 rounded-xl
                border border-[var(--apex-border)] bg-slate-900/40
                px-6 py-3 text-sm font-bold text-slate-200
                hover:bg-slate-900 transition-all">
              <Mail className="h-4 w-4 text-emerald-400" aria-hidden />
              Contact Himanshu
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
