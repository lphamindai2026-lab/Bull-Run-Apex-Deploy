'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const INITIAL = [
  { symbol:'BTC/USD',  price:104520,  change: 4.82, cat:'CRYPTO'    },
  { symbol:'ETH/USD',  price:3420,    change:-1.45, cat:'CRYPTO'    },
  { symbol:'SOL/USD',  price:184.50,  change: 8.91, cat:'CRYPTO'    },
  { symbol:'XAU/USD',  price:2342.50, change: 1.62, cat:'COMMODITY' },
  { symbol:'NASDAQ',   price:18820,   change: 1.42, cat:'INDEX'     },
  { symbol:'S&P 500',  price:5430,    change: 0.75, cat:'INDEX'     },
  { symbol:'EUR/USD',  price:1.0845,  change: 0.22, cat:'FOREX'     },
  { symbol:'GBP/USD',  price:1.2680,  change:-0.15, cat:'FOREX'     },
  { symbol:'BNB/USD',  price:605,     change: 3.21, cat:'CRYPTO'    },
  { symbol:'AAPL',     price:182.30,  change: 1.15, cat:'STOCK'     },
];

export default function LiveTicker() {
  const [markets, setMarkets] = useState(INITIAL);

  useEffect(() => {
    const id = setInterval(() => {
      setMarkets(prev => prev.map(m => {
        const d = (Math.random() - 0.485) * 0.1;
        const p = m.price > 1000 ? +(m.price * (1+d/100)).toFixed(1)
                : m.price > 1   ? +(m.price * (1+d/100)).toFixed(4)
                                : +(m.price * (1+d/100)).toFixed(5);
        return { ...m, price: p, change: +(m.change + d*8).toFixed(2) };
      }));
    }, 1600);
    return () => clearInterval(id);
  }, []);

  const items = [...markets, ...markets];

  return (
    <div className="w-full overflow-hidden py-3 border-b border-t"
         style={{ borderColor:'rgba(255,215,0,0.1)', background:'rgba(10,10,10,0.95)', backdropFilter:'blur(20px)' }}>
      <div className="flex gap-10 ticker-run whitespace-nowrap">
        {items.map((m, i) => {
          const up = m.change >= 0;
          const fmt = m.price > 1000 ? `$${m.price.toLocaleString('en-US',{maximumFractionDigits:1})}`
                    : m.price > 1   ? m.price.toFixed(4)
                                    : m.price.toFixed(5);
          return (
            <span key={i} className="inline-flex items-center gap-2.5 text-xs font-mono">
              <span className="font-black text-white tracking-wider">{m.symbol}</span>
              <span className="tabular" style={{color:'#CCCCCC'}}>{fmt}</span>
              <span className={`flex items-center gap-0.5 font-bold ${up ? 'text-[#22FF88]' : 'text-[#FF3B5C]'}`}>
                {up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                {up ? '+' : ''}{m.change.toFixed(2)}%
              </span>
              <span style={{color:'rgba(255,215,0,0.25)'}}>◆</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
