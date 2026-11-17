import React from 'react';
import { GOVERNING_STANDARDS } from '../data/standards';

const DOUBLED_STANDARDS = [...GOVERNING_STANDARDS, ...GOVERNING_STANDARDS];

export const StandardsTicker: React.FC = () => {
  return (
    <section className="bg-white text-black font-mono text-xs md:text-sm font-semibold tracking-wide py-3 border-b border-zinc-200/80">
      {/* Desktop, tablet, and reduced-motion static centered row */}
      <div className="hidden md:flex motion-reduce:flex max-w-7xl mx-auto px-4 md:px-8 items-center justify-center flex-wrap gap-6">
        {GOVERNING_STANDARDS.map((std, idx) => (
          <React.Fragment key={std}>
            <span className="whitespace-nowrap">{std}</span>
            {idx < GOVERNING_STANDARDS.length - 1 && (
              <span className="w-1 h-1 rounded-full bg-black shrink-0" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Phone: single-line continuous left-to-right marquee */}
      <div
        className="md:hidden motion-reduce:hidden w-full overflow-hidden select-none"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
        }}
      >
        <div
          className="animate-marquee-right overflow-hidden pointer-events-none touch-none select-none whitespace-nowrap"
          style={{ '--marquee-duration': '30s' } as React.CSSProperties}
        >
          {[0, 1].map((groupIdx) => (
            <div
              key={groupIdx}
              aria-hidden={groupIdx === 1 ? 'true' : undefined}
              className="flex items-center gap-8 pr-8 shrink-0"
            >
              {DOUBLED_STANDARDS.map((std, idx) => (
                <React.Fragment key={`${groupIdx}-${idx}`}>
                  <span
                    aria-hidden={
                      groupIdx === 1 || idx >= GOVERNING_STANDARDS.length ? 'true' : undefined
                    }
                    className="whitespace-nowrap"
                  >
                    {std}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-black shrink-0" aria-hidden="true" />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
