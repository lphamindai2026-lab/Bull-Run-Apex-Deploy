'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

// Map our internal symbols to TradingView exchange-prefixed symbols
function getTVSymbol(sym: string): string {
  const map: Record<string, string> = {
    'BTCUSD':  'BINANCE:BTCUSDT',
    'ETHUSD':  'BINANCE:ETHUSDT',
    'SOLUSD':  'BINANCE:SOLUSDT',
    'BNBUSD':  'BINANCE:BNBUSDT',
    'XRPUSD':  'BINANCE:XRPUSDT',
    'EURUSD':  'FX_IDC:EURUSD',
    'GBPUSD':  'FX_IDC:GBPUSD',
    'USDJPY':  'FX_IDC:USDJPY',
    'AUDUSD':  'FX_IDC:AUDUSD',
    'USDCAD':  'FX_IDC:USDCAD',
    'AAPL':    'NASDAQ:AAPL',
    'NVDA':    'NASDAQ:NVDA',
    'TSLA':    'NASDAQ:TSLA',
    'MSFT':    'NASDAQ:MSFT',
    'GOOGL':   'NASDAQ:GOOGL',
    'XAUUSD':  'OANDA:XAUUSD',
    'XAGUSD':  'OANDA:XAGUSD',
    'USOIL':   'TVC:USOIL',
    'SPX':     'SP:SPX',
    'NDX':     'NASDAQ:NDX',
    'DJI':     'DJ:DJI',
  };
  return map[sym] ?? `BINANCE:${sym}T`;
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef    = useRef<any>(null);
  const scriptRef    = useRef<HTMLScriptElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    setHasError(false);

    // Generate unique ID for this widget instance
    const uid = `tv_${Math.random().toString(36).slice(2, 9)}`;

    // Clear any previous widget cleanly
    container.innerHTML = '';

    // Create the inner container div that TradingView will populate
    const innerDiv       = document.createElement('div');
    innerDiv.id          = uid;
    innerDiv.style.width  = '100%';
    innerDiv.style.height = '100%';
    container.appendChild(innerDiv);

    // Timeout to detect if widget fails to load
    const timeout = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 15000);

    function initWidget() {
      try {
        // @ts-ignore — TradingView global injected by tv.js
        if (typeof TradingView === 'undefined') {
          setHasError(true);
          setIsLoading(false);
          clearTimeout(timeout);
          return;
        }

        // Destroy previous widget instance if exists
        if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
          try { widgetRef.current.remove(); } catch {}
        }

        // @ts-ignore
        widgetRef.current = new TradingView.widget({
          autosize:             true,
          symbol:               getTVSymbol(symbol),
          interval:             '60',
          timezone:             'Etc/UTC',
          theme:                'dark',
          style:                '1',
          locale:               'en',
          toolbar_bg:           '#070c18',
          backgroundColor:      'rgba(7, 12, 24, 1)',
          gridColor:            'rgba(26, 32, 53, 0.4)',
          enable_publishing:    false,
          hide_top_toolbar:     false,
          hide_side_toolbar:    false,
          withdateranges:       true,
          allow_symbol_change:  true,
          save_image:           false,
          container_id:         uid,
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
          ],
          overrides: {
            'paneProperties.background':           '#070c18',
            'paneProperties.backgroundType':       'solid',
            'paneProperties.vertGridProperties.color': 'rgba(26, 32, 53, 0.3)',
            'paneProperties.horzGridProperties.color': 'rgba(26, 32, 53, 0.3)',
            'scalesProperties.textColor':          '#94a3b8',
            'mainSeriesProperties.candleStyle.upColor':     '#10b981',
            'mainSeriesProperties.candleStyle.downColor':   '#f43f5e',
            'mainSeriesProperties.candleStyle.borderUpColor':   '#10b981',
            'mainSeriesProperties.candleStyle.borderDownColor': '#f43f5e',
            'mainSeriesProperties.candleStyle.wickUpColor':     '#10b981',
            'mainSeriesProperties.candleStyle.wickDownColor':   '#f43f5e',
          },
        });

        clearTimeout(timeout);
        setIsLoading(false);
      } catch (err) {
        console.error('TradingView widget init error:', err);
        setHasError(true);
        setIsLoading(false);
        clearTimeout(timeout);
      }
    }

    // Check if tv.js is already loaded globally
    // @ts-ignore
    if (typeof TradingView !== 'undefined') {
      initWidget();
      return () => clearTimeout(timeout);
    }

    // Load tv.js script — check if already present
    const existingScript = document.querySelector('script[data-tvjs="1"]');
    if (existingScript) {
      // Script tag exists but TradingView global may not be ready yet
      const poll = setInterval(() => {
        // @ts-ignore
        if (typeof TradingView !== 'undefined') {
          clearInterval(poll);
          initWidget();
        }
      }, 100);
      return () => {
        clearInterval(poll);
        clearTimeout(timeout);
      };
    }

    // First load — inject the script
    const script = document.createElement('script');
    script.src              = 'https://s3.tradingview.com/tv.js';
    script.type             = 'text/javascript';
    script.async            = true;
    script.dataset.tvjs     = '1'; // mark so we don't double-load
    script.onload           = initWidget;
    script.onerror          = () => {
      setHasError(true);
      setIsLoading(false);
      clearTimeout(timeout);
    };
    scriptRef.current = script;
    document.head.appendChild(script);

    return () => {
      clearTimeout(timeout);
      // Don't remove the script tag — it's cached globally
      // Just clean the container
      if (container) container.innerHTML = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center
          bg-[#070c18] border border-[var(--apex-border)] rounded-lg z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-75" />
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
          </div>
          <p className="text-xs font-mono text-slate-400">
            Loading TradingView chart…
          </p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">
            {getTVSymbol(symbol)}
          </p>
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center
          bg-[#070c18] border border-[var(--apex-border)] rounded-lg z-10 p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <p className="text-sm font-bold text-slate-200 mb-1">Chart temporarily unavailable</p>
          <p className="text-xs text-slate-500 mb-4">TradingView script could not load</p>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${getTVSymbol(symbol)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10
              border border-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-400
              hover:bg-cyan-500/20 transition-all"
          >
            Open {symbol} on TradingView ↗
          </a>
        </div>
      )}

      {/* Widget container — must have explicit dimensions */}
      <div
        ref={containerRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          minHeight:  '400px',
          height:     '100%',
          background: '#070c18',
        }}
      />
    </div>
  );
}
