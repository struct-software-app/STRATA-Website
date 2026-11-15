import React from 'react';
import { Link } from 'react-router-dom';
import { HardDrive } from 'lucide-react';
import { useData } from '../context/DataContext';
import { resolveAssetUrl } from '../lib/url';

export const Footer: React.FC = () => {
  const { branding, categories, websiteInfo } = useData();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 text-zinc-600 pt-16 pb-12 px-4 md:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-zinc-200">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 transition-opacity hover:opacity-90">
              {branding.storeIcon && branding.storeNameLogo ? (
                <div className="flex items-center space-x-2.5">
                  <img
                    src={resolveAssetUrl(branding.storeIcon)}
                    alt="Store Icon"
                    className="w-8 h-8 object-contain"
                  />
                  <img
                    src={resolveAssetUrl(branding.storeNameLogo)}
                    alt="STRATA"
                    className="h-6 object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-mono font-bold text-sm">
                    S
                  </div>
                  <span className="font-bold text-lg tracking-tight text-zinc-900">
                    STRATA SUITE
                  </span>
                </div>
              )}
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed pr-6">
              {websiteInfo.description}
            </p>

            <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-1.5 text-xs shadow-2xs">
              <div className="flex items-center space-x-2 font-semibold text-zinc-900">
                <HardDrive className="w-3.5 h-3.5 text-zinc-700" />
                <span>OFFLINE-FIRST ARCHITECTURE</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                No telemetry. No forced cloud sync. Local computing power on Windows, macOS, and Linux.
              </p>
            </div>
          </div>

          {/* Disciplines Column 1 */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5">
              Disciplines (I)
            </div>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">({cat.appsCount})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines Column 2 */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5">
              Disciplines (II)
            </div>
            <ul className="space-y-2 text-xs">
              {categories.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">({cat.appsCount})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5">
              Platform
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                  About STRATA
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                  Get Started / Trial
                </Link>
              </li>
              <li>
                <Link to="/download" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                  Download Suite
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1.5">
              System Matrix
            </div>
            <div className="text-[11px] font-mono text-zinc-500 space-y-2">
              <div className="flex justify-between border-b border-zinc-200/60 pb-1">
                <span>Version</span>
                <span className="text-zinc-900 font-medium">{websiteInfo.version}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-1">
                <span>Build Shell</span>
                <span className="text-zinc-900">{websiteInfo.build_shell}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-1">
                <span>Engines</span>
                <span className="text-zinc-900">{websiteInfo.engines}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-1">
                <span>License</span>
                <span className="text-zinc-900">{websiteInfo.license}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-sans space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span>© {new Date().getFullYear()} {websiteInfo.copyright_text || 'STRATA Technologies Inc. All rights reserved.'}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">{websiteInfo.footer_tagline || 'Deterministic Computation Standard'}</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/terms" className="hover:text-zinc-900 transition-colors">
              Terms of Engineering License
            </Link>
            <Link to="/privacy" className="hover:text-zinc-900 transition-colors">
              Privacy & Local Data Policy
            </Link>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-zinc-900 font-medium hover:underline"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
