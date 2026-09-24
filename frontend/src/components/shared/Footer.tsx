'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-auto">
      <div className="max-w-[1360px] mx-auto px-gutter md:px-margin py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
            <span className="font-body-sm text-body-sm text-on-surface">Municipal Telemetry Feeds Active</span>
          </div>
          <span className="text-on-surface-variant font-label-xs text-label-xs">•</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Atmospheric Sensor Cluster JP-09</span>
        </div>
        <div className="flex items-center gap-space-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">© 2025 CivicPulse Environmental Intelligence Platform.</span>
          <div className="flex items-center gap-space-md">
            <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Status</a>
            <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Advisories</a>
            <a href="/login" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Access</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
