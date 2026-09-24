'use client';

import { useState } from 'react';

export default function AIAssistant() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');

  const toggleAI = () => setExpanded(!expanded);

  const submitQuery = () => {
    if (!query.trim()) return;
    setStatus('Querying real-time municipal telemetry...');
    setTimeout(() => {
      setStatus('✓ Telemetry verified. High comfort indices reported citywide.');
      setTimeout(() => setStatus(''), 3500);
      setQuery('');
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full transition-all">
      {expanded ? (
        <div className="bg-surface-container-lowest/95 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center"><span className="material-symbols-outlined text-[18px] text-tertiary-fixed">smart_toy</span></div>
              <div><div className="flex items-center gap-1.5"><span className="font-label-md text-label-md font-semibold text-on-surface">CivicPulse AI</span><span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span></div><span className="font-label-xs text-label-xs text-on-surface-variant">Live City Digest Explainer</span></div>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-all" onClick={toggleAI} type="button"><span className="material-symbols-outlined text-[20px]">close</span></button>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-3.5 space-y-2 text-balance">
            <div className="flex items-center gap-1.5 text-on-tertiary-container font-label-xs text-label-xs font-semibold"><span className="material-symbols-outlined text-[14px]">auto_awesome</span><span>Today&apos;s Executive Summary</span></div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">Jaipur is operating at an optimal <strong className="font-semibold text-on-surface">88/100 civic health</strong> today. The morning desert haze cleared 45 minutes earlier than yesterday, while Jaipur Metro &amp; JCTSL report 94% on-time frequency with nominal headways.</p>
          </div>
          <div className="space-y-1.5">
            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider font-semibold">Explore Subsystems</span>
            <div className="grid grid-cols-3 gap-1.5">
              <a href="/overview" className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-center transition-all"><span className="font-label-xs text-label-xs text-on-surface font-medium block">Overview</span><span className="text-[10px] text-on-surface-variant font-mono">88 Score</span></a>
              <a href="/weather" className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-center transition-all"><span className="font-label-xs text-label-xs text-on-surface font-medium block">Weather</span><span className="text-[10px] text-secondary font-mono">AQI 24</span></a>
              <a href="/transit" className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-center transition-all"><span className="font-label-xs text-label-xs text-on-surface font-medium block">Transit</span><span className="text-[10px] text-on-tertiary-container font-mono">94% Nominal</span></a>
            </div>
          </div>
          <div className="relative flex items-center">
            <input className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-surface-container text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary" id="ai-query-input" placeholder="Ask anything about today&apos;s city metrics..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitQuery()} />
            <button className="absolute right-2 p-1 text-on-surface hover:text-secondary transition-colors" onClick={submitQuery} type="button"><span className="material-symbols-outlined text-[18px]">send</span></button>
          </div>
          {status && <div className="text-center font-label-xs text-label-xs text-secondary animate-pulse" id="ai-response-status">{status}</div>}
        </div>
      ) : (
        <button className="hidden ml-auto items-center gap-2 px-4 py-3 rounded-full bg-primary text-on-primary shadow-xl hover:bg-primary-container transition-all" id="ai-assistant-trigger" onClick={toggleAI} type="button"><span className="material-symbols-outlined text-[20px] text-tertiary-fixed">smart_toy</span><span className="font-label-md text-label-md font-semibold">CivicPulse AI</span><span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span></button>
      )}
    </div>
  );
}
