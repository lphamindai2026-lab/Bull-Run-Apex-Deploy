'use client';

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Brain, Shield, Zap, Star,
  ArrowRight, ArrowUpRight, Activity, Globe, BarChart3,
  Cpu, Flame, Target, Sparkles, DollarSign, Users, Award,
  ChevronDown, Lock, Rocket, LineChart, Bot, Wallet,
  Trophy, BookOpen, FlaskConical, Network, Code, Eye,
  ChevronRight, Play, Layers, Hexagon
} from 'lucide-react';

const BullScene = lazy(() => import('@/components/bull/BullScene'));

/* ════ UTILS ════ */
function CountUp({ end, pre='', suf='', dur=2400 }:
  { end:number; pre?:string; suf?:string; dur?:number }) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return; done.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now-t0)/dur, 1);
      const e = 1 - Math.pow(1-p, 4);
      setV(e*end);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, dur]);
  return <>{pre}{end > 9999 ? Math.floor(v).toLocaleString() : Math.floor(v)}{suf}</>;
}

/* ════ LIVE MARKETS ════ */
const MKT_INIT = [
  { s:'BTC/USD',  p:104520,  c: 4.82,  v:'$14.2B', cat:'CRYPTO',    cc:'#FFD700' },
  { s:'ETH/USD',  p:3420,    c:-1.45,  v:'$4.8B',  cat:'CRYPTO',    cc:'#FFD700' },
  { s:'SOL/USD',  p:184.50,  c: 8.91,  v:'$2.1B',  cat:'CRYPTO',    cc:'#FFD700' },
  { s:'XAU/USD',  p:2342.50, c: 1.62,  v:'$22B',   cat:'COMMODITY', cc:'#FFA500' },
  { s:'EUR/USD',  p:1.0845,  c: 0.22,  v:'$85B',   cat:'FOREX',     cc:'#00F0FF' },
  { s:'GBP/USD',  p:1.2680,  c:-0.15,  v:'$62B',   cat:'FOREX',     cc:'#00F0FF' },
  { s:'NASDAQ',   p:18820,   c: 1.42,  v:'$38B',   cat:'INDEX',     cc:'#9D4EDD' },
  { s:'S&P 500',  p:5430,    c: 0.75,  v:'$44B',   cat:'INDEX',     cc:'#9D4EDD' },
  { s:'AAPL',     p:182.30,  c: 1.15,  v:'52M',    cat:'STOCK',     cc:'#22FF88' },
  { s:'NVDA',     p:875.12,  c:12.45,  v:'110M',   cat:'STOCK',     cc:'#22FF88' },
];

