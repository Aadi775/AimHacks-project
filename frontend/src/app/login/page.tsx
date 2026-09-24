'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      router.push('/overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <div className="w-full max-w-[1360px] mx-auto px-gutter md:px-margin py-space-xl flex flex-col lg:flex-row items-center justify-center gap-space-xl min-h-[calc(100vh-16rem)]">
        {/* Left: brand copy */}
        <div className="w-full max-w-md flex flex-col gap-space-md">
          <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-low shadow-sm self-start">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-70"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-on-tertiary-container"></span>
            </span>
            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
              CivicPulse Resident Access
            </span>
          </div>
          <h1 className="font-display text-display-mobile md:text-display text-on-surface tracking-tight font-semibold leading-tight">
            Your city dashboard, your account.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Sign in to file verified 181 complaints, subscribe to ward-level alerts, and personalize your city telemetry feed across every Indian metro.
          </p>
          <ul className="flex flex-col gap-space-sm mt-space-sm">
            {[
              { icon: 'verified_user', text: 'Verified resident reports with ticket tracking' },
              { icon: 'notifications_active', text: 'SMS + push alerts for your wards' },
              { icon: 'dataset', text: 'Open access to city telemetry exports' },
            ].map((f) => (
              <li className="flex items-center gap-space-sm" key={f.text}>
                <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-tertiary-container shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">{f.text}</span>
              </li>
            ))}
          </ul>
          <button
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors self-start mt-1"
            id="toggle-features-btn"
            onClick={() => setFeaturesOpen(!featuresOpen)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200" id="features-arrow" style={{ transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
            Advanced telemetry features
          </button>
          <div className={`flex flex-col gap-2 transition-all ${featuresOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {['Corridor congestion overlays', 'Ward-level AQI sparklines', 'Metro arrival watchlists'].map((f) => (
              <div className="flex items-center gap-2 px-space-sm py-1.5 rounded-lg bg-surface-container-low" key={f}>
                <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: auth card */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-space-lg shadow-md">
          <div className="flex items-center gap-2 mb-space-md">
            <span className="material-symbols-outlined text-[22px] text-secondary">account_circle</span>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                {mode === 'login' ? 'Resident Sign In' : 'Create Resident Account'}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {mode === 'login' ? 'Access your civic telemetry profile' : 'Join CivicPulse in under a minute'}
              </p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-full mb-space-md">
            {(['login', 'register'] as const).map((m) => (
              <button
                className={`flex-1 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                  mode === m ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                type="button"
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form className="flex flex-col gap-space-md" onSubmit={submit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold" htmlFor="resident-username">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">person</span>
                <input
                  autoComplete="username"
                  className="w-full h-11 pl-10 pr-4 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface outline-none transition-all shadow-inner"
                  id="resident-username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. aadi_jpr"
                  required
                  type="text"
                  value={username}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold" htmlFor="resident-password">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">key</span>
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full h-11 pl-10 pr-10 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface outline-none transition-all shadow-inner"
                  id="resident-password"
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? '••••••••' : 'At least 6 characters'}
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  className="absolute right-3 text-outline hover:text-on-surface flex items-center"
                  id="toggle-pw-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]" id="pw-icon">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-space-sm py-2 rounded-lg bg-error-container/40 border border-error/30">
                <span className="material-symbols-outlined text-[16px] text-error">error</span>
                <span className="font-body-sm text-body-sm text-on-error-container">{error}</span>
              </div>
            )}

            <button
              className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">{mode === 'login' ? 'login' : 'person_add'}</span>
              )}
              {busy ? 'Authenticating…' : mode === 'login' ? 'Sign In to CivicPulse' : 'Create Account & Continue'}
            </button>
          </form>

          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-md">
            By continuing you agree to share report data with your municipal 181 cell for faster resolution.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
