'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { useCity } from '@/context/CityContext';
import { useAuth } from '@/context/AuthContext';
import SearchPalette from '@/components/shared/SearchPalette';

export default function Header() {
  const pathname = usePathname();
  const { city } = useCity();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState(pathname === '/' ? 'home' : pathname.replace('/', '') || 'home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K opens the palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = (onNavigate?: () => void) => (
    <>
      {NAV_ITEMS.map((item) => {
        const href = item.path === 'home' ? '/' : `/${item.path}`;
        const isActive = activeNav === item.path || (item.path === 'home' && pathname === '/');
        return (
          <Link
            key={item.path}
            href={href}
            onClick={() => {
              setActiveNav(item.path);
              onNavigate?.();
            }}
            className={`nav-link px-space-md py-1.5 rounded-full transition-all font-body-sm text-body-sm ${
              isActive
                ? 'bg-surface-container-lowest text-on-surface font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_1px_6px_rgba(15,23,42,0.03)]">
        <div className="h-16 w-full px-gutter md:px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md min-w-0">
            {/* Mobile hamburger */}
            <button
              aria-label="Open navigation menu"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-on-surface hover:bg-surface-container transition-all shrink-0"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <div className="flex items-center gap-space-xs min-w-0">
              <img alt="CivicPulse Logo" className="h-7 w-auto object-contain shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1X846d3k35eqtuPzI3ksBZBgmsuatplYf7WFWYM_h4CQ9S0k_6yUwv3OxFWwjbIzs3k1JV2GDlAvxoRA-gLT5iFVboFFwqvpvgYPsc_RyoM3YuBNu9NzPARAaC6kV6UJAhH0RowmMOGkuZnERI4p8pDkvgiSk39AQI3ZKfgNVDlH8G2iRraUJ4l3kVc7G4FOOYXP0NMkYeXWm6DwN2oPcnaPAhJ9SrQiTBLsgXyla-zluPTCI_cNnaWLpKk" />
              <div className="flex items-center gap-space-xs min-w-0">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-semibold truncate">CivicPulse</span>
                <span className="font-label-xs text-label-xs text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded-full font-medium hidden sm:inline shrink-0">Resident Edition</span>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-surface-container transition-colors">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-on-tertiary-container"></span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">
                {city ? `${city.name}${city.state ? `, ${city.state}` : ''}` : 'Jaipur, RJ'}
              </span>
              <span className="material-symbols-outlined text-[15px] text-on-surface-variant">keyboard_arrow_down</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-surface-container-low/90 rounded-full" id="main-nav">
            {navLinks()}
          </nav>

          <div className="flex items-center gap-space-sm shrink-0">
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
              <span className="font-label-xs text-label-xs">Live • 99.4% Uptime</span>
            </div>
            <button
              className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              id="search-metrics-btn"
              onClick={() => setPaletteOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="font-label-xs text-label-xs text-on-surface-variant font-medium hidden md:inline">Search metrics</span>
              <kbd className="font-label-xs text-label-xs px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface shadow-[0_1px_1px_rgba(0,0,0,0.04)] hidden md:inline">⌘K</kbd>
            </button>
            <button
              aria-label="Notifications"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>
            {user ? (
              <div className="flex items-center gap-space-xs pl-1">
                <Link href="/complaints" className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-tertiary-fixed/30 hover:bg-tertiary-fixed/50 transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-fixed-variant">verified_user</span>
                  <span className="font-label-md text-label-md text-on-tertiary-fixed-variant font-semibold">@{user.username}</span>
                </Link>
                <button
                  className="flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all"
                  onClick={() => logout()}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span className="font-label-xs text-label-xs font-medium hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-space-xs pl-1 group">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors hidden sm:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ============ MOBILE DRAWER ============ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" style={{ background: '#00000066' }} onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 bottom-0 w-[280px] max-w-[82vw] bg-surface-container-lowest shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between h-16 px-gutter border-b border-surface-container shrink-0">
              <div className="flex items-center gap-2">
                <img alt="CivicPulse Logo" className="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1X846d3k35eqtuPzI3ksBZBgmsuatplYf7WFWYM_h4CQ9S0k_6yUwv3OxFWwjbIzs3k1JV2GDlAvxoRA-gLT5iFVboFFwqvpvgYPsc_RyoM3YuBNu9NzPARAaC6kV6UJAhH0RowmMOGkuZnERI4p8pDkvgiSk39AQI3ZKfgNVDlH8G2iRraUJ4l3kVc7G4FOOYXP0NMkYeXWm6DwN2oPcnaPAhJ9SrQiTBLsgXyla-zluPTCI_cNnaWLpKk" />
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">CivicPulse</span>
              </div>
              <button
                aria-label="Close navigation menu"
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 p-3">{navLinks(() => setMobileOpen(false))}</nav>

            {/* Drawer footer — city + search */}
            <div className="mt-auto p-3 border-t border-surface-container flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-surface-container-low">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_city</span>
                <span className="font-body-sm text-body-sm text-on-surface truncate">
                  {city ? `${city.name}${city.state ? `, ${city.state}` : ''}` : 'Jaipur, RJ'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container ml-auto"></span>
              </div>
              <button
                className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-all"
                onClick={() => {
                  setMobileOpen(false);
                  setPaletteOpen(true);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">search</span>
                <span className="font-body-sm text-body-sm">Search cities & metrics</span>
                <kbd className="font-label-xs text-label-xs px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface ml-auto">⌘K</kbd>
              </button>
            </div>
          </div>
        </div>
      )}

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