/* ── Ticker Bar ── */
function TickerBar() {
  const [m, setM] = useState(MKT_INIT);
  useEffect(() => {
    const id = setInterval(() => {
      setM(prev => prev.map(x => {
        const d  = (Math.random()-0.485)*0.07;
        const np = x.p > 100 ? +(x.p*(1+d/100)).toFixed(x.p>1000?1:3) : +(x.p*(1+d/100)).toFixed(5);
        return {...x, p:np, c:+(x.c+d*8).toFixed(2)};
      }));
    }, 1600);
    return () => clearInterval(id);
  }, []);
  const items = [...m, ...m];
  return (
    <div className="sticky top-0 z-50 overflow-hidden py-2.5 border-b"
         style={{background:'rgba(3,3,5,0.98)',backdropFilter:'blur(30px)',borderColor:'rgba(255,215,0,0.08)'}}>
      <div className="flex gap-10 ticker-run whitespace-nowrap">
        {items.map((x,i) => {
          const up = x.c >= 0;
          return (
            <span key={i} className="inline-flex items-center gap-2 text-[11px] font-mono">
              <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{background:`${x.cc}14`,color:x.cc}}>{x.cat}</span>
              <span className="font-black text-white">{x.s}</span>
              <span className="tabnum" style={{color:'#bbb'}}>
                {x.p > 100 ? '$'+x.p.toLocaleString('en-US',{maximumFractionDigits:x.p>1000?1:3}) : x.p.toFixed(5)}
              </span>
              <span className={`font-bold ${up?'text-[#22FF88]':'text-[#FF3B5C]'}`}>
                {up?'▲':'▼'}{Math.abs(x.c).toFixed(2)}%
              </span>
              <span style={{color:'rgba(255,215,0,0.2)'}}>◆</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Market Card ── */
function MktCard({ d, i }: { d:typeof MKT_INIT[0]; i:number }) {
  const [p, setP] = useState(d.p);
  const [c, setC] = useState(d.c);
  const [fl, setFl] = useState<'up'|'dn'|null>(null);
  const prev = useRef(d.p);
  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random()-0.485)*0.06;
      const np = +(p*(1+delta/100)).toFixed(p>100?1:4);
      setFl(np > prev.current ? 'up':'dn');
      prev.current = np;
      setP(np);
      setC(cc => +(cc+delta*7).toFixed(2));
      setTimeout(()=>setFl(null),700);
    }, 2200 + i*180);
    return ()=>clearInterval(id);
  }, [p, i]);
  const up = c >= 0;
  const fmt = (v:number) => v>1000?'$'+v.toLocaleString('en-US',{maximumFractionDigits:1}):v>1?v.toFixed(3):v.toFixed(5);
  return (
    <Link href="/terminal">
      <div className="gc tilt p-5 cursor-none group relative" style={{animationDelay:`${i*70}ms`}}>
        <div className={`absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-25 ${up?'bg-[#22FF88]':'bg-[#FF3B5C]'}`} />
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[11px] font-black text-white">{d.s}</div>
            <div className="text-[9px] font-bold mt-0.5" style={{color:d.cc}}>{d.cat}</div>
          </div>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full font-mono border ${up?'text-[#22FF88] border-[#22FF88]/25 bg-[#22FF88]/06':'text-[#FF3B5C] border-[#FF3B5C]/25 bg-[#FF3B5C]/06'}`}>
            {up?'▲':'▼'}{Math.abs(c).toFixed(2)}%
          </span>
        </div>
        <div className={`text-xl font-black font-mono tabnum transition-colors duration-500 ${fl==='up'?'text-[#22FF88]':fl==='dn'?'text-[#FF3B5C]':'text-white'}`}>
          {fmt(p)}
        </div>
        {/* Mini chart bars */}
        <div className="flex items-end gap-px h-8 mt-3 opacity-60 group-hover:opacity-90 transition-opacity">
          {Array.from({length:16}).map((_,j)=>{
            const h=25+Math.sin(j*0.8+i)*20+Math.random()*15;
            const bull=Math.random()>(up?0.35:0.6);
            return <div key={j} className="flex-1 rounded-sm" style={{height:`${h}%`,background:bull?'#22FF8888':'#FF3B5C88',minWidth:2}} />;
          })}
        </div>
      </div>
    </Link>
  );
}

/* ── Section Header ── */
function SH({ tag, title, sub, c='#FFD700' }: { tag:string; title:React.ReactNode; sub:string; c?:string }) {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-mono font-bold mb-5"
           style={{borderColor:`${c}28`,color:c,background:`${c}08`}}>
        <span className="h-1.5 w-1.5 rounded-full" style={{background:c,animation:'pulse-g 2s ease infinite'}} />
        {tag}
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">{title}</h2>
      <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{color:'#666'}}>{sub}</p>
    </div>
  );
}

/* ── Feature Card ── */
function FCard({ icon:I, title, desc, col, delay=0 }:
  { icon:any; title:string; desc:string; col:string; delay?:number }) {
  return (
    <div className="gc tilt p-6 group" style={{animationDelay:`${delay}ms`}}>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
           style={{background:`${col}12`,border:`1px solid ${col}22`}}>
        <I className="h-6 w-6" style={{color:col}} />
      </div>
      <h3 className="text-sm font-black text-white mb-2">{title}</h3>
      <p className="text-xs leading-relaxed" style={{color:'#666'}}>{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN PAGE
═══════════════════════════════════ */
export default function HomePage() {

  return (
    <div style={{background:'#030305'}}>

      {/* TICKER */}
      <TickerBar />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg neural-bg"
               style={{background:'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.04) 0%, transparent 60%), #030305'}}>

        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/5 h-[700px] w-[700px] rounded-full blur-[180px]"
               style={{background:'radial-gradient(circle,rgba(255,215,0,0.08),transparent 70%)',animation:'aurora 10s ease infinite'}} />
          <div className="absolute top-1/3 right-1/5 h-[600px] w-[600px] rounded-full blur-[160px]"
               style={{background:'radial-gradient(circle,rgba(0,240,255,0.06),transparent 70%)',animation:'aurora 14s ease infinite reverse'}} />
          <div className="absolute bottom-1/4 left-1/2 h-[500px] w-[500px] rounded-full blur-[140px]"
               style={{background:'radial-gradient(circle,rgba(157,78,221,0.05),transparent 70%)',animation:'aurora 18s ease infinite'}} />
        </div>

        {/* Gold scanline */}
        <div className="absolute left-0 right-0 h-px pointer-events-none"
             style={{background:'linear-gradient(90deg,transparent,rgba(255,215,0,0.15),transparent)',
                     top:'40%',animation:'beam 4s ease-in-out infinite'}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-16">

            {/* LEFT */}
            <div className="fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2 text-[11px] font-mono font-black mb-8"
                   style={{borderColor:'rgba(255,215,0,0.25)',background:'rgba(255,215,0,0.05)',color:'#FFD700'}}>
                <span className="h-2 w-2 rounded-full bg-[#22FF88]" style={{animation:'pulse-g 2s infinite'}} />
                AI TRADING ECOSYSTEM — v5.0 · LIVE NOW
                <span className="rounded-full px-2 py-0.5 text-[9px] font-black" style={{background:'rgba(34,255,136,0.15)',color:'#22FF88'}}>ACTIVE</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl xl:text-[76px] font-black leading-[0.95] mb-6 tracking-tight">
                <span className="text-white">Trade Like</span><br />
                <span className="grad-gold tglow-g">an Institution.</span><br />
                <span className="text-white">Win Like</span><br />
                <span className="grad-cyan">a Legend.</span>
              </h1>

              <p className="text-sm sm:text-[15px] leading-relaxed mb-2 max-w-lg" style={{color:'#888'}}>
                <strong className="text-white">Autonomous Intelligence. Unmatched Precision.</strong>
              </p>
              <p className="text-sm leading-relaxed mb-10 max-w-lg" style={{color:'#666'}}>
                The world's most advanced AI trading platform — Smart Money Concepts, multi-model AI, real-time order flow. Founded by{' '}
                <strong className="font-bold" style={{color:'#9D4EDD'}}>Himanshu Bhmniya</strong>.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/terminal">
                  <button className="btn-g text-sm px-8 py-4 flex items-center gap-2.5">
                    <Rocket className="h-4 w-4" /> Launch Platform
                  </button>
                </Link>
                <Link href="/ai-assistant">
                  <button className="btn-c text-sm px-8 py-4 flex items-center gap-2.5">
                    <Brain className="h-4 w-4" /> AI Coach
                  </button>
                </Link>
                <Link href="/about">
                  <button className="btn-p text-sm px-8 py-4 flex items-center gap-2.5">
                    <Users className="h-4 w-4" /> About
                  </button>
                </Link>
              </div>

              {/* Trust */}
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {[
                  { i:Lock,   l:'Military Encryption' },
                  { i:Shield, l:'No KYC Required' },
                  { i:Zap,    l:'Sub-1ms Execution' },
                  { i:Star,   l:'Free Forever Demo' },
                ].map(b => {
                  const I = b.i;
                  return (
                    <div key={b.l} className="flex items-center gap-2 text-[11px]" style={{color:'#444'}}>
                      <I className="h-3 w-3" style={{color:'#FFD700'}} />
                      {b.l}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — 3D Bull */}
            <div className="relative h-[560px] lg:h-[680px]">
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="h-20 w-20 rounded-full border-2 border-t-[#FFD700] border-[#111] animate-spin" />
                  <p className="text-xs font-mono" style={{color:'#444'}}>Rendering 3D Engine…</p>
                </div>
              }>
                <BullScene />
              </Suspense>

              {/* Floating info chips */}
              <div className="absolute top-6 right-4 gc px-4 py-3 float-1 rounded-xl" style={{animationDelay:'0s'}}>
                <div className="text-[9px] font-mono mb-0.5" style={{color:'#555'}}>BTC/USD · LIVE</div>
                <div className="text-sm font-black" style={{color:'#22FF88'}}>▲ +4.82% ↑</div>
                <div className="text-[10px] font-mono" style={{color:'#888'}}>$104,520</div>
              </div>
              <div className="absolute bottom-20 left-2 gc-cyan px-4 py-3 float-2 rounded-xl" style={{animationDelay:'0.6s'}}>
                <div className="text-[9px] font-mono mb-0.5" style={{color:'#00F0FF'}}>AI SIGNAL</div>
                <div className="text-xs font-black text-white">STRONG BUY</div>
                <div className="text-[9px]" style={{color:'#22FF88'}}>Confidence: 94%</div>
              </div>
              <div className="absolute top-1/2 right-1 gc-purple px-3 py-2 float-1 rounded-xl" style={{animationDelay:'1.2s'}}>
                <div className="text-[9px] font-mono" style={{color:'#9D4EDD'}}>SMC DETECT</div>
                <div className="text-[11px] font-black text-white">H4 OB + FVG</div>
              </div>
              <div className="absolute bottom-32 right-8 gc-gold px-3 py-2 float-2 rounded-xl" style={{animationDelay:'0.9s'}}>
                <div className="text-[9px] font-mono" style={{color:'#FFD700'}}>WIN RATE</div>
                <div className="text-[11px] font-black text-white">68.4% ✓</div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-[9px] font-mono mb-2" style={{color:'rgba(255,215,0,0.4)'}}>SCROLL TO EXPLORE</div>
          <ChevronDown className="h-4 w-4 mx-auto animate-bounce" style={{color:'rgba(255,215,0,0.4)'}} />
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="py-20 border-y" style={{background:'rgba(8,8,15,0.98)',borderColor:'rgba(255,215,0,0.07)'}}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-10">
          {[
            { end:250000,  suf:'+',  lbl:'Active Traders',     c:'#FFD700' },
            { end:99,      suf:'%+', lbl:'AI Signal Accuracy', c:'#22FF88' },
            { end:14,      suf:'+',  lbl:'Global Markets',     c:'#00F0FF' },
            { end:2400000, suf:'+',  lbl:'Trades Executed',    c:'#9D4EDD' },
          ].map(s => (
            <div key={s.lbl} className="text-center">
              <div className="text-4xl sm:text-5xl font-black mb-1.5 tabnum" style={{color:s.c}}>
                <CountUp end={s.end} suf={s.suf} />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest" style={{color:'#444'}}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ LIVE MARKETS ══════════════ */}
      <section className="py-24" style={{background:'#030305'}}>
        <div className="max-w-7xl mx-auto px-4">
          <SH tag="LIVE MARKETS" c="#FFD700"
            title={<>Real-time <span className="grad-gold">Markets</span></>}
            sub="Live feeds across Crypto, Forex, Commodities, Stocks and Indices — click any to trade" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {MKT_INIT.map((d,i) => <MktCard key={d.s} d={d} i={i} />)}
          </div>
          <div className="text-center">
            <Link href="/terminal">
              <button className="btn-g text-sm px-8 py-4 inline-flex items-center gap-2">
                <Activity className="h-4 w-4" /> Open Full Terminal
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ TRADING ARENA ══════════════ */}
      <section className="py-24 hex-bg" style={{background:'rgba(8,8,15,0.95)'}}>
        <div className="max-w-7xl mx-auto px-4">
          <SH tag="LIVE TRADING ARENA" c="#00F0FF"
            title={<>Professional <span style={{color:'#00F0FF'}}>Arena</span></>}
            sub="TradingView charts with AI overlay, real-time order book, SMC auto-detection, and whale tracking" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Chart */}
            <div className="lg:col-span-2 gc p-5 relative scan overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#22FF88]" style={{animation:'pulse-g 2s infinite'}} />
                  <span className="text-xs font-mono font-black text-white">BTC/USDT</span>
                  <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{background:'rgba(255,215,0,0.1)',color:'#FFD700'}}>H4 · LIVE</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black" style={{color:'#22FF88'}}>$104,520</span>
                  <Link href="/terminal">
                    <button className="btn-g text-[10px] px-3 py-1.5 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> Full Chart
                    </button>
                  </Link>
                </div>
              </div>
              {/* Candles */}
              <div className="flex items-end gap-px h-52 mb-4">
                {Array.from({length:52}).map((_,i) => {
                  const trend = i > 30 ? 0.58 : 0.42;
                  const bull  = Math.random() > (1-trend);
                  const h     = 15 + Math.sin(i*0.5)*22 + Math.random()*28;
                  return (
                    <div key={i} className="flex-1 rounded-t-sm transition-opacity hover:opacity-70"
                         style={{height:`${h}%`,
                                 background:bull?'#22FF88':'#FF3B5C',
                                 boxShadow:bull?'0 0 4px rgba(34,255,136,0.4)':'0 0 4px rgba(255,59,92,0.4)',
                                 minWidth:2}} />
                  );
                })}
              </div>
              {/* SMC tags */}
              <div className="flex flex-wrap gap-2">
                {[['H4 DEMAND OB','#22FF88'],['H1 BULLISH FVG','#FFD700'],['CHoCH DETECTED','#00F0FF'],['LIQUIDITY SWEEP','#9D4EDD'],['PREMIUM/DISCOUNT','#FFA500']].map(([l,c])=>(
                  <span key={l} className="text-[8px] font-mono px-2 py-0.5 rounded border"
                        style={{borderColor:`${c}30`,color:c,background:`${c}08`}}>{l}</span>
                ))}
              </div>
            </div>

            {/* Order Book */}
            <div className="gc p-5">
              <div className="text-[11px] font-mono font-black text-white mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" style={{animation:'pulse-g 2s infinite'}} />
                ORDER BOOK — DOM
              </div>
              <div className="text-[9px] font-mono grid grid-cols-3 mb-2" style={{color:'#444'}}>
                <span>PRICE</span><span className="text-center">SIZE</span><span className="text-right">TOTAL</span>
              </div>
              {/* Asks */}
              {['104,860','104,840','104,820','104,800','104,780'].map((p,i)=>(
                <div key={p} className="relative flex items-center gap-2 py-0.5 mb-0.5">
                  <div className="absolute inset-y-0 right-0 rounded-l" style={{width:`${75-i*12}%`,background:'rgba(255,59,92,0.07)'}} />
                  <span className="flex-1 text-[10px] font-mono tabnum relative z-10" style={{color:'#FF3B5C'}}>${p}</span>
                  <span className="text-[10px] font-mono tabnum text-center w-12 relative z-10" style={{color:'#555'}}>{(Math.random()*6+0.2).toFixed(3)}</span>
                  <span className="text-[9px] font-mono tabnum text-right w-12 relative z-10" style={{color:'#333'}}>{(Math.random()*30+5).toFixed(2)}</span>
                </div>
              ))}
              {/* Mid */}
              <div className="text-center py-2 text-xs font-black border-y my-1" style={{color:'#FFD700',borderColor:'rgba(255,215,0,0.12)'}}>
                $104,715 <span className="text-[9px] font-mono" style={{color:'#22FF88'}}>▲</span>
              </div>
              {/* Bids */}
              {['104,700','104,680','104,660','104,640','104,620'].map((p,i)=>(
                <div key={p} className="relative flex items-center gap-2 py-0.5 mb-0.5">
                  <div className="absolute inset-y-0 right-0 rounded-l" style={{width:`${35+i*10}%`,background:'rgba(34,255,136,0.07)'}} />
                  <span className="flex-1 text-[10px] font-mono tabnum relative z-10" style={{color:'#22FF88'}}>${p}</span>
                  <span className="text-[10px] font-mono tabnum text-center w-12 relative z-10" style={{color:'#555'}}>{(Math.random()*9+0.3).toFixed(3)}</span>
                  <span className="text-[9px] font-mono tabnum text-right w-12 relative z-10" style={{color:'#333'}}>{(Math.random()*50+10).toFixed(2)}</span>
                </div>
              ))}

              {/* Fear & Greed */}
              <div className="mt-4 p-3 rounded-xl border" style={{borderColor:'rgba(255,215,0,0.12)',background:'rgba(255,215,0,0.03)'}}>
                <div className="text-[9px] font-mono mb-2" style={{color:'#555'}}>FEAR & GREED INDEX</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black" style={{color:'#22FF88'}}>78</div>
                  <div>
                    <div className="text-[11px] font-black" style={{color:'#22FF88'}}>EXTREME GREED</div>
                    <div className="text-[9px]" style={{color:'#555'}}>Market sentiment: Very Bullish</div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                  <div className="h-full rounded-full" style={{width:'78%',background:'linear-gradient(90deg,#FF3B5C,#FFD700,#22FF88)'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ AI COMMAND CENTER ══════════════ */}
      <section className="py-24" style={{background:'#030305'}}>
        <div className="max-w-7xl mx-auto px-4">
          <SH tag="AI COMMAND CENTER" c="#9D4EDD"
            title={<>Intelligence <span style={{color:'#9D4EDD'}}>Beyond</span> Human</>}
            sub="Gemini · Claude · GPT-4o — voice commands, auto-trading, Pine Script, psychology coaching" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon:Brain,      title:'Multi-Model AI',         desc:'Route between Gemini, Claude 3.5, and GPT-4o. Best model auto-selected per query.',   col:'#9D4EDD', delay:0 },
              { icon:Bot,        title:'Auto-Trading Bot',        desc:'Define your strategy. AI executes trades 24/7 with dynamic risk management.',         col:'#FFD700', delay:60 },
              { icon:Code,       title:'Pine Script v5 Gen',      desc:'Describe your strategy in plain English. Get production-ready Pine Script instantly.', col:'#00F0FF', delay:120 },
              { icon:Eye,        title:'Chart Vision AI',         desc:'Upload any chart screenshot. AI identifies SMC patterns, setups, and recommendations.',col:'#22FF88', delay:180 },
              { icon:Network,    title:'Psychology Coach',        desc:'FOMO, revenge trades, over-leverage detected. Daily behavioral improvement coaching.',  col:'#FF3B5C', delay:240 },
              { icon:BarChart3,  title:'SMC Auto-Plot',           desc:'BOS, CHoCH, Order Blocks, FVG, Kill Zones — all drawn automatically on your charts.',  col:'#FFD700', delay:300 },
              { icon:Zap,        title:'Voice AI Control',        desc:'Talk to the AI assistant hands-free. Ask for analysis, signals, market summaries.',    col:'#9D4EDD', delay:360 },
              { icon:Target,     title:'Signal Engine v3',        desc:'AI generates high-confidence signals across 14 markets with probabilistic scoring.',   col:'#00F0FF', delay:420 },
            ].map((f,i) => <FCard key={i} {...f} />)}
          </div>
          <div className="text-center">
            <Link href="/ai-assistant">
              <button className="btn-p text-sm px-8 py-4 inline-flex items-center gap-2">
                <Brain className="h-4 w-4" /> Open AI Command Center
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ PRODUCTS 3D ══════════════ */}
      <section className="py-24" style={{background:'rgba(8,8,15,0.98)'}}>
        <div className="max-w-7xl mx-auto px-4">
          <SH tag="PRODUCTS" c="#FFD700"
            title={<>Our <span className="grad-gold">Ecosystem</span></>}
            sub="Every professional tool you need — unified in one premium platform" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon:Activity,     title:'Trading Terminal',     desc:'TradingView + SMC overlay + DOM + paper trading.',       c:'#FFD700', href:'/terminal' },
              { icon:Brain,        title:'AI Assistant',         desc:'Multi-model coach: voice, images, PDF, memory.',          c:'#9D4EDD', href:'/ai-assistant' },
              { icon:BookOpen,     title:'Trade Journal',        desc:'Psychology tracking, mistake analysis, win-rate AI.',     c:'#00F0FF', href:'/journal' },
              { icon:BarChart3,    title:'Portfolio & Alerts',   desc:'Asset allocation, Telegram/Discord/Email alerts.',        c:'#22FF88', href:'/portfolio' },
              { icon:FlaskConical, title:'Backtesting Lab',      desc:'Test strategies on historical data statistically.',      c:'#FF3B5C', href:'/terminal' },
              { icon:Trophy,       title:'Trading Arena',        desc:'Global competitions, leaderboards, prize pools.',        c:'#FFD700', href:'/' },
            ].map((p,i) => {
              const I = p.icon;
              return (
                <Link href={p.href} key={i}>
                  <div className="holo p-7 group cursor-none transition-all duration-400 hover:scale-[1.02] hover:shadow-2xl">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                         style={{background:`${p.c}10`,border:`1px solid ${p.c}20`}}>
                      <I className="h-7 w-7" style={{color:p.c}} />
                    </div>
                    <h3 className="text-base font-black text-white mb-2">{p.title}</h3>
                    <p className="text-xs leading-relaxed mb-4" style={{color:'#555'}}>{p.desc}</p>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{color:p.c}}>
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ FOUNDER ══════════════ */}
      <section className="py-24 grid-bg" style={{background:'#030305'}}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative flex justify-center">
              {/* Glow rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              h-80 w-80 rounded-full border border-[#FFD700]/08 rotate-a pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              h-96 w-96 rounded-full border border-[#9D4EDD]/06 rotate-rev-a pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              h-[28rem] w-[28rem] rounded-full border border-[#00F0FF]/04 rotate-a pointer-events-none"
                   style={{animationDuration:'30s'}} />

              {/* Floating orbit elements */}
              {[
                { col:'#FFD700', txt:'Founder', deg:0 },
                { col:'#00F0FF', txt:'Trader',  deg:120 },
                { col:'#9D4EDD', txt:'Builder', deg:240 },
              ].map(o => (
                <div key={o.txt} className="absolute top-1/2 left-1/2 pointer-events-none"
                     style={{animation:`orbit${o.deg===0?1:o.deg===120?2:3} 12s linear infinite`}}>
                  <div className="gc px-2.5 py-1 rounded-full whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
                       style={{border:`1px solid ${o.col}30`,color:o.col,fontSize:9,fontFamily:'monospace',fontWeight:700}}>
                    {o.txt}
                  </div>
                </div>
              ))}

              {/* Photo */}
              <div className="h-72 w-72 rounded-3xl overflow-hidden relative"
                   style={{border:'2px solid rgba(255,215,0,0.25)',boxShadow:'0 0 80px rgba(255,215,0,0.12), 0 0 160px rgba(157,78,221,0.06)'}}>
                <img src="/images/himanshu.svg"
                     alt="Himanshu Bhmniya — Founder of Bull Run Apex AI"
                     className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 50%,rgba(3,3,5,0.85))'}} />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <div className="text-xs font-black" style={{color:'#FFD700'}}>Himanshu Bhmniya</div>
                  <div className="text-[9px] font-mono" style={{color:'#666'}}>Founder & CEO</div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-mono font-bold mb-6"
                   style={{borderColor:'rgba(255,215,0,0.25)',color:'#FFD700',background:'rgba(255,215,0,0.05)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" style={{animation:'pulse-g 2s infinite'}} />
                FOUNDER STORY
              </div>
              <h2 className="text-4xl font-black text-white mb-4">
                The Visionary Behind<br /><span className="grad-gold">Bull Run Apex</span>
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{color:'#777'}}>
                Trader, Entrepreneur, and Founder & CEO of Bull Run Apex AI — building the
                world's most advanced AI-powered institutional trading platform to democratize
                professional trading for every trader on Earth.
              </p>
              <p className="text-sm leading-relaxed mb-8" style={{color:'#555'}}>
                From the vision of making institutional-grade tools accessible to everyone,
                to building a complete AI ecosystem — Himanshu is redefining what's possible
                in financial technology.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { l:'Role',     v:'Founder & CEO',     c:'#FFD700' },
                  { l:'Platform', v:'Bull Run Apex AI',  c:'#00F0FF' },
                  { l:'Focus',    v:'AI × Quant Finance',c:'#9D4EDD' },
                  { l:'Founded',  v:'2026',              c:'#22FF88' },
                ].map(s => (
                  <div key={s.l} className="gc-gold p-3 rounded-xl border-[#FFD700]/12">
                    <div className="text-[9px] font-mono mb-0.5" style={{color:'#444'}}>{s.l}</div>
                    <div className="text-xs font-bold" style={{color:s.c}}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg==" target="_blank" rel="noopener noreferrer">
                  <button className="btn-g text-xs px-4 py-2">📸 Instagram</button>
                </a>
                <a href="https://t.me/lphamindai_bot" target="_blank" rel="noopener noreferrer">
                  <button className="btn-c text-xs px-4 py-2">✈️ Telegram</button>
                </a>
                <a href="https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i" target="_blank" rel="noopener noreferrer">
                  <button className="btn-p text-xs px-4 py-2">💬 WhatsApp</button>
                </a>
                <Link href="/about">
                  <button className="text-xs px-4 py-2 rounded-xl border font-bold transition-all hover:border-[#FFD700]/50 hover:text-[#FFD700]"
                          style={{borderColor:'rgba(255,215,0,0.2)',color:'#888'}}>
                    Full Profile →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ ROADMAP ══════════════ */}
      <section className="py-24" style={{background:'rgba(8,8,15,0.98)'}}>
        <div className="max-w-5xl mx-auto px-4">
          <SH tag="ROADMAP 2026–2031" c="#FFD700"
            title={<>Cinematic <span className="grad-gold">Roadmap</span></>}
            sub="The evolution of Bull Run Apex from launch to global trading empire" />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                 style={{background:'linear-gradient(#FFD70040,#9D4EDD20,transparent)'}} />
            {[
              { y:'2026', items:['✅ AI Trading Platform v5.0','✅ Multi-model AI Coach','✅ SMC Auto-Detection','✅ Psychology Journal'], active:true },
              { y:'2027', items:['📱 Android & iOS Apps','🤖 Auto-Trading Engine v2','🏆 Trading Competitions','🎓 Academy Premium'] },
              { y:'2028', items:['🖥️ Desktop Platform','🌐 AI Strategy Marketplace','🔗 Full Web3 & DeFi','📊 Institutional API'] },
              { y:'2029', items:['🤝 Copy-Trading Network','🌍 20+ Languages AI','💎 Quant Hedge Fund Tools','🏦 Prime Brokerage'] },
              { y:'2030', items:['🎮 Bull Run Game Studio','🕹️ Trading Metaverse','🏅 $100K Monthly Tournaments','🌐 Exchange License'] },
              { y:'2031', items:['🌌 Metaverse Trading Hub','🤖 AGI Assistant','🌍 1M+ Traders','🚀 IPO / Global'] },
            ].map((r,i) => {
              const left = i%2===0;
              return (
                <div key={i} className={`relative flex mb-12 ${left?'justify-start':'justify-end'}`}>
                  {/* Center dot */}
                  <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10">
                    <div className={`h-4 w-4 rounded-full border-2 transition-all ${r.active?'pulse-g-a':''}`}
                         style={{
                           background: r.active ? '#FFD700' : '#111',
                           borderColor: r.active ? '#FFD700' : '#333',
                           boxShadow: r.active ? '0 0 20px rgba(255,215,0,0.5)' : 'none',
                         }} />
                  </div>
                  <div className={`w-5/12 ${left?'mr-auto pr-8':'ml-auto pl-8'}`}>
                    <div className={`gc p-5 ${r.active?'border-[#FFD700]/30':''}`}
                         style={r.active?{boxShadow:'0 0 30px rgba(255,215,0,0.07)'}:{}}>
                      <div className="text-2xl font-black mb-3 grad-gold">{r.y}</div>
                      <ul className="space-y-1.5">
                        {r.items.map((it,j)=>(
                          <li key={j} className="text-[11px] flex items-start gap-2" style={{color:r.active?'#ccc':'#555'}}>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TECHNOLOGY ══════════════ */}
      <section className="py-24" style={{background:'#030305'}}>
        <div className="max-w-6xl mx-auto px-4">
          <SH tag="TECHNOLOGY" c="#00F0FF"
            title={<>World-Class <span style={{color:'#00F0FF'}}>Infrastructure</span></>}
            sub="Enterprise-grade tech stack built for institutional performance, security, and scale" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {[
              {n:'Next.js 15',   e:'▲', c:'#fff'},
              {n:'TypeScript',   e:'TS',c:'#3178C6'},
              {n:'Three.js',     e:'⬡', c:'#049EF4'},
              {n:'PostgreSQL',   e:'🐘',c:'#336791'},
              {n:'Supabase',     e:'⚡',c:'#3ECF8E'},
              {n:'Tailwind',     e:'🎨',c:'#06B6D4'},
              {n:'Drizzle ORM',  e:'💧',c:'#C5F74F'},
              {n:'TradingView',  e:'📈',c:'#2196F3'},
              {n:'Gemini AI',    e:'✦', c:'#4285F4'},
              {n:'GPT-4o',       e:'◯', c:'#10A37F'},
              {n:'Claude 3.5',   e:'∞', c:'#D97706'},
              {n:'Vercel Edge',  e:'▲', c:'#fff'},
            ].map(t=>(
              <div key={t.n} className="gc tilt p-4 text-center group cursor-none">
                <div className="text-2xl mb-2">{t.e}</div>
                <div className="text-[9px] font-mono transition-colors group-hover:text-white" style={{color:t.c}}>{t.n}</div>
              </div>
            ))}
          </div>
          {/* Security */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {e:'🔐',t:'PBKDF2-SHA512',     d:'Military-grade hashing'},
              {e:'🛡️',t:'HMAC Sessions',     d:'Cryptographic cookies'},
              {e:'⚡',t:'Rate Limiting',      d:'Brute force protection'},
              {e:'🔒',t:'CSP + XSS Guard',   d:'Zero-injection policy'},
            ].map(s=>(
              <div key={s.t} className="gc-cyan p-5 text-center rounded-2xl">
                <div className="text-3xl mb-2">{s.e}</div>
                <div className="text-xs font-black text-white mb-1">{s.t}</div>
                <div className="text-[9px]" style={{color:'#555'}}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ COMMUNITY ══════════════ */}
      <section className="py-20 border-y" style={{background:'rgba(8,8,15,0.98)',borderColor:'rgba(255,215,0,0.06)'}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SH tag="COMMUNITY" c="#FFD700"
            title={<>Join the <span className="grad-gold">Bull Run</span></>}
            sub="Traders, analysts, and developers from 50+ countries — growing together" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {e:'📸',n:'Instagram',  h:'@legacy_boy_1',         c:'#E1306C', url:'https://www.instagram.com/legacy_boy_1?igsh=MXUxNGcwODdibWZvdg=='},
              {e:'✈️',n:'Telegram',   h:'@lphamindai_bot',       c:'#0088CC', url:'https://t.me/lphamindai_bot'},
              {e:'💬',n:'WhatsApp',   h:'Official Channel',      c:'#25D366', url:'https://whatsapp.com/channel/0029VbCyUjIADTODKbn7MA1i'},
              {e:'📧',n:'Email',      h:'bullrunapex@gmail.com', c:'#FFD700', url:'mailto:bullrunapex@gmail.com'},
            ].map(s=>(
              <a key={s.n} href={s.url} target="_blank" rel="noopener noreferrer">
                <div className="gc tilt p-5 text-center group cursor-none">
                  <div className="text-4xl mb-2">{s.e}</div>
                  <div className="text-xs font-black text-white mb-0.5">{s.n}</div>
                  <div className="text-[9px] font-mono" style={{color:s.c}}>{s.h}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="py-28 relative overflow-hidden grid-bg neural-bg"
               style={{background:'#030305'}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          h-[700px] w-[700px] rounded-full blur-[200px] opacity-15"
               style={{background:'radial-gradient(circle,#FFD700,#9D4EDD 60%,transparent)'}} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Big bull emoji */}
          <div className="text-7xl mb-6 float-1">🐂</div>

          <h2 className="text-5xl sm:text-6xl xl:text-7xl font-black mb-4 leading-tight">
            <span className="grad-gold tglow-g">Trade Like the Best.</span>
          </h2>
          <p className="text-xl font-light text-white mb-2">Start free. No limits. Full power.</p>
          <p className="text-sm mb-12" style={{color:'#444'}}>
            Founded by <strong style={{color:'#9D4EDD'}}>Himanshu Bhmniya</strong> · $100,000 simulation balance included
          </p>

          <div className="flex flex-wrap justify-center gap-5 mb-12">
            <Link href="/terminal">
              <button className="btn-g text-base px-10 py-4 flex items-center gap-3 glow-g">
                <DollarSign className="h-5 w-5" /> Launch Free Platform
              </button>
            </Link>
            <Link href="/ai-assistant">
              <button className="btn-c text-base px-10 py-4 flex items-center gap-3">
                <Brain className="h-5 w-5" /> Try AI Coach
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-p text-base px-10 py-4 flex items-center gap-3">
                <Users className="h-5 w-5" /> Meet Himanshu
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-[11px] font-mono" style={{color:'#333'}}>
            {['No credit card','No KYC','Instant access','Free demo forever','Real AI models','24/7 available'].map(t=>(
              <span key={t} className="flex items-center gap-1.5">
                <span style={{color:'#FFD700'}}>◆</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
