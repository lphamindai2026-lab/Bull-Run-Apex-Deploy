'use client';

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Link from 'next/link';
import LiveTicker from '@/components/ui/LiveTicker';
import {
  TrendingUp, TrendingDown, Brain, Shield, Zap, Star,
  ArrowRight, ArrowUpRight, Activity, Globe, BarChart3,
  Cpu, Flame, Target, Sparkles, DollarSign, Users, Award,
  Play, ChevronDown, Lock, Rocket, LineChart, Bot, Wallet,
  Trophy, BookOpen, FlaskConical, Network, Code
} from 'lucide-react';

const BullScene = lazy(() => import('@/components/bull/BullScene'));

/* ── Animated Count-up ── */
function CountUp({ end, prefix='', suffix='', duration=2500 }:
  { end:number; prefix?:string; suffix?:string; duration?:number }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return; done.current = true;
    const t0 = performance.now();
    const step = (now: number) => {
      const p  = Math.min((now - t0) / duration, 1);
      const e  = 1 - Math.pow(1 - p, 4);
      setV(e * end);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <>{prefix}{end > 999 ? Math.floor(v).toLocaleString() : Math.floor(v)}{suffix}</>;
}

/* ── Market Card ── */
const MARKETS = [
  { sym:'BTC/USD',  p:104520,  c: 4.82, cat:'CRYPTO'   },
  { sym:'ETH/USD',  p:3420,    c:-1.45, cat:'CRYPTO'   },
  { sym:'XAU/USD',  p:2342.5,  c: 1.62, cat:'COMMODITY'},
  { sym:'SOL/USD',  p:184.5,   c: 8.91, cat:'CRYPTO'   },
  { sym:'NASDAQ',   p:18820,   c: 1.42, cat:'INDEX'    },
  { sym:'S&P 500',  p:5430,    c: 0.75, cat:'INDEX'    },
];

function MarketCard({ m, i }: { m:typeof MARKETS[0]; i:number }) {
  const [price, setPrice] = useState(m.p);
  const [change, setChange] = useState(m.c);
  const [flash, setFlash] = useState<'up'|'dn'|null>(null);
  const prev = useRef(m.p);

  useEffect(() => {
    const id = setInterval(() => {
      const d  = (Math.random()-0.485)*0.06;
      const np = +(price * (1+d/100)).toFixed(price>100 ? 1 : 4);
      setFlash(np > prev.current ? 'up' : 'dn');
      prev.current = np;
      setPrice(np);
      setChange(c => +(c + d*8).toFixed(2));
      setTimeout(() => setFlash(null), 700);
    }, 2000 + i*300);
    return () => clearInterval(id);
  }, [price, i]);

  const up = change >= 0;
  return (
    <div className="glass-card p-5 relative overflow-hidden cursor-pointer group"
         style={{ animationDelay:`${i*80}ms` }}>
      {/* Glow blob */}
      <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-15 transition-opacity group-hover:opacity-30"
           style={{ background: up ? '#22FF88' : '#FF3B5C', filter:'blur(20px)' }} />
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs font-black text-white tracking-wider">{m.sym}</div>
          <div className="text-[9px] mt-0.5 font-bold" style={{
            color: m.cat==='CRYPTO'?'#FFD700': m.cat==='COMMODITY'?'#FFA500':
                   m.cat==='INDEX' ?'#00F0FF' : '#9D4EDD'
          }}>{m.cat}</div>
        </div>
        <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border font-mono
          ${up ? 'border-[#22FF88]/30 text-[#22FF88] bg-[#22FF88]/08'
               : 'border-[#FF3B5C]/30 text-[#FF3B5C] bg-[#FF3B5C]/08'}`}>
          {up?'▲':'▼'} {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <div className={`text-xl font-black font-mono tabular transition-colors duration-500
        ${flash==='up' ? 'text-[#22FF88]' : flash==='dn' ? 'text-[#FF3B5C]' : 'text-white'}`}>
        {price > 100 ? '$'+price.toLocaleString('en-US',{maximumFractionDigits:1}) : price.toFixed(4)}
      </div>
      <div className="mt-2 text-[9px] font-mono" style={{color:'#555'}}>Vol: 24h high activity</div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ tag, title, sub, accent='gold' }:
  { tag:string; title:React.ReactNode; sub:string; accent?:'gold'|'cyan'|'purple' }) {
  const colors = { gold:'#FFD700', cyan:'#00F0FF', purple:'#9D4EDD' };
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-bold mb-5"
           style={{ borderColor:`${colors[accent]}30`, color:colors[accent], background:`${colors[accent]}08` }}>
        <span className="h-1.5 w-1.5 rounded-full pulse-gold-anim" style={{background:colors[accent]}} />
        {tag}
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">{title}</h2>
      <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{color:'#888'}}>{sub}</p>
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon:Icon, title, desc, color, delay=0 }:
  { icon:any; title:string; desc:string; color:string; delay?:number }) {
  return (
    <div className="glass-card p-6 group" style={{animationDelay:`${delay}ms`}}>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-all
                      group-hover:scale-110"
           style={{ background:`${color}12`, border:`1px solid ${color}25` }}>
        <Icon className="h-6 w-6" style={{color}} />
      </div>
      <h3 className="text-sm font-black text-white mb-2">{title}</h3>
      <p className="text-xs leading-relaxed" style={{color:'#777'}}>{desc}</p>
    </div>
  );
}

/* ── Roadmap Item ── */
function RoadmapItem({ year, items, active, left }:
  { year:string; items:string[]; active?:boolean; left:boolean }) {
  return (
    <div className={`flex ${left ? 'flex-row' : 'flex-row-reverse'} items-start gap-8 mb-16`}>
      <div className="flex-1">
        <div className={`glass-card p-6 ${active ? 'border-[#FFD700]/40 glow-gold' : ''}`}>
          <div className="text-2xl font-black mb-3 gradient-gold">{year}</div>
          <ul className="space-y-2">
            {items.map((item,i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{color:active?'#ddd':'#666'}}>
                <span style={{color:active?'#FFD700':'#444'}}>◆</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`h-5 w-5 rounded-full border-2 transition-all ${active ? 'pulse-gold-anim' : ''}`}
             style={{ background:active?'#FFD700':'#222', borderColor:active?'#FFD700':'#333' }} />
        <div className="w-0.5 h-24 mt-2" style={{background:`linear-gradient(${active?'#FFD700,#FFD70022':'#22222200,#222'})` }} />
      </div>
      <div className="flex-1" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{background:'#0A0A0A'}} className="min-h-screen">

      {/* ══ LOADING BAR ══ */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[100]"
           style={{background:'linear-gradient(90deg,#FFD700,#00F0FF,#9D4EDD)'}} />

      {/* ══ LIVE TICKER ══ */}
      <div className="sticky top-0 z-50">
        <LiveTicker />
      </div>

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg neural-bg">

        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full blur-[160px] opacity-20"
               style={{background:'radial-gradient(circle,#FFD700,#FFA50000)'}} />
          <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full blur-[140px] opacity-15"
               style={{background:'radial-gradient(circle,#00F0FF,transparent)'}} />
          <div className="absolute bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full blur-[120px] opacity-12"
               style={{background:'radial-gradient(circle,#9D4EDD,transparent)'}} />
        </div>

        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-20">

            {/* LEFT — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-black mb-8"
                   style={{borderColor:'rgba(255,215,0,0.3)',color:'#FFD700',background:'rgba(255,215,0,0.06)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#22FF88] pulse-gold-anim" />
                AI TRADING ECOSYSTEM — v5.0 LIVE
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.0] mb-6">
                <span className="text-white">The Future of</span><br />
                <span className="gradient-gold text-glow-gold">AI Trading</span><br />
                <span className="text-white">Starts</span>{' '}
                <span className="gradient-cyan-purple">Here</span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed mb-3 font-light max-w-lg"
                 style={{color:'#AAAAAA'}}>
                <strong style={{color:'#FFD700'}}>Autonomous Intelligence. Unmatched Precision.</strong><br />
                Bull Market Dominance. — Founded by{' '}
                <strong style={{color:'#9D4EDD'}}>Himanshu Bhmniya</strong>
              </p>
              <p className="text-xs mb-10 max-w-md" style={{color:'#666'}}>
                Institutional-grade AI trading platform combining Smart Money Concepts,
                multi-model AI coaching, real-time order flow, and behavioral psychology coaching.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/terminal">
                  <button className="btn-gold text-sm px-7 py-3.5 flex items-center gap-2">
                    <Rocket className="h-4 w-4" /> Launch Platform
                  </button>
                </Link>
                <Link href="/ai-assistant">
                  <button className="btn-cyan text-sm px-7 py-3.5 flex items-center gap-2">
                    <Brain className="h-4 w-4" /> AI Coach
                  </button>
                </Link>
                <Link href="/about">
                  <button className="btn-purple text-sm px-7 py-3.5 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Meet Himanshu
                  </button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon:Lock,    label:'Bank-Grade Security' },
                  { icon:Shield,  label:'No KYC Required' },
                  { icon:Zap,     label:'Sub-1ms Execution' },
                  { icon:Star,    label:'Free Forever Demo' },
                ].map(b => {
                  const I = b.icon;
                  return (
                    <div key={b.label} className="flex items-center gap-2 text-xs" style={{color:'#555'}}>
                      <I className="h-3 w-3" style={{color:'#FFD700'}} />
                      {b.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — 3D Bull */}
            <div className="relative h-[520px] lg:h-[640px]">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-2 border-t-[#FFD700] border-[#222] animate-spin" />
                </div>
              }>
                <BullScene />
              </Suspense>

              {/* Floating stat chips */}
              <div className="absolute top-8 right-4 glass-card px-4 py-2.5 float-anim">
                <div className="text-[9px] font-mono" style={{color:'#666'}}>BTC/USD</div>
                <div className="text-sm font-black" style={{color:'#22FF88'}}>+4.82% ▲</div>
              </div>
              <div className="absolute bottom-16 left-4 glass-cyan px-4 py-2.5 rounded-xl float-anim"
                   style={{animationDelay:'0.8s'}}>
                <div className="text-[9px] font-mono" style={{color:'#00F0FF'}}>AI SIGNAL</div>
                <div className="text-xs font-black text-white">STRONG BUY</div>
              </div>
              <div className="absolute top-1/2 right-2 glass-purple px-3 py-2 rounded-xl float-anim"
                   style={{animationDelay:'1.4s'}}>
                <div className="text-[9px] font-mono" style={{color:'#9D4EDD'}}>SMC DETECT</div>
                <div className="text-xs font-black text-white">OB + FVG</div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] font-mono" style={{color:'#FFD700'}}>SCROLL TO EXPLORE</span>
          <ChevronDown className="h-4 w-4 animate-bounce" style={{color:'#FFD700'}} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 border-y" style={{borderColor:'rgba(255,215,0,0.08)',background:'#111111'}}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { val:250000,  suf:'+', lbl:'Active Traders',   col:'#FFD700' },
              { val:99.8,    suf:'%', lbl:'AI Signal Accuracy',col:'#22FF88' },
              { val:14,      suf:'+', lbl:'Global Markets',   col:'#00F0FF' },
              { val:2400000, suf:'+', lbl:'Trades Executed',  col:'#9D4EDD' },
            ].map(s => (
              <div key={s.lbl} className="text-center">
                <div className="text-4xl font-black mb-1 tabular" style={{color:s.col}}>
                  <CountUp end={s.val} suffix={s.suf} />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider" style={{color:'#555'}}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE MARKETS
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0A0A0A'}}>
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            tag="LIVE MARKETS"
            title={<>Real-time <span className="gradient-gold">Global Markets</span></>}
            sub="Live feeds across Crypto, Forex, Commodities, Stocks and Indices — click any to trade instantly"
            accent="gold"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MARKETS.map((m, i) => <MarketCard key={m.sym} m={m} i={i} />)}
          </div>
          <div className="text-center mt-8">
            <Link href="/terminal">
              <button className="btn-gold text-sm px-8 py-3.5 flex items-center gap-2 mx-auto">
                <Activity className="h-4 w-4" /> Open Full Trading Terminal
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE TRADING ARENA
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0d0d0d'}}>
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            tag="TRADING ARENA"
            title={<>Live <span style={{color:'#00F0FF'}}>Trading Arena</span></>}
            sub="Professional-grade charts powered by TradingView with AI overlay, order flow, and SMC auto-detection"
            accent="cyan"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart preview */}
            <div className="lg:col-span-2 glass-card p-5 scan-container" style={{minHeight:320}}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#22FF88] pulse-gold-anim" />
                  <span className="text-xs font-mono font-bold text-white">BTC/USDT — H4</span>
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{background:'rgba(255,215,0,0.1)',color:'#FFD700'}}>LIVE</span>
                </div>
                <Link href="/terminal">
                  <button className="btn-gold text-[10px] px-3 py-1.5 flex items-center gap-1.5">
                    <ArrowUpRight className="h-3 w-3" /> Full Chart
                  </button>
                </Link>
              </div>
              {/* Simulated chart bars */}
              <div className="flex items-end gap-1 h-48">
                {Array.from({length:40}).map((_,i) => {
                  const h  = 20 + Math.sin(i*0.7+1)*25 + Math.random()*30;
                  const up = Math.random() > 0.42;
                  return (
                    <div key={i} className="flex-1 rounded-t-sm transition-all hover:opacity-80"
                         style={{ height:`${h}%`, background:up?'#22FF88':'#FF3B5C',
                                  boxShadow:up?'0 0 6px rgba(34,255,136,0.4)':'0 0 6px rgba(255,59,92,0.4)',
                                  minWidth:2 }} />
                  );
                })}
              </div>
              {/* SMC labels */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {['H4 OB DEMAND','FVG BULLISH','CHoCH DETECTED','LIQUIDITY SWEPT'].map(l => (
                  <span key={l} className="text-[8px] font-mono px-2 py-0.5 rounded border"
                        style={{borderColor:'rgba(0,240,255,0.25)',color:'#00F0FF',background:'rgba(0,240,255,0.05)'}}>
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Order book */}
            <div className="glass-card p-5">
              <div className="text-xs font-mono font-bold text-white mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] pulse-gold-anim" />
                ORDER BOOK
              </div>
              <div className="space-y-1.5">
                {['104,850','104,820','104,790','104,760','104,730'].map((p,i) => (
                  <div key={p} className="flex items-center gap-2 relative">
                    <div className="absolute inset-y-0 left-0 rounded"
                         style={{width:`${80-i*12}%`,background:'rgba(255,59,92,0.08)'}} />
                    <span className="relative z-10 text-[10px] font-mono flex-1" style={{color:'#FF3B5C'}}>${p}</span>
                    <span className="relative z-10 text-[10px] font-mono" style={{color:'#555'}}>{(Math.random()*5+0.5).toFixed(3)}</span>
                  </div>
                ))}
                <div className="text-center py-1 text-xs font-black" style={{color:'#FFD700'}}>$104,715 MID</div>
                {['104,700','104,670','104,640','104,610','104,580'].map((p,i) => (
                  <div key={p} className="flex items-center gap-2 relative">
                    <div className="absolute inset-y-0 left-0 rounded"
                         style={{width:`${30+i*10}%`,background:'rgba(34,255,136,0.08)'}} />
                    <span className="relative z-10 text-[10px] font-mono flex-1" style={{color:'#22FF88'}}>${p}</span>
                    <span className="relative z-10 text-[10px] font-mono" style={{color:'#555'}}>{(Math.random()*8+0.5).toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          AI COMMAND CENTER
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0A0A0A'}}>
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            tag="AI BOT COMMAND CENTER"
            title={<>AI Trading <span style={{color:'#9D4EDD'}}>Intelligence</span></>}
            sub="Multi-model AI routing across Gemini, Claude, and GPT-4o — voice commands, auto-trading, Pine Script generation"
            accent="purple"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon:Brain,      title:'Multi-Model AI Router',    desc:'Switch between Gemini 1.5, Claude 3.5, and GPT-4o. Optimal routing per query.',          col:'#9D4EDD' },
              { icon:Bot,        title:'Auto-Trading Engine',       desc:'Set your strategy. AI executes trades automatically with risk management.',              col:'#FFD700' },
              { icon:Code,       title:'Pine Script Generator',     desc:'Describe in English, get production Pine Script v5 with indicators.',                    col:'#00F0FF' },
              { icon:Network,    title:'Psychology Coach',          desc:'FOMO, revenge trade, over-leverage detection. Personalized behavioral coaching.',        col:'#22FF88' },
              { icon:BarChart3,  title:'SMC Auto-Detection',        desc:'BOS, CHoCH, OB, FVG, Liquidity Sweeps drawn automatically on all timeframes.',           col:'#FF3B5C' },
              { icon:LineChart,  title:'Chart Screenshot AI',       desc:'Upload any chart image. AI identifies patterns, SMC levels, and entry setups.',          col:'#FFD700' },
              { icon:Zap,        title:'Voice Commands',            desc:'Talk to the AI assistant. Ask for analysis, signals, or market summaries.',              col:'#9D4EDD' },
              { icon:Target,     title:'Signal Engine',             desc:'AI generates high-conviction signals across 14 markets with confidence scoring.',        col:'#00F0FF' },
            ].map((f,i) => <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} color={f.col} delay={i*50} />)}
          </div>
          <div className="text-center mt-10">
            <Link href="/ai-assistant">
              <button className="btn-purple text-sm px-8 py-3.5 flex items-center gap-2 mx-auto">
                <Brain className="h-4 w-4" /> Launch AI Command Center
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRODUCTS
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0d0d0d'}}>
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            tag="PRODUCTS"
            title={<>Our <span className="gradient-gold">Ecosystem</span></>}
            sub="Every tool you need to trade professionally — all in one unified platform"
            accent="gold"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon:Activity,   title:'Trading Terminal',      desc:'TradingView charts + SMC overlay + DOM + paper trading simulator.',  col:'#FFD700', href:'/terminal' },
              { icon:Brain,      title:'AI Assistant',          desc:'Multi-model coach with voice, image upload, PDF analysis and memory.', col:'#9D4EDD', href:'/ai-assistant' },
              { icon:BookOpen,   title:'Trade Journal',         desc:'Behavioral tracking, psychology coaching, win-rate analytics.',         col:'#00F0FF', href:'/journal' },
              { icon:BarChart3,  title:'Portfolio & Alerts',    desc:'Asset allocation, price alerts via Telegram, Discord, Email, SMS.',    col:'#22FF88', href:'/portfolio' },
              { icon:FlaskConical,title:'Backtesting Lab',      desc:'Test strategies on historical data with statistical performance reports.', col:'#FF3B5C', href:'/terminal' },
              { icon:Trophy,     title:'Trading Arena',         desc:'Compete in tournaments, climb leaderboards, win rewards.',             col:'#FFD700', href:'/' },
            ].map((p,i) => {
              const I = p.icon;
              return (
                <Link href={p.href} key={i}>
                  <div className="holo-card p-7 group cursor-pointer transition-all duration-300
                                  hover:scale-[1.02] hover:shadow-2xl"
                       style={{animationDelay:`${i*80}ms`}}>
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                         style={{background:`${p.col}12`,border:`1px solid ${p.col}25`}}>
                      <I className="h-7 w-7" style={{color:p.col}} />
                    </div>
                    <h3 className="text-base font-black text-white mb-2">{p.title}</h3>
                    <p className="text-xs leading-relaxed mb-4" style={{color:'#666'}}>{p.desc}</p>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{color:p.col}}>
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TRADING ACADEMY
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0A0A0A'}}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-bold mb-6"
                   style={{borderColor:'rgba(0,240,255,0.3)',color:'#00F0FF',background:'rgba(0,240,255,0.06)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] pulse-cyan-anim" />
                BULL RUN ACADEMY
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Master the<br /><span style={{color:'#00F0FF'}}>Markets</span> with AI
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{color:'#777'}}>
                From beginner to institutional trader. Smart Money Concepts, Order Flow, AI Trading,
                Quantitative Finance — all taught by AI tutor with interactive exercises.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Smart Money Concepts Mastery',
                  'AI Trading Bot Strategy Building',
                  'Quantitative Risk Management',
                  'Psychology & Emotional Discipline',
                  'Pine Script Development',
                ].map(c => (
                  <div key={c} className="flex items-center gap-3 text-sm" style={{color:'#ccc'}}>
                    <span style={{color:'#00F0FF'}}>◆</span> {c}
                  </div>
                ))}
              </div>
              <Link href="/whats-new">
                <button className="btn-cyan text-sm px-7 py-3.5 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Explore Academy
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n:'50+',  l:'Free Courses',     c:'#FFD700' },
                { n:'12K+', l:'Students',         c:'#22FF88' },
                { n:'98%',  l:'Completion Rate',  c:'#00F0FF' },
                { n:'4.9★', l:'Rating',           c:'#9D4EDD' },
              ].map(s => (
                <div key={s.l} className="glass-card p-6 text-center">
                  <div className="text-3xl font-black mb-1" style={{color:s.c}}>{s.n}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{color:'#555'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WEB3 / WALLET
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#111111'}}>
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            tag="WEB3 INTEGRATION"
            title={<><span style={{color:'#9D4EDD'}}>Wallet</span> Connect</>}
            sub="Seamless Web3 integration — MetaMask, WalletConnect, Phantom, Coinbase Wallet. Your keys, your assets."
            accent="purple"
          />
          <div className="max-w-3xl mx-auto">
            <div className="glass-purple p-8 text-center rounded-2xl mb-8">
              <Wallet className="h-16 w-16 mx-auto mb-4" style={{color:'#9D4EDD'}} />
              <h3 className="text-2xl font-black text-white mb-2">Connect Your Wallet</h3>
              <p className="text-sm mb-6" style={{color:'#777'}}>Non-custodial · Secure · Decentralized</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {['MetaMask','WalletConnect','Phantom','Coinbase'].map(w => (
                  <div key={w} className="glass-card p-3 text-center rounded-xl">
                    <div className="text-xl mb-1">🔐</div>
                    <div className="text-[10px] font-mono" style={{color:'#888'}}>{w}</div>
                  </div>
                ))}
              </div>
              <button className="btn-purple text-sm px-8 py-3.5 flex items-center gap-2 mx-auto">
                <Wallet className="h-4 w-4" /> Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOUNDER SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0A0A0A'}}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="relative">
                <div className="h-72 w-72 mx-auto rounded-3xl overflow-hidden border-2 border-[#FFD700]/30 relative"
                     style={{boxShadow:'0 0 60px rgba(255,215,0,0.15)'}}>
                  <img
                    src="/images/himanshu.svg"
                    alt="Himanshu Bhmniya — Founder of Bull Run Apex AI"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 50%,rgba(10,10,10,0.8))'}} />
                </div>
                {/* Orbit rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-[#FFD700]/15 animate-[spin_20s_linear_infinite] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#9D4EDD]/10 animate-[spin_30s_linear_infinite_reverse] pointer-events-none" />

                {/* Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-card px-6 py-3 text-center rounded-2xl border-[#FFD700]/30 whitespace-nowrap">
                  <div className="text-xs font-black" style={{color:'#FFD700'}}>Himanshu Bhmniya</div>
                  <div className="text-[10px] font-mono" style={{color:'#666'}}>Founder & CEO · Bull Run Apex AI</div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-bold mb-6"
                   style={{borderColor:'rgba(255,215,0,0.3)',color:'#FFD700',background:'rgba(255,215,0,0.06)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700] pulse-gold-anim" />
                FOUNDER STORY
              </div>
              <h2 className="text-4xl font-black text-white mb-4">
                The Visionary Behind<br /><span className="gradient-gold">Bull Run Apex</span>
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{color:'#888'}}>
                Trader, Entrepreneur, and Founder & CEO of Bull Run Apex AI —
                building the world's most advanced AI-powered institutional trading platform
                to democratize professional trading tools for every trader on Earth.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label:'Role',      val:'Founder & CEO',     c:'#FFD700' },
                  { label:'Platform',  val:'Bull Run Apex AI',  c:'#00F0FF' },
                  { label:'Focus',     val:'AI + Quant Finance',c:'#9D4EDD' },
                  { label:'Founded',   val:'2026',              c:'#22FF88' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-3 rounded-xl">
                    <div className="text-[9px] font-mono mb-0.5" style={{color:'#555'}}>{s.label}</div>
                    <div className="text-xs font-bold" style={{color:s.c}}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==" target="_blank" rel="noopener noreferrer">
                  <button className="btn-gold text-xs px-4 py-2">📸 Instagram</button>
                </a>
                <a href="https://t.me/lphamindai_bot" target="_blank" rel="noopener noreferrer">
                  <button className="btn-cyan text-xs px-4 py-2">✈️ Telegram</button>
                </a>
                <a href="mailto:bullrunapex@gmail.com">
                  <button className="btn-purple text-xs px-4 py-2">📧 Email</button>
                </a>
                <Link href="/about">
                  <button className="btn-purple text-xs px-4 py-2 border" style={{borderColor:'rgba(255,215,0,0.3)',color:'#FFD700',background:'rgba(255,215,0,0.05)'}}>
                    Full Profile →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ROADMAP
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0d0d0d'}}>
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            tag="ROADMAP 2026 — 2031"
            title={<>Cinematic <span className="gradient-gold">Roadmap</span></>}
            sub="The evolution of Bull Run Apex AI from launch to global trading empire"
            accent="gold"
          />
          <div>
            {[
              { year:'2026', items:['✅ AI Trading Platform Launch','✅ Multi-model AI Coach','✅ SMC Auto-Detection','✅ Trade Journal & Psychology AI'], active:true, left:true },
              { year:'2027', items:['📱 Android & iOS Native Apps','🤖 Auto-Trading Engine v2','🏆 Trading Arena Competitions','🎓 Bull Run Academy Premium'], active:false, left:false },
              { year:'2028', items:['🖥️ Desktop Platform (Windows/Mac)','🌐 AI Strategy Marketplace','🔗 Full Web3 & DeFi Integration','📊 Institutional API Access'], active:false, left:true },
              { year:'2029', items:['🤝 Copy-Trading Network','🌍 Multilingual AI (20+ languages)','💎 Quantitative Hedge Fund Tools','🏦 Prime Brokerage Integration'], active:false, left:false },
              { year:'2030', items:['🎮 Bull Run Game Studio Launch','🕹️ Trading Metaverse','🏅 Monthly $100K Tournaments','🌐 Global Exchange License'], active:false, left:true },
              { year:'2031', items:['🌌 Metaverse Trading Hub','🤖 AGI Trading Assistant','🌍 1M+ Active Traders','🚀 IPO / Global Expansion'], active:false, left:false },
            ].map((r,i) => <RoadmapItem key={i} {...r} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TECHNOLOGY
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#0A0A0A'}}>
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            tag="TECHNOLOGY"
            title={<>Powered by <span style={{color:'#00F0FF'}}>World-Class</span> Tech</>}
            sub="Enterprise infrastructure built for institutional-grade performance, security, and reliability"
            accent="cyan"
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {[
              { name:'Next.js 15',   icon:'▲', c:'#fff'    },
              { name:'TypeScript',   icon:'TS', c:'#3178C6' },
              { name:'Three.js',     icon:'⬡', c:'#049EF4' },
              { name:'PostgreSQL',   icon:'🐘', c:'#336791' },
              { name:'Supabase',     icon:'⚡', c:'#3ECF8E' },
              { name:'Tailwind',     icon:'🎨', c:'#06B6D4' },
              { name:'Drizzle ORM',  icon:'💧', c:'#C5F74F' },
              { name:'GSAP',         icon:'🎬', c:'#88CE02' },
              { name:'TradingView',  icon:'📈', c:'#2196F3' },
              { name:'Vercel',       icon:'▲', c:'#fff'    },
              { name:'Cloudflare',   icon:'🔶', c:'#F38020' },
              { name:'wagmi/viem',   icon:'🔗', c:'#9D4EDD' },
            ].map(t => (
              <div key={t.name} className="glass-card p-4 text-center group hover:scale-105 transition-transform">
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-[10px] font-mono" style={{color:t.c}}>{t.name}</div>
              </div>
            ))}
          </div>

          {/* Security badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon:'🔐', title:'PBKDF2-SHA512', desc:'Military-grade password hashing' },
              { icon:'🛡️', title:'HMAC Sessions',  desc:'Cryptographically signed cookies' },
              { icon:'⚡', title:'Rate Limiting',  desc:'Brute force protection' },
              { icon:'🔒', title:'CSP Headers',    desc:'XSS & injection protection' },
            ].map(s => (
              <div key={s.title} className="glass-card p-5 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-xs font-black text-white mb-1">{s.title}</div>
                <div className="text-[10px]" style={{color:'#555'}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          COMMUNITY
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{background:'#111111'}}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <SectionHeader
            tag="COMMUNITY"
            title={<>Join the <span className="gradient-gold">Bull Run</span> Community</>}
            sub="Traders, analysts, and developers from 50+ countries learning and growing together"
            accent="gold"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon:'📸', name:'Instagram', handle:'@legacy_boy_1', c:'#E1306C', url:'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==' },
              { icon:'✈️', name:'Telegram',  handle:'@lphamindai_bot', c:'#0088CC', url:'https://t.me/lphamindai_bot' },
              { icon:'💬', name:'WhatsApp',  handle:'Channel', c:'#25D366', url:'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i' },
              { icon:'📧', name:'Email',     handle:'bullrunapex@gmail.com', c:'#FFD700', url:'mailto:bullrunapex@gmail.com' },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                <div className="glass-card p-5 text-center group hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-xs font-black text-white mb-0.5">{s.name}</div>
                  <div className="text-[9px] font-mono" style={{color:s.c}}>{s.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{background:'#0A0A0A'}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid-bg neural-bg opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[160px] opacity-20"
               style={{background:'radial-gradient(circle,#FFD700,transparent)'}} />
        </div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="text-6xl mb-6">🐂</div>
          <h2 className="text-5xl sm:text-6xl font-black mb-4">
            <span className="gradient-gold text-glow-gold">Trade Like the Best.</span>
          </h2>
          <p className="text-lg mb-3 text-white font-light">Start with $100,000 simulation. Zero risk. Full power.</p>
          <p className="text-sm mb-10" style={{color:'#555'}}>
            Founded by <strong style={{color:'#9D4EDD'}}>Himanshu Bhmniya</strong> · Built for serious traders
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/terminal">
              <button className="btn-gold text-base px-10 py-4 flex items-center gap-3">
                <Rocket className="h-5 w-5" /> Launch Platform Free
              </button>
            </Link>
            <Link href="/ai-assistant">
              <button className="btn-cyan text-base px-10 py-4 flex items-center gap-3">
                <Brain className="h-5 w-5" /> Try AI Coach
              </button>
            </Link>
          </div>
          <div className="mt-10 flex justify-center gap-10 text-xs font-mono" style={{color:'#333'}}>
            <span>No credit card</span>
            <span style={{color:'#FFD700'}}>◆</span>
            <span>No KYC</span>
            <span style={{color:'#FFD700'}}>◆</span>
            <span>Instant access</span>
            <span style={{color:'#FFD700'}}>◆</span>
            <span>Free forever demo</span>
          </div>
        </div>
      </section>
    </div>
  );
}
