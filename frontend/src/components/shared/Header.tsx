'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function Header() {
  const pathname = usePathname();
  const [activeNav, setActiveNav] = useState(pathname === '/' ? 'home' : pathname.replace('/', '') || 'home');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_1px_6px_rgba(15,23,42,0.03)]">
      <div className="h-16 w-full px-gutter md:px-margin flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <img alt="CivicPulse Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1X846d3k35eqtuPzI3ksBZBgmsuatplYf7WFWYM_h4CQ9S0k_6yUwv3OxFWwjbIzs3k1JV2GDlAvxoRA-gLT5iFVboFFwqvpvgYPsc_RyoM3YuBNu9NzPARAaC6kV6UJAhH0RowmMOGkuZnERI4p8pDkvgiSk39AQI3ZKfgNVDlH8G2iRraUJ4l3kVc7G4FOOYXP0NMkYeXWm6DwN2oPcnaPAhJ9SrQiTBLsgXyla-zluPTCI_cNnaWLpKk" />
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-semibold">CivicPulse</span>
              <span className="font-label-xs text-label-xs text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded-full font-medium">Resident Edition</span>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-surface-container transition-colors">
            <span className="relative flex h-2 w-2 items-center justify-center"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-on-tertiary-container"></span></span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">Jaipur, Rajasthan</span>
            <span className="material-symbols-outlined text-[15px] text-on-surface-variant">keyboard_arrow_down</span>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-surface-container-low/90 rounded-full" id="main-nav">
          {NAV_ITEMS.map((item) => {
            const href = item.path === 'home' ? '/' : `/${item.path}`;
            const isActive = activeNav === item.path;
            return (
              <Link key={item.path} href={href} onClick={() => setActiveNav(item.path)} className={`nav-link px-space-md py-1.5 rounded-full transition-all font-body-sm text-body-sm ${isActive ? 'bg-surface-container-lowest text-on-surface font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'text-on-surface-variant hover:text-on-surface'}`}>{item.label}</Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-space-sm">
          <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant"><span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span><span className="font-label-xs text-label-xs">Live • 99.4% Uptime</span></div>
          <button className="hidden md:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all" type="button"><span className="material-symbols-outlined text-[16px]">search</span><span className="font-label-xs text-label-xs text-on-surface-variant font-medium">Search metrics</span><kbd className="font-label-xs text-label-xs px-1.5 py-0.2 rounded bg-surface-container-lowest text-on-surface shadow-[0_1px_1px_rgba(0,0,0,0.04)]">⌘K</kbd></button>
          <button aria-label="Notifications" className="relative w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all" type="button"><span className="material-symbols-outlined text-[19px]">notifications</span><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span></button>
          <Link href="/login" className="flex items-center gap-space-xs pl-1 cursor-pointer group"><div className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]"><span className="material-symbols-outlined text-[18px]">person</span></div><span className="font-label-sm text-label-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors hidden sm:block">Sign In</span></Link>
        </div>
      </div>
    </header>
  );
}
