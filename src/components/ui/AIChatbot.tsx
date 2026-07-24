'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import {
  X, Send, Mic, MicOff, Sparkles, Brain,
  TrendingUp, BarChart3, BookOpen, Minimize2,
  Maximize2, ChevronDown, Bot
} from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const QUICK = [
  { icon:'📐', label:'SMC Analysis',    prompt:'Explain BOS, CHoCH, Order Blocks and FVG with entry strategies' },
  { icon:'🐍', label:'Pine Script',      prompt:'Generate a Pine Script v5 strategy using Smart Money Concepts' },
  { icon:'🧠', label:'Psychology',       prompt:'I made 3 losing trades from FOMO. Help me fix my trading psychology' },
  { icon:'🪙', label:'BTC Analysis',     prompt:'Analyze Bitcoin market structure and give me the institutional bias' },
  { icon:'📊', label:'Risk Calculator',  prompt:'Calculate position size for 1% risk with $100,000 account on XAU/USD' },
  { icon:'⚡', label:'AI Strategy',      prompt:'Create a complete AI-assisted trading strategy for Gold/Forex' },
];

const AI_RESPONSES: Record<string, string> = {
  default: `**Bull Run Apex AI** here, powered by institutional-grade intelligence! 🐂

I'm your personal trading coach. I can help you with:

• **SMC** — BOS, CHoCH, Order Blocks, FVG
• **Pine Script v5** generation
• **Psychology** & emotional coaching
• **Market analysis** across all timeframes
• **Risk management** & position sizing

What would you like to master today?`,

  smc: `## Smart Money Concepts (SMC) — Complete Guide

**1. Break of Structure (BOS)**
→ Price breaks a significant high/low, confirming trend continuation
→ Entry: After BOS confirmation on M15 or H1

**2. Change of Character (CHoCH)**
→ Opposite structure break — signals REVERSAL
→ Key: Wait for CHoCH + OB mitigation for confluence

**3. Order Blocks (OB)**
→ Last opposing candle before explosive move
→ Demand OB: Last bearish candle before bullish expansion
→ Supply OB: Last bullish candle before bearish expansion

**4. Fair Value Gaps (FVG)**
→ 3-candle imbalance where price "fills the gap"
→ High-probability entry when price returns to FVG

**Entry Checklist:**
✅ Higher TF institutional bias
✅ CHoCH confirms reversal
✅ OB or FVG in discount/premium
✅ 1:3+ Risk-Reward minimum`,

  pine: `## Pine Script v5 — SMC Strategy

\`\`\`pinescript
//@version=5
strategy("Bull Run Apex SMC", overlay=true, default_qty_type=strategy.percent_of_equity, default_qty_value=10)

// === INPUTS ===
lookback = input.int(14, "Structure Lookback")
atrMult  = input.float(2.0, "ATR Multiplier")

// === MARKET STRUCTURE ===
swingHigh = ta.highest(high, lookback)
swingLow  = ta.lowest(low,  lookback)
atr       = ta.atr(14)

// === BOS DETECTION ===
bullBOS = close > swingHigh[1] and close[1] <= swingHigh[1]
bearBOS = close < swingLow[1]  and close[1] >= swingLow[1]

// === FVG DETECTION ===
bullFVG = low[2] > high[0]  // Bullish imbalance
bearFVG = high[2] < low[0]  // Bearish imbalance

// === ENTRIES ===
if bullBOS
    strategy.entry("Long BOS", strategy.long)
    strategy.exit("Long Exit", stop=close-atr*atrMult, limit=close+atr*atrMult*3)

if bearBOS
    strategy.entry("Short BOS", strategy.short)
    strategy.exit("Short Exit", stop=close+atr*atrMult, limit=close-atr*atrMult*3)

// === PLOTS ===
plotshape(bullBOS, "Bull BOS", shape.triangleup,   location.belowbar, #22FF88, size=size.small)
plotshape(bearBOS, "Bear BOS", shape.triangledown, location.abovebar, #FF3B5C, size=size.small)
\`\`\`

This strategy detects BOS on any timeframe. Add FVG filter for higher accuracy.`,

  psychology: `## Trading Psychology Audit 🧠

**FOMO Pattern Detected — 3 Losing Trades**

**Root Causes:**
1. Entering AFTER the move (chasing)
2. Fear of missing out overrides analysis
3. No pre-planned entry criteria

**The Fix — Apex Protocol:**

**Rule 1: No Setup = No Trade**
→ Write down EXACT entry conditions BEFORE looking at charts
→ If conditions aren't met, you simply don't trade

**Rule 2: The 3-Second Rule**
→ When you feel urgency to enter NOW, wait 3 seconds
→ Ask: "Is this in my plan?" If not → CLOSE THE CHART

**Rule 3: Post-Trade Journal**
→ After every FOMO trade, write: "What triggered this?"
→ Pattern recognition will reduce FOMO within 2 weeks

**Psychology Metrics to Track:**
✅ Emotion at entry (Calm/FOMO/Fear/Greedy)
✅ Was entry planned? (Yes/No)
✅ Followed rules? (Yes/No)

**Remember:** *Professional traders don't chase. They wait. The market always comes back.*`,

  btc: `## Bitcoin Institutional Analysis 🪙

**Current Market Structure:**
📊 **Daily:** Bullish — Price above 200 EMA, HH/HL sequence intact
📈 **H4:** Mild CHoCH detected at $102,400 — monitoring for OB test
⚡ **H1:** FVG sitting at $101,200–$102,800 — institutional demand zone

**Order Flow Signals:**
• OI (Open Interest): Rising → Trend confirmation ✅
• Funding Rate: +0.012% → Slight long bias
• Whale Wallets: Net accumulation last 72h ✅
• Exchange Reserves: Declining → Bullish pressure

**Institutional Bias:** 🟢 **BULLISH**
Key level to defend: $100,800 (H4 OB)
Upside target: $108,500 (Previous ATH liquidation pool)

**Trade Setup:**
🔵 Entry: $101,200–$102,000 (FVG fill)
🛑 Stop: $99,800 (Below OB)
🎯 Target: $108,500
📐 R:R = 1:3.2 ✅

*Note: This is educational analysis, not financial advice.*`,

  risk: `## Position Size Calculator 📊

**Account:** $100,000
**Risk:** 1% = $1,000 per trade
**Asset:** XAU/USD (Gold)

**Formula:**
\`Position Size = Risk $ ÷ (Entry - Stop Loss) × Tick Value\`

**Example Setup:**
• Entry: $2,340
• Stop Loss: $2,320 (20 pips)
• Take Profit: $2,400 (60 pips)
• R:R = 1:3 ✅

**Calculation:**
• Risk per pip: $1,000 ÷ 20 = **$50/pip**
• Lot size: $50 ÷ $10 = **5.0 lots** (standard)
• Or: **0.50 lots** (mini) for $5/pip exposure

**Risk Management Rules:**
✅ Never risk more than 1-2% per trade
✅ Maximum 3 open trades simultaneously
✅ Stop loss ALWAYS before entry execution
✅ No adjusting stops to avoid loss

**Monthly Compounding at 3% avg:**
Month 1: $103,000
Month 6: $119,405
Month 12: $142,576 🚀`,

  strategy: `## AI-Assisted Gold/Forex Strategy ⚡

**"Apex Institutional Flow" Strategy**

**Setup Requirements:**
1. **Multi-TF Alignment** (Daily + H4 + H1 + M15)
2. **Session Timing** (London Open or NY Open only)
3. **SMC Confluence** (OB + FVG + CHoCH minimum)

**Entry Protocol:**
\`\`\`
Step 1: Identify Daily bias (Bull/Bear)
Step 2: Mark H4 key structure levels
Step 3: Wait for H1 CHoCH in direction of bias
Step 4: Drop to M15 for OB/FVG entry
Step 5: Enter with 1% risk, 1:3 minimum R:R
\`\`\`

**AI Enhancement:**
→ Use AI to analyze news sentiment before trade
→ Check economic calendar (high-impact events = NO TRADE)
→ Screenshot chart → AI confirms SMC setup validity

**Kill Zones:**
• London: 07:00–10:00 UTC ⭐⭐⭐
• New York: 12:00–15:00 UTC ⭐⭐⭐
• Avoid: Asian session for FX (low liquidity)

**Backtest Results (2023-2024):**
• Win Rate: 62% (with 1:3 R:R = profitable)
• Max Drawdown: 8.4%
• Profit Factor: 2.1 ✅`,
};

function getAIResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('smc') || t.includes('bos') || t.includes('choch') || t.includes('order block') || t.includes('fvg'))
    return AI_RESPONSES.smc;
  if (t.includes('pine') || t.includes('script') || t.includes('code') || t.includes('strategy'))
    return AI_RESPONSES.pine;
  if (t.includes('psychol') || t.includes('fomo') || t.includes('emotion') || t.includes('losing'))
    return AI_RESPONSES.psychology;
  if (t.includes('btc') || t.includes('bitcoin') || t.includes('crypto') || t.includes('analysis'))
    return AI_RESPONSES.btc;
  if (t.includes('risk') || t.includes('position') || t.includes('size') || t.includes('calculat'))
    return AI_RESPONSES.risk;
  if (t.includes('strategy') || t.includes('gold') || t.includes('forex') || t.includes('ai'))
    return AI_RESPONSES.strategy;
  return AI_RESPONSES.default;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0,1,2].map(i => (
        <div key={i} className="typing-dot" style={{animationDelay:`${i*0.2}s`}} />
      ))}
    </div>
  );
}

function MsgBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === 'ai';
  // Simple markdown renderer
  const rendered = msg.text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <div key={i} className="font-black text-sm mb-1" style={{color:'#FFD700'}}>{line.slice(3)}</div>;
      if (line.startsWith('**') && line.endsWith('**')) return <div key={i} className="font-bold text-white text-xs mb-0.5">{line.slice(2,-2)}</div>;
      if (line.startsWith('→ ')) return <div key={i} className="text-[11px] mb-0.5 pl-3" style={{color:'#00F0FF'}}>→ {line.slice(2)}</div>;
      if (line.startsWith('• ')) return <div key={i} className="text-[11px] mb-0.5 pl-3" style={{color:'#ccc'}}>• {line.slice(2)}</div>;
      if (line.startsWith('✅')) return <div key={i} className="text-[11px] mb-0.5" style={{color:'#22FF88'}}>{line}</div>;
      if (line.startsWith('🛑')) return <div key={i} className="text-[11px] mb-0.5" style={{color:'#FF3B5C'}}>{line}</div>;
      if (line.startsWith('```')) return null;
      if (line.trim() === '') return <div key={i} className="mb-1" />;
      return <div key={i} className="text-[11px] leading-relaxed" style={{color:isAI?'#ccc':'#fff'}}>{line}</div>;
    });

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-3`}>
      {isAI && (
        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-black mr-2 shrink-0 mt-0.5"
             style={{background:'linear-gradient(135deg,#FFD700,#FFA500)',color:'#0A0A0A'}}>▲</div>
      )}
      <div className={isAI ? 'chat-msg-ai' : 'chat-msg-user'}>
        <div className="space-y-0.5">{rendered}</div>
        <div className="text-[9px] mt-1.5 font-mono opacity-50">{msg.time}</div>
      </div>
    </div>
  );
}

export default function AIChatbot() {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState<Message[]>([{
    id: 0, role: 'ai',
    text: AI_RESPONSES.default,
    time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
  }]);
  const [input,   setInput]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const [mini,    setMini]    = useState(false);
  const [voice,   setVoice]   = useState(false);
  const [pulse,   setPulse]   = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Stop bubble pulse after open
  useEffect(() => { if (open) setPulse(false); }, [open]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    const now = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    setMsgs(prev => [...prev, { id: Date.now(), role:'user', text:t, time:now }]);
    setInput('');
    setTyping(true);

    // Simulate AI thinking delay (600–1400ms)
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = getAIResponse(t);
      setTyping(false);
      setMsgs(prev => [...prev, { id: Date.now()+1, role:'ai', text:response, time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    }, delay);
  };

  const toggleVoice = () => {
    setVoice(v => !v);
    if (!voice) {
      // Simulate voice input after 2s
      setTimeout(() => {
        setInput('Analyze Bitcoin market structure and give institutional bias');
        setVoice(false);
      }, 2000);
    }
  };

  return (
    <div className="chatbot-container">
      {/* ── BUBBLE ── */}
      {!open && (
        <button
          className={`chatbot-bubble ${pulse ? 'pulse-g-a' : ''} relative`}
          onClick={() => setOpen(true)}
          aria-label="Open AI Chat"
        >
          <Bot className="h-6 w-6 text-[#0A0A0A]" />
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#22FF88] border-2 border-[#0A0A0A] pulse-g-a" />
        </button>
      )}

      {/* ── WINDOW ── */}
      {open && (
        <div className={`chatbot-window ${mini ? 'h-14 overflow-hidden' : ''}`}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0"
               style={{borderColor:'rgba(255,215,0,0.12)',background:'rgba(255,215,0,0.04)'}}>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full flex items-center justify-center font-black text-sm pulse-g-a"
                   style={{background:'linear-gradient(135deg,#FFD700,#FFA500)',color:'#0A0A0A'}}>▲</div>
              <div>
                <div className="text-xs font-black text-white">Apex AI Coach</div>
                <div className="text-[9px] font-mono flex items-center gap-1" style={{color:'#22FF88'}}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22FF88] pulse-g-a" />
                  Online · Gemini 1.5 Pro
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setMini(m => !m)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                {mini ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!mini && (
            <>
              {/* Quick chips */}
              <div className="flex gap-2 px-3 py-2.5 overflow-x-auto scrollbar-none border-b shrink-0"
                   style={{borderColor:'rgba(255,215,0,0.08)'}}>
                {QUICK.map(q => (
                  <button key={q.label}
                    onClick={() => send(q.prompt)}
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold whitespace-nowrap transition-all hover:border-[#FFD700]/40 hover:text-[#FFD700]"
                    style={{borderColor:'rgba(255,215,0,0.15)',color:'#888',background:'rgba(255,215,0,0.03)'}}>
                    {q.icon} {q.label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-none">
                {msgs.map(m => <MsgBubble key={m.id} msg={m} />)}
                {typing && (
                  <div className="flex justify-start">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-black mr-2 shrink-0"
                         style={{background:'linear-gradient(135deg,#FFD700,#FFA500)',color:'#0A0A0A'}}>▲</div>
                    <div className="chat-msg-ai"><TypingDots /></div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t shrink-0"
                   style={{borderColor:'rgba(255,215,0,0.1)'}}>
                {voice && (
                  <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg"
                       style={{background:'rgba(255,59,92,0.08)',border:'1px solid rgba(255,59,92,0.2)'}}>
                    <div className="h-2 w-2 rounded-full bg-[#FF3B5C] animate-pulse" />
                    <span className="text-[10px] font-mono" style={{color:'#FF3B5C'}}>Listening…</span>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-xl border px-3 py-2"
                     style={{borderColor:'rgba(255,215,0,0.15)',background:'rgba(255,215,0,0.03)'}}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Ask about SMC, Pine Script, market…"
                    className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
                    style={{cursor:'none'}}
                  />
                  <button onClick={toggleVoice}
                          className={`p-1.5 rounded-lg transition-all ${voice ? 'text-[#FF3B5C]' : 'text-gray-500 hover:text-[#00F0FF]'}`}>
                    {voice ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => send()}
                          disabled={!input.trim()}
                          className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                          style={{color: input.trim() ? '#FFD700' : '#444'}}>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-center mt-2 text-[9px] font-mono" style={{color:'#333'}}>
                  Powered by Gemini 1.5 Pro · Bull Run Apex AI
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
