import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Monitor, ShieldCheck, HardDrive } from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const [selectedOS, setSelectedOS] = useState<'win' | 'mac' | 'linux'>('win');
  const [downloadStarted, setDownloadStarted] = useState(false);

  const osOptions = [
    {
      id: 'win',
      name: 'Windows',
      arch: '64-bit (x64 / ARM64)',
      version: 'Windows 10 / 11 / Server',
      file: 'STRATA_Suite_Setup_v2.4.0.exe',
      size: '142 MB',
      isPrimary: true,
    },
    {
      id: 'mac',
      name: 'macOS',
      arch: 'Universal (Apple Silicon & Intel)',
      version: 'macOS 12.0 Monterey or later',
      file: 'STRATA_Suite_v2.4.0.dmg',
      size: '158 MB',
      isPrimary: false,
    },
    {
      id: 'linux',
      name: 'Linux',
      arch: 'x86_64 AppImage & .deb',
      version: 'Ubuntu 20.04+, RHEL 8+, Debian 11+',
      file: 'STRATA_Suite_v2.4.0.AppImage',
      size: '136 MB',
      isPrimary: false,
    },
  ];

  const current = osOptions.find((os) => os.id === selectedOS)!;

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-zinc-200 bg-radial-[at_top_center] from-zinc-50 via-white to-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Download</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-3">
            Download STRATA Suite Desktop
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Native, standalone executable packages with embedded deterministic solvers and local project manager.
          </p>
        </div>
      </section>

      {/* Main Download Workbench */}
      <section className="py-16 px-4 md:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* OS Selector Tabs */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-4 text-center">
              Select Operating System
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {osOptions.map((os) => {
                const isSelected = selectedOS === os.id;
                return (
                  <button
                    key={os.id}
                    onClick={() => setSelectedOS(os.id as any)}
                    className={`p-5 text-left rounded-2xl border transition-all relative ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                        : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    {os.isPrimary && (
                      <span className={`absolute top-3 right-3 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        Primary
                      </span>
                    )}

                    <div className="flex items-center space-x-3 mb-2">
                      <Monitor className="w-5 h-5 stroke-[1.5]" />
                      <span className="font-bold text-base">{os.name}</span>
                    </div>

                    <div className={`text-xs font-mono ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {os.arch}
                    </div>
                    <div className={`text-[11px] mt-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {os.version}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download Action Box */}
          <div className="border border-zinc-200 p-8 rounded-2xl bg-zinc-50/60 text-center space-y-6 shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Ready for Installation
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-950 font-mono">
                {current.file}
              </h3>
              <p className="text-xs text-zinc-500">
                Package Size: {current.size} • Build Release: v2.4.0-STABLE • SHA-256 Verified
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={handleDownload}
                className="w-full py-3.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download {current.name} Build ({current.size})</span>
              </button>
            </div>

            {downloadStarted && (
              <div className="p-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 animate-in fade-in duration-200 shadow-2xs">
                ✓ Download sequence initiated. If it does not start automatically, please verify browser popup permissions.
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 pt-2">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-zinc-800" />
                <span>Code-Signed Binary</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <HardDrive className="w-4 h-4 text-zinc-800" />
                <span>No Network Installation Required</span>
              </span>
            </div>
          </div>

          {/* System Requirements Grid */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-white space-y-4 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3 flex items-center justify-between">
              <span>System Requirements & Environment Specifications</span>
              <span className="text-zinc-400 font-normal">Updated Q3 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <div className="font-semibold text-zinc-900 uppercase">Minimum Hardware</div>
                <ul className="space-y-1.5 text-zinc-600">
                  <li>• <strong>Processor:</strong> Dual-core 2.0 GHz 64-bit CPU (x86_64 or ARM64)</li>
                  <li>• <strong>Memory:</strong> 4 GB RAM</li>
                  <li>• <strong>Storage:</strong> 500 MB free solid-state storage for local binaries</li>
                  <li>• <strong>Display:</strong> 1280 × 800 minimum resolution</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-zinc-900 uppercase">Operating System Compatibility</div>
                <ul className="space-y-1.5 text-zinc-600">
                  <li>• <strong>Windows:</strong> Windows 10 (Build 19041+) / Windows 11 (64-bit)</li>
                  <li>• <strong>macOS:</strong> macOS 12 (Monterey), macOS 13 (Ventura), macOS 14+</li>
                  <li>• <strong>Linux:</strong> glibc 2.28+ (Ubuntu 20.04+, Fedora 34+, Debian 11+)</li>
                  <li>• <strong>Dependencies:</strong> Zero runtime prerequisites (bundled engine)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
