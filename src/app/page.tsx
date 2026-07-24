'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Brain, Shield, Zap,
  ArrowRight, Activity, Star, Users, Globe,
  BarChart3, Lock, ChevronRight, Cpu, Flame,
  LineChart, Award, Target, Sparkles, DollarSign
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   LIVE MARKET DATA — ticks every 1.5s
───────────────────────────────────────────────────────── */
const INITIAL_MARKETS = [
  { symbol:'BTC/USD',  price:104520,    change: 4.82, vol:'$14.2B',  cat:'CRYPTO',     bullish:true  },
  { symbol:'ETH/USD',  price:3420,      change:-1.45, vol:'$4.8B',   cat:'CRYPTO',     bullish:false },
  { symbol:'SOL/USD',  price:184.50,    change: 8.91, vol:'$2.1B',   cat:'CRYPTO',     bullish:true  },
  { symbol:'EUR/USD',  price:1.0845,    change: 0.22, vol:'$85B',    cat:'FOREX',      bullish:true  },
  { symbol:'GBP/USD',  price:1.2680,    change:-0.15, vol:'$62B',    cat:'FOREX',      bullish:false },
  { symbol:'XAU/USD',  price:2342.50,   change: 1.62, vol:'$22B',    cat:'COMMODITY',  bullish:true  },
  { symbol:'AAPL',     price:182.30,    change: 1.15, vol:'52M',     cat:'STOCK',      bullish:true  },
  { symbol:'NVDA',     price:875.12,    change:12.45, vol:'110M',    cat:'STOCK',      bullish:true  },
  { symbol:'S&P 500',  price:5430,      change: 0.75, vol:'$44B',    cat:'INDEX',      bullish:true  },
  { symbol:'NASDAQ',   price:18820,     change: 1.42, vol:'$38B',    cat:'INDEX',      bullish:true  },
];

