'use client';
'use client';

import { useState } from 'react';
import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <div className="absolute -top-16 -left-12 w-64 h-64 bg-secondary-fixed/35 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 -right-16 w-72 h-72 bg-surface-container-high/60 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-xl rounded-xl p-space-md sm:p-space-lg flex flex-col relative overflow-hidden transition-all duration-300 max-w-[420px] mx-auto mt-10 mb-auto">
        <div className="flex items-center justify-between pb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span></span>
            <span className="font-label-xs text-on-tertiary-container tracking-wider uppercase font-semibold">Node SF-01 Active</span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-xs"><span className="material-symbols-outlined text-[14px]">lock</span><span>256-Bit SSL</span></div>
        </div>

        <div className="flex flex-col items-center text-center mt-space-xs mb-space-md">
          <div className="w-14 h-14 p-1 rounded-xl bg-surface-container-low shadow-sm flex items-center justify-center mb-space-sm relative group">
            <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida/AEtjO1X1LUvIl7WssA3HNhYm7RT4YiNDgstHiKpqw9A5Op9Gr4CXOBLqKWkZTuPInTR94gYIWJGzAIKjmfl5s9rlXJFW2g95UoIXQSb4RpNPZEYFfSygDrQBPViVRVoIApO8mLdP-Lnu7L42399GQugBEkblIQLzOsoW2dRTKMrROecBeGS5ekQVFmo229LFZmJx5J8Vwh9MbqjVXPfAQjo8GpgdyjmybVncClYnsmIjRTk9yRj2xGAWPBRl5kwZ" alt="CivicPulse Logo" />
          </div>
          <span className="font-label-xs text-secondary font-semibold uppercase tracking-wider mb-space-xs">Jaipur JCTSLcipal Gateway</span>
          <h1 className="font-headline-md text-headline-md text-on-surface">Welcome to CivicPulse</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mt-space-xs leading-relaxed">Sign in to access personalized neighborhood alerts, 311 tracking, and localized municipal microclimate feeds.</p>
        </div>

        <div className="flex flex-col gap-space-xs mb-space-md">
          <button className="w-full h-11 px-space-md bg-surface-container hover:bg-surface-container-high transition-colors rounded-lg flex items-center justify-between group shadow-sm text-left" type="button">
            <div className="flex items-center gap-space-sm">
              <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-on-secondary shadow-sm"><span className="material-symbols-outlined text-[16px]">account_balance</span></div>
              <div className="flex flex-col"><span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Continue with SF.gov ID</span><span className="font-label-xs text-label-xs text-on-surface-variant">Verified Resident Single Sign-On</span></div>
            </div>
            <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>
          <div className="grid grid-cols-2 gap-space-xs">
            <button className="h-10 px-space-sm bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg flex items-center justify-center gap-space-xs shadow-sm" type="button">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path></svg>
              <span className="font-label-md text-label-md text-on-surface">Google</span>
            </button>
            <button className="h-10 px-space-sm bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg flex items-center justify-center gap-space-xs shadow-sm" type="button">
              <svg className="w-4 h-4 fill-current text-on-surface" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.99 1.7-0.87 2.73 1.01.08 2.01-.52 2.57-1.23z"></path></svg>
              <span className="font-label-md text-label-md text-on-surface">Apple</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-between my-space-xs mb-space-md">
          <div className="w-full h-px bg-outline-variant/30"></div>
          <span className="absolute bg-surface-container-lowest px-space-sm font-label-xs text-label-xs text-outline tracking-wider uppercase">or sign in with municipal email</span>
        </div>

        <form className="flex flex-col gap-space-sm" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="resident-id"><span>Resident Email or JCTSLcipal ID</span><span className="font-label-xs text-outline">Ex: ID-94102</span></label>
            <div className="relative flex items-center"><span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">badge</span><input className="w-full h-11 pl-10 pr-3 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all duration-150" id="resident-id" placeholder="name@neighborhood.sf.gov" required type="text" /></div>
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between"><label className="font-label-md text-label-md text-on-surface" htmlFor="resident-password">Security Credential</label><a href="#" className="font-label-xs text-label-xs text-secondary hover:underline transition-all">Forgot password?</a></div>
            <div className="relative flex items-center"><span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">key</span><input className="w-full h-11 pl-10 pr-10 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all duration-150" id="resident-password" placeholder="••••••••••••" required type={showPassword ? 'text' : 'password'} /><button className="absolute right-3 text-outline hover:text-on-surface flex items-center" id="toggle-pw-btn" onClick={() => setShowPassword(!showPassword)} type="button"><span className="material-symbols-outlined text-[18px]" id="pw-icon">{showPassword ? 'visibility_off' : 'visibility'}</span></button></div>
          </div>
          <div className="flex items-center justify-between pt-1"><label className="flex items-center gap-2 cursor-pointer select-none"><input className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer" type="checkbox" defaultChecked /><span className="font-body-sm text-body-sm text-on-surface-variant">Remember device for 30 days</span></label><span className="font-label-xs text-label-xs text-secondary flex items-center gap-0.5"><span className="material-symbols-outlined text-[13px]">verified_user</span> SafeSession</span></div>
          <button className="mt-space-xs w-full h-11 bg-primary hover:bg-on-surface text-on-primary rounded-lg font-label-md text-label-md font-semibold transition-all duration-150 shadow-md flex items-center justify-center gap-space-sm group active:scale-[0.99]" type="submit"><span>Sign In to Resident Dashboard</span><span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span></button>
          <button className="w-full h-10 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md transition-colors shadow-sm flex items-center justify-center gap-2 text-center" id="passkey-trigger" type="button"><span className="material-symbols-outlined text-[18px] text-secondary">fingerprint</span><span>Sign in with Resident Passkey / Biometrics</span></button>
        </form>

        <div className="flex flex-col gap-2 mt-space-md pt-space-md bg-surface-container-low/50 -mx-space-md -mb-space-md sm:-mx-space-lg sm:-mb-space-lg p-space-md text-center">
          <a href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1"><span>New to Jaipur?</span><span className="font-medium text-secondary hover:underline">Register your household address →</span></a>
          <a href="#" className="font-label-xs text-label-xs text-outline hover:text-on-surface-variant transition-colors flex items-center justify-center gap-1"><span className="material-symbols-outlined text-[14px]">public</span><span>Guest access: View public telemetry without logging in →</span></a>
          <div className="mt-space-sm pt-space-xs flex flex-wrap items-center justify-center gap-x-space-md gap-y-1 font-label-xs text-outline"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px] text-on-tertiary-container">encrypted</span> End-to-end encrypted civic telemetry</span><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px] text-secondary">fact_check</span> SF OpenData Verified Resident Protocol</span></div>
        </div>

        <div className="mt-space-md w-full bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-space-md shadow-md transition-all duration-300 relative group overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed"><span className="material-symbols-outlined text-[14px]">auto_awesome</span></div><span className="font-label-md text-label-md font-semibold text-on-surface">Why authenticate with CivicPulse?</span></div>
            <button className="text-outline hover:text-on-surface flex items-center" id="toggle-features-btn" onClick={() => setFeaturesOpen(!featuresOpen)} type="button"><span className="material-symbols-outlined text-[18px] transition-transform duration-200" id="features-arrow" style={{ transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span></button>
          </div>
          <div className={`mt-space-sm space-y-2 text-left transition-all duration-300 ${featuresOpen ? 'block' : 'hidden'}`} id="features-drawer">
            {[
              { icon: 'air', color: 'text-secondary', title: 'Hyperlocal Air Quality Routing', desc: 'Block-by-block particulate sensors synced in real time.' },
              { icon: 'electric_meter', color: 'text-on-tertiary-container', title: 'District 311 Dispatch Tracking', desc: 'Receive automated notifications when municipal repairs finalize.' },
              { icon: 'bolt', color: 'text-secondary-container', title: 'JVVNL Microgrid Telemetry', desc: 'Live neighbourhood renewable load balancing & peak alerts.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-2"><span className={`material-symbols-outlined ${f.color} text-[16px] mt-0.5`}>{f.icon}</span><div className="flex flex-col"><span className="font-label-md text-label-md text-on-surface font-medium">{f.title}</span><span className="font-body-sm text-body-sm text-on-surface-variant">{f.desc}</span></div></div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <AIAssistant />
    </main>
  );
}
