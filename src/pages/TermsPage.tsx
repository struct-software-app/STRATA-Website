import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const TERMS_SECTIONS = [
  'Acceptance',
  'Licenses',
  'Tokens and Payments',
  'Acceptable Use',
  'Warranty and Liability',
  'Termination',
  'Contact',
];

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-zinc-200 bg-hero-glow py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Terms of Engineering License</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-4">
            Terms of Engineering License
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm font-medium flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>DRAFT — placeholder text. Replace with content approved by legal counsel before launch.</span>
          </div>

          <div className="space-y-8">
            {TERMS_SECTIONS.map((heading, idx) => (
              <div key={heading} className="border-b border-zinc-100 pb-6 space-y-2">
                <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                  {idx + 1}. {heading}
                </h2>
                <p className="text-sm text-zinc-500 font-mono">[To be provided]</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