/* ── Animated price ticker ── */
function LiveTicker() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);

  useEffect(() => {
    const id = setInterval(() => {
      setMarkets(prev => prev.map(m => {
        const d = (Math.random() - 0.485) * 0.08;
        const newPrice = m.price * (1 + d / 100);
        const formatted = m.price > 1000 ? +newPrice.toFixed(1)
                        : m.price > 1   ? +newPrice.toFixed(3)
                                        : +newPrice.toFixed(5);
        return { ...m, price: formatted, change: +(m.change + d * 10).toFixed(2), bullish: m.change >= 0 };
      }));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const items = [...markets, ...markets];

  return (
    <div className="border-y border-[var(--apex-border)] bg-[#020509]/95 backdrop-blur-sm overflow-hidden py-2.5 sticky top-0 z-40">
      <div className="flex gap-10 ticker-run whitespace-nowrap">
        {items.map((m, i) => {
          const up = m.change >= 0;
          return (
            <span key={i} className="inline-flex items-center gap-2.5 text-[11px] font-mono">
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold border ${
                m.cat==='CRYPTO'    ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' :
                m.cat==='FOREX'     ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                m.cat==='STOCK'     ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' :
                m.cat==='COMMODITY' ? 'text-orange-400 border-orange-500/20 bg-orange-500/5' :
                                      'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
              }`}>{m.cat}</span>
              <span className="font-bold text-white">{m.symbol}</span>
              <span className="tabular-nums text-slate-200">
                {m.price > 1000 ? m.price.toLocaleString('en-US', {maximumFractionDigits:1})
                 : m.price > 1  ? m.price.toFixed(4)
                                : m.price.toFixed(5)}
              </span>
              <span className={`font-bold flex items-center gap-0.5 ${up ? 'text-emerald-400':'text-rose-400'}`}>
                {up ? '▲' : '▼'} {Math.abs(m.change).toFixed(2)}%
              </span>
              <span className="text-slate-600">|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Animated Candlestick SVG Chart ── */
function CandlestickChart({ height = 200 }: { height?: number }) {
  const [candles, setCandles] = useState(() => generateCandles(20, 104000));

  function generateCandles(count: number, basePrice: number) {
    const cs = [];
    let price = basePrice;
    for (let i = 0; i < count; i++) {
      const open  = price;
      const close = price * (1 + (Math.random() - 0.48) * 0.012);
      const high  = Math.max(open, close) * (1 + Math.random() * 0.004);
      const low   = Math.min(open, close) * (1 - Math.random() * 0.004);
      cs.push({ open, close, high, low, bull: close >= open });
      price = close;
    }
    return cs;
  }

  useEffect(() => {
    const id = setInterval(() => {
      setCandles(prev => {
        const last  = prev[prev.length - 1];
        const open  = last.close;
        const close = open * (1 + (Math.random() - 0.48) * 0.012);
        const high  = Math.max(open, close) * (1 + Math.random() * 0.004);
        const low   = Math.min(open, close) * (1 - Math.random() * 0.004);
        return [...prev.slice(1), { open, close, high, low, bull: close >= open }];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const maxH = Math.max(...candles.map(c => c.high));
  const minL  = Math.min(...candles.map(c => c.low));
  const range = maxH - minL || 1;
  const toY   = (v: number) => ((maxH - v) / range) * (height - 20) + 10;
  const w     = 100 / candles.length;

  return (
    <svg width="100%" height={height} className="overflow-visible">
      {/* Grid lines */}
      {[0,25,50,75,100].map(pct => (
        <line key={pct}
          x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
          stroke="rgba(26,32,53,0.5)" strokeWidth="1" />
      ))}
      {/* Candles */}
      {candles.map((c, i) => {
        const x    = i * w + w * 0.5;
        const openY  = toY(c.open);
        const closeY = toY(c.close);
        const highY  = toY(c.high);
        const lowY   = toY(c.low);
        const bodyH  = Math.max(2, Math.abs(closeY - openY));
        const bodyY  = Math.min(openY, closeY);
        const col    = c.bull ? '#10b981' : '#f43f5e';
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={`${x}%`} y1={highY} x2={`${x}%`} y2={lowY}
              stroke={col} strokeWidth="1" opacity="0.7" />
            {/* Body */}
            <rect
              x={`${x - w * 0.35}%`} y={bodyY}
              width={`${w * 0.7}%`}   height={bodyH}
              fill={col} rx="1"
              className={i === candles.length - 1 ? 'candle-bar' : ''}
            >
              {i === candles.length - 1 && (
                <animate attributeName="opacity" values="1;0.6;1" dur="1s" repeatCount="indefinite" />
              )}
            </rect>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Market Stats Card ── */
function MarketCard({ market, index }: { market: typeof INITIAL_MARKETS[0]; index: number }) {
  const [prev, setPrev]   = useState(market.price);
  const [flash, setFlash] = useState<'up'|'down'|null>(null);

  useEffect(() => {
    if (market.price !== prev) {
      setFlash(market.price > prev ? 'up' : 'down');
      setPrev(market.price);
      const t = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(t);
    }
  }, [market.price]);

  const up = market.change >= 0;
  return (
    <Link href="/terminal"
      className={`group card-3d relative rounded-2xl border border-[var(--apex-border)]
        bg-[var(--apex-surface)]/60 p-4 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden
        ${flash==='up' ? 'ring-1 ring-emerald-500/40' : flash==='down' ? 'ring-1 ring-rose-500/40' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}>

      {/* Glow blob */}
      <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full blur-xl opacity-20 transition-opacity group-hover:opacity-40 ${up ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs font-mono font-bold text-white">{market.symbol}</div>
            <div className={`text-[9px] font-bold mt-0.5 ${
              market.cat==='CRYPTO'    ? 'text-yellow-400' :
              market.cat==='FOREX'     ? 'text-blue-400' :
              market.cat==='STOCK'     ? 'text-purple-400' :
              market.cat==='COMMODITY' ? 'text-orange-400' : 'text-cyan-400'
            }`}>{market.cat}</div>
          </div>
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border font-mono
            ${up ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                 : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {up ? '▲':' ▼'} {Math.abs(market.change).toFixed(2)}%
          </span>
        </div>

        <div className={`text-lg font-black font-mono tabular-nums transition-all duration-300
          ${flash==='up' ? 'text-emerald-400' : flash==='down' ? 'text-rose-400' : 'text-white'}`}>
          {market.price > 1000
            ? '$' + market.price.toLocaleString('en-US', { maximumFractionDigits:1 })
            : market.price > 1
              ? market.price.toFixed(4)
              : market.price.toFixed(5)}
        </div>

        {/* Mini sparkline */}
        <div className="mt-2 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <CandlestickChart height={40} />
        </div>

        <div className="mt-2 flex justify-between text-[9px] font-mono text-slate-500">
          <span>Vol: {market.vol}</span>
          <span className="text-slate-600">→ Trade</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Animated count-up ── */
function CountUp({ end, prefix='', suffix='', decimals=0 }: { end:number; prefix?:string; suffix?:string; decimals?:number }) {
  const [val, setVal]   = useState(0);
  const started         = useRef(false);
  useEffect(() => {
    if (started.current) return; started.current = true;
    const t0 = performance.now();
    const dur = 2000;
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(ease * end);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end]);
  return <>{prefix}{decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString()}{suffix}</>;
}

/* ── SMC Feature Card ── */
function FeatureCard({ icon:Icon, title, desc, color, glow }: any) {
  return (
    <div className={`group card-3d rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60
      p-6 hover:${glow} transition-all duration-300`}>
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Main Page ── */
export default function HomePage() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);

  useEffect(() => {
    const id = setInterval(() => {
      setMarkets(prev => prev.map(m => {
        const d = (Math.random() - 0.485) * 0.08;
        const newPrice = m.price * (1 + d / 100);
        return {
          ...m,
          price: m.price > 1000 ? +newPrice.toFixed(1) : m.price > 1 ? +newPrice.toFixed(4) : +newPrice.toFixed(5),
          change: +(m.change + d * 10).toFixed(2),
          bullish: (m.change + d * 10) >= 0,
        };
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const FEATURES = [
    { icon: LineChart,  title:'TradingView Advanced Charts',    color:'bg-emerald-500/10 text-emerald-400', glow:'glow-emerald', desc:'Full interactive charts with 100+ technical indicators, drawing tools, and multi-timeframe analysis across 14 global markets.' },
    { icon: Brain,      title:'Multi-Model AI Coach',           color:'bg-purple-500/10 text-purple-400',  glow:'glow-purple',  desc:'Route queries through Gemini 1.5, Claude 3.5, and GPT-4o. Generate Pine Script v5, analyze setups, get psychology coaching.' },
    { icon: BarChart3,  title:'SMC Auto-Detection Engine',      color:'bg-cyan-500/10 text-cyan-400',      glow:'glow-cyan',    desc:'Automated BOS, CHoCH, Order Blocks, FVG, Liquidity Sweeps drawn directly on your charts in real-time.' },
    { icon: Target,     title:'Behavioral Trade Journal',       color:'bg-yellow-500/10 text-yellow-400',  glow:'glow-gold',    desc:'Track emotions, mistakes, win rates, and patterns. AI psychology coaching on every closed position.' },
    { icon: Globe,      title:'14 Global Markets',              color:'bg-orange-500/10 text-orange-400',  glow:'glow-gold',    desc:'Crypto, Forex, Stocks, Gold, Silver, Oil, and Indices — unified scanner, terminal, and alert system.' },
    { icon: Flame,      title:'Whale Tracker & Order Flow',     color:'bg-rose-500/10 text-rose-400',      glow:'glow-crimson', desc:'Live depth-of-market, on-chain whale wallet tracking, liquidation heatmaps, and institutional footprint data.' },
    { icon: Shield,     title:'Enterprise Security',            color:'bg-indigo-500/10 text-indigo-400',  glow:'glow-purple',  desc:'PBKDF2 password hashing, HMAC sessions, rate limiting, 2FA, OAuth, XSS/SQLi protection, and audit logs.' },
    { icon: Cpu,        title:'Pine Script Generator',          color:'bg-teal-500/10 text-teal-400',      glow:'glow-cyan',    desc:'Describe your strategy in plain English. Get production-ready Pine Script v5 code with indicators and alerts instantly.' },
  ];

  const STATS = [
    { val:14,     suffix:'+',  label:'Global Markets',    prefix:'',  dec:0 },
    { val:2400,   suffix:'',   label:'SMC Detections/hr', prefix:'',  dec:0 },
    { val:4,      suffix:'',   label:'AI Models Routed',  prefix:'',  dec:0 },
    { val:100000, suffix:'',   label:'Sim Start Balance',  prefix:'$', dec:0 },
  ];

  return (
    <>
      {/* ── LIVE TICKER ── */}
      <LiveTicker />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 pt-8 pb-16 overflow-hidden grid-bg">

        {/* Radial aura */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-emerald-500/6 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20
              bg-emerald-500/5 px-4 py-1.5 text-xs font-mono text-emerald-400 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
              v5.0 LIVE · Institutional AI Trading Suite
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] mb-6">
              Trade Like an<br />
              <span className="gradient-text">Institution</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              <strong className="text-white">Bull Run Apex AI</strong> — TradingView charts,
              Smart Money Concepts auto-detection, multi-model AI coaching, and behavioral
              psychology journaling. All free. Founded by{' '}
              <strong className="text-purple-400">Himanshu Bhmniya</strong>.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/terminal"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500
                  px-7 py-3.5 text-sm font-bold text-[#03060d] shadow-xl shadow-emerald-500/25
                  hover:opacity-90 transition-all hover:scale-[1.02] glow-emerald">
                Launch Terminal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/ai-assistant"
                className="flex items-center gap-2 rounded-xl border border-[var(--apex-border)]
                  bg-slate-900/60 px-7 py-3.5 text-sm font-bold text-slate-200
                  hover:bg-slate-900 hover:border-purple-500/30 transition-all">
                <Brain className="h-4 w-4 text-purple-400" /> AI Coach
              </Link>
              <Link href="/about"
                className="flex items-center gap-2 rounded-xl border border-purple-500/20
                  bg-purple-500/5 px-7 py-3.5 text-sm font-bold text-purple-400
                  hover:bg-purple-500/10 transition-all">
                About Himanshu
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-500">
              {[
                { icon: Lock,    label: 'AES-256 Encrypted' },
                { icon: Shield,  label: 'No KYC Required' },
                { icon: Zap,     label: 'Instant Setup' },
                { icon: Star,    label: 'Free Forever Demo' },
              ].map(b => {
                const I = b.icon;
                return (
                  <span key={b.label} className="flex items-center gap-1.5">
                    <I className="h-3 w-3 text-emerald-500" /> {b.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right — Live chart card */}
          <div className="float-anim">
            <div className="rounded-3xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/80
              backdrop-blur-xl p-5 shadow-2xl neon-border relative overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500
                    flex items-center justify-center text-[#03060d] font-black text-sm">▲</div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">BTC/USD</div>
                    <div className="text-[9px] text-slate-400 font-mono">BINANCE · 1H</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-400 font-mono tabular-nums">
                    ${markets[0].price.toLocaleString('en-US', {maximumFractionDigits:0})}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">
                    ▲ +{markets[0].change.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Main chart */}
              <div className="h-48 mb-4">
                <CandlestickChart height={192} />
              </div>

              {/* SMC overlays label */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[
                  { label:'H4 OB DEMAND', col:'emerald' },
                  { label:'H1 FVG BULLISH', col:'yellow' },
                  { label:'BOS CONFIRMED', col:'cyan' },
                  { label:'CHoCH DETECTED', col:'purple' },
                ].map(t => (
                  <span key={t.label} className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border
                    bg-${t.col}-950/30 text-${t.col}-400 border-${t.col}-900/30`}>
                    {t.label}
                  </span>
                ))}
              </div>

              {/* Mini market row */}
              <div className="grid grid-cols-3 gap-2 border-t border-[var(--apex-border)] pt-3">
                {markets.slice(1, 4).map(m => (
                  <div key={m.symbol} className="text-center">
                    <div className="text-[9px] text-slate-500 font-mono">{m.symbol}</div>
                    <div className={`text-[10px] font-bold font-mono ${m.change >= 0 ? 'text-emerald-400':'text-rose-400'}`}>
                      {m.change >= 0 ? '▲':' ▼'} {Math.abs(m.change).toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Live pulse */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
                <span className="text-[9px] text-emerald-400 font-mono">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-4 border-y border-[var(--apex-border)] bg-[var(--apex-surface)]/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black gradient-text tabular-nums mb-1">
                <CountUp end={s.val} prefix={s.prefix} suffix={s.suffix} decimals={s.dec} />
              </div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE MARKETS GRID ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Live Global Markets
            </h2>
            <p className="text-xs text-slate-500 font-mono">Real-time feeds · click any market to trade</p>
          </div>
          <Link href="/terminal"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold">
            Full Terminal <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {markets.slice(0, 10).map((m, i) => (
            <MarketCard key={m.symbol} market={m} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-16 px-4 bg-[var(--apex-surface)]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Built for serious traders
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Institutional-grade tools, now free for everyone.
              Founded by <strong className="text-purple-400">Himanshu Bhmniya</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3D CHART PREVIEW ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-[var(--apex-border)] bg-[var(--apex-surface)]/60
          overflow-hidden relative">

          {/* Glow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/5 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-purple-500/5 blur-[80px] rounded-full" />
          </div>

          <div className="relative p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20
                  bg-cyan-500/5 px-3 py-1 text-[10px] font-mono text-cyan-400 mb-4">
                  <Sparkles className="h-3 w-3" /> Smart Money Concepts Auto-Detection
                </div>
                <h2 className="text-3xl font-black text-white mb-4">
                  Charts that think<br />
                  <span className="gradient-text">like institutions</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Our AI engine automatically detects and draws Order Blocks, Fair Value Gaps,
                  BOS/CHoCH structure breaks, and Liquidity Pools — directly on your TradingView chart,
                  in real-time, across all timeframes.
                </p>
                <div className="space-y-2">
                  {['Order Blocks (OB) auto-plotted','Fair Value Gaps (FVG) highlighted','BOS & CHoCH structure lines','Kill Zones & Premium/Discount zones','Liquidity sweep alerts'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400">✓</span> {f}
                    </div>
                  ))}
                </div>
                <Link href="/terminal"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500
                    px-5 py-2.5 text-xs font-bold text-[#03060d] hover:bg-emerald-400 transition-all">
                  Open Chart Terminal <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Live chart preview */}
              <div className="rounded-2xl border border-[var(--apex-border)] bg-[#040810] p-4 relative">
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                  <span className="text-white font-bold">XAU/USD — GOLD</span>
                  <span className="text-emerald-400">▲ +1.62% today</span>
                </div>
                <div className="h-48">
                  <CandlestickChart height={192} />
                </div>
                {/* Overlay labels */}
                <div className="absolute top-14 left-6 right-6 flex justify-between pointer-events-none">
                  <div className="text-[8px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-900/50 px-1.5 py-0.5 rounded">H4 DEMAND OB</div>
                  <div className="text-[8px] font-mono text-yellow-400 bg-yellow-950/80 border border-yellow-900/50 px-1.5 py-0.5 rounded">FVG IMBALANCE</div>
                </div>
                <div className="absolute bottom-16 left-6 right-6 border-t border-dashed border-cyan-500/40 pointer-events-none">
                  <span className="absolute -top-3 left-2 text-[7px] font-mono text-cyan-400 bg-[#040810] px-1">H1 BOS BULLISH</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['OB AUTO','FVG DETECT','CHoCH TRACK','LIVE SMC'].map(t => (
                    <span key={t} className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-purple-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20
                bg-purple-500/5 px-3 py-1 text-[10px] font-mono text-purple-400 mb-4 w-fit">
                <Brain className="h-3 w-3" /> AI-Powered Intelligence
              </div>
              <h2 className="text-3xl font-black text-white mb-4">
                Your personal<br />
                <span className="gradient-text">trading coach</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Switch between Gemini, Claude, and GPT-4o on the fly.
                Generate Pine Script, get psychology coaching, analyze setups —
                all stored permanently in your PostgreSQL database.
              </p>
              <Link href="/ai-assistant"
                className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30
                  bg-purple-500/10 px-5 py-2.5 text-xs font-bold text-purple-400
                  hover:bg-purple-500/20 transition-all w-fit">
                Talk to AI Coach <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon:Brain,  title:'Multi-Model Router',   desc:'Gemini, Claude & GPT-4o simultaneously. Auto-routes to best model for each query type.',       col:'purple' },
                { icon:Cpu,    title:'Pine Script Gen',      desc:'Describe strategy in English. Get production Pine Script v5 with full indicator logic.',          col:'cyan' },
                { icon:Shield, title:'Psychology Coach',     desc:'Analyzes FOMO, revenge trading, over-leverage patterns. Gives personalized improvement plans.',   col:'emerald' },
              ].map(c => {
                const I = c.icon;
                return (
                  <div key={c.title}
                    className={`glass rounded-2xl p-5 hover:border-${c.col}-500/30 transition-all card-3d`}>
                    <div className={`h-10 w-10 rounded-xl bg-${c.col}-500/10 flex items-center
                      justify-center mb-3`}>
                      <I className={`h-5 w-5 text-${c.col}-400`} />
                    </div>
                    <div className="text-sm font-bold text-white mb-1.5">{c.title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{c.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── JOURNAL SECTION ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon:Award,      label:'Win Rate Tracking',      val:'Real-time',  col:'emerald' },
            { icon:Target,     label:'Mistake Detection',      val:'AI-Powered', col:'yellow' },
            { icon:Activity,   label:'Emotion Logger',         val:'Per Trade',  col:'purple' },
            { icon:BarChart3,  label:'Performance Analytics',  val:'Dashboard',  col:'cyan' },
          ].map(s => {
            const I = s.icon;
            return (
              <div key={s.label} className={`rounded-2xl border border-[var(--apex-border)]
                bg-[var(--apex-surface)]/60 p-5 text-center card-3d hover:border-${s.col}-500/30 transition-all`}>
                <I className={`h-6 w-6 text-${s.col}-400 mx-auto mb-2`} />
                <div className={`text-sm font-black text-${s.col}-400`}>{s.val}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-emerald-500/15
          bg-gradient-to-br from-emerald-500/5 via-[var(--apex-surface)] to-purple-500/5
          p-10 sm:p-16 text-center relative overflow-hidden">

          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              h-72 w-72 rounded-full bg-emerald-500/8 blur-[80px]" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10
            border border-emerald-500/20 px-4 py-1.5 text-xs font-mono text-emerald-400 mb-6">
            <Star className="h-3 w-3" /> Free · No credit card · Instant access
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Start trading like<br />
            <span className="gradient-text">an institution today</span>
          </h2>

          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm">
            Created by <strong className="text-purple-400">Himanshu Bhmniya</strong>.
            $100,000 simulation balance. Full platform. Zero risk.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/terminal"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500
                px-8 py-3.5 text-sm font-bold text-[#03060d] shadow-lg shadow-emerald-500/20
                hover:opacity-90 transition-all glow-emerald">
              <DollarSign className="h-4 w-4" />
              Start with $100K Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about"
              className="flex items-center gap-2 rounded-xl border border-purple-500/20
                bg-purple-500/5 px-8 py-3.5 text-sm font-bold text-purple-400
                hover:bg-purple-500/10 transition-all">
              <Users className="h-4 w-4" />
              Meet Himanshu Bhmniya
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-[10px] font-mono text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-500" />Encrypted</span>
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-cyan-500" />No KYC</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-purple-500" />Instant Setup</span>
            <span className="flex items-center gap-1.5"><Star className="h-3 w-3 text-yellow-500" />Free Forever Demo</span>
          </div>
        </div>
      </section>
    </>
  );
}
