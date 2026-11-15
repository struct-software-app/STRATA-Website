import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check,
  Zap
} from 'lucide-react';
import { PRICING_PLANS } from '../data/apps';
import { CategoryCard } from '../components/CategoryCard';
import { AppCard } from '../components/AppCard';
import { HeroSlider } from '../components/HeroSlider';
import { useData } from '../context/DataContext';

export const HomePage: React.FC = () => {
  const { categories, apps, bundles, heroBanners, branding, appLogos } = useData();
  const featuredApps = apps.filter((app) => app.isPopular).slice(0, 6);

  const shuffledApps = React.useMemo(() => {
    return [...apps].sort(() => 0.5 - Math.random());
  }, [apps]);

  const fullSuiteBundle = bundles.find(
    (b) =>
      b.id.toLowerCase().includes('full') ||
      b.id.toLowerCase().includes('all') ||
      b.name.toLowerCase().includes('suite') ||
      b.programIds.length >= 30
  );

  return (
    <div className="bg-white text-zinc-900">
      {/* ========================================================================= */}
      {/* HERO BANNER CAROUSEL (Connected to live Supabase hero_banners) */}
      {/* ========================================================================= */}
      <HeroSlider banners={heroBanners} />



      {/* Governing Standards Section */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-4 px-4 md:px-8 text-[10px] sm:text-xs font-mono text-zinc-650">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-x-5 sm:gap-y-2 text-zinc-700 text-center">
            <span className="whitespace-nowrap font-semibold">ACI 318 / 530</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap font-semibold">AISC 360-22</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap font-semibold">EUROCODES 0–7</span>
            <span className="text-zinc-350">•</span>
            <span className="whitespace-nowrap font-semibold">AASHTO 1993/2018</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap font-semibold">ASTM & USCS</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap font-semibold">TRB HCM 6TH ED</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap font-semibold">US EPA & AWWA</span>
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Engines Row */}
      <section className="py-8 border-b border-zinc-200 bg-white overflow-hidden relative">
        <div className="relative w-full flex items-center">
          {/* Gradient Overlays for smooth fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex space-x-4 animate-scroll-left whitespace-nowrap">
            {[...shuffledApps, ...shuffledApps].map((app, idx) => {
              const logoUrl = appLogos[app.id] || appLogos[app.slug];
              return (
                <Link
                  key={`${app.id}-${idx}`}
                  to={`/app/${app.slug}`}
                  className="inline-flex items-center space-x-2.5 bg-white hover:bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-2xs px-4 py-2.5 rounded-xl transition-all cursor-pointer select-none shrink-0"
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt={app.name} className="w-5 h-5 object-cover rounded shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-700">
                      <Zap className="w-3 h-3 animate-pulse" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-zinc-900">{app.name}</span>
                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-50 px-1 py-0.2 rounded border border-zinc-100">
                    {app.categoryName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7 CATEGORIES, 35 TOOLS SECTION                                            */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Unified Catalog Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                {categories.length} Disciplines, {apps.length} Specialized Tools
              </h2>
            </div>
            <p className="text-sm text-zinc-500 mt-2 md:mt-0 max-w-sm">
              Each discipline contains purpose-built calculation engines verified against global design codes.
            </p>
          </div>

          {/* Grid of category cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}

            {/* Promo Card: Full Suite (Full-bleed logo without frames) */}
            <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-900 flex flex-col justify-between shadow-lg relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  {branding.storeIcon ? (
                    <img
                      src={branding.storeIcon}
                      alt="STRATA"
                      className="w-10 h-10 object-contain filter brightness-0 invert"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-white text-zinc-950 flex items-center justify-center font-mono font-bold text-xs rounded-md">
                      STRATA
                    </div>
                  )}
                  {/* Removed 35 Engines / Engines count text entirely */}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
                  {fullSuiteBundle ? fullSuiteBundle.name : 'Full Suite Bundle'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {fullSuiteBundle ? fullSuiteBundle.description : 'Deploy all engineering engines across your multidisciplinary consultancy with centralized licensing.'}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  to="/pricing"
                  className="text-xs font-semibold uppercase tracking-wider text-white hover:text-zinc-300 transition-colors flex items-center space-x-1"
                >
                  <span>View Suite Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED / POPULAR APPS ROW                                               */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200/80 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-200/60">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Core Engineering Engines
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                Featured Calculation Tools
              </h2>
            </div>
            <Link
              to="/get-started"
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-600 transition-colors inline-flex items-center space-x-1"
            >
              <span>Explore All {apps.length} Tools in Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHY STRATA — 4 VALUE POINTS                                               */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
              Why Engineering Consultancies Standardize on STRATA
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed font-normal">
              Built by civil engineers for civil engineers. STRATA eliminates subscription bloat and clunky web interfaces with lightning-fast, code-compliant desktop computing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value Point 1 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs mb-6 shadow-xs">
                01
              </div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                Deterministic Accuracy
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Zero approximation shortcuts. Every formula, derivative, and iteration adheres strictly to published international design codes (ACI, AISC, Eurocode, ASTM, AASHTO).
              </p>
            </div>

            {/* Value Point 2 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs mb-6 shadow-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                Sub-Second Speed
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Native desktop execution runs computational models in milliseconds. No network latency, no server loading spinners, and instant recalculations on parameter tweaks.
              </p>
            </div>

            {/* Value Point 3 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs mb-6 shadow-xs">
                03
              </div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                100% Offline Desktop
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Works seamlessly in high-security environments, on construction job sites, remote field surveys, or air-gapped defense projects without internet dependencies.
              </p>
            </div>

            {/* Value Point 4 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs mb-6 shadow-xs">
                04
              </div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                Audit-Ready Reports
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Generate formal, stamp-ready engineering calculations in PDF/A, editable Excel workbooks, DXF drawings, and LandXML datasets with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRICING TEASER                                                            */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 md:px-8 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Transparent Engineering Licensing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
              Simple, Predictable Plans
            </h2>
            <p className="text-sm text-zinc-500">
              No hidden fees. Full desktop functionality included in every license tier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white border rounded-2xl p-8 flex flex-col justify-between relative transition-all ${
                  plan.highlight 
                    ? 'border-zinc-900 shadow-lg md:-translate-y-2 ring-1 ring-zinc-900' 
                    : 'border-zinc-200 shadow-xs hover:shadow-md hover:border-zinc-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-xs">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mb-6 border-b border-zinc-100 pb-6">
                    <span className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">${plan.price}</span>
                    <span className="text-xs text-zinc-500 ml-2">/ month</span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-700 mb-8">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <div className="p-0.5 rounded bg-zinc-100 text-zinc-900 mt-0.5 shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/pricing"
                  className={`w-full py-2.5 text-center text-xs font-medium rounded-xl transition-all ${
                    plan.highlight
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/pricing"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-600 transition-colors inline-flex items-center space-x-1"
            >
              <span>View Full Feature Comparison Matrix & FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
