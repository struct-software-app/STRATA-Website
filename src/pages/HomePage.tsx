import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Boxes,
  Check,
  Zap,
  FileText,
  Palette,
  Film,
  Box,
  Layers,
  Sparkles
} from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { AppCard } from '../components/AppCard';
import { HeroSlider } from '../components/HeroSlider';
import { StandardsTicker } from '../components/StandardsTicker';
import { useData } from '../context/DataContext';
import { AssetImage } from '../components/AssetImage';
import { formatUsd, normalizePeriod } from '../lib/pricing';

export const HomePage: React.FC = () => {
  const { categories, apps, heroBanners, pricingPlans, branding, appLogos, toolboxCategories, loading } = useData();
  const [shuffleSeed] = React.useState(() => Math.floor(Math.random() * 2 ** 31));

  const featuredApps = React.useMemo(() => {
    const popular = apps.filter((app) => app.isPopular).slice(0, 6);
    if (popular.length >= 6) return popular;
    const seen = new Set(popular.map((a) => a.id));
    const result = [...popular];
    for (const app of apps) {
      if (result.length >= 6) break;
      if (!seen.has(app.id)) {
        seen.add(app.id);
        result.push(app);
      }
    }
    return result;
  }, [apps]);

  const shuffledApps = React.useMemo(() => {
    const copy = [...apps];
    let a = shuffleSeed || 1;
    const nextRand = () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(nextRand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [apps, shuffleSeed]);

  const marqueeTrackApps = React.useMemo(() => {
    const withLogos = shuffledApps.filter((app) =>
      Boolean((appLogos[app.id] || appLogos[app.slug] || '').trim())
    );
    const source = withLogos.length > 0 ? withLogos : shuffledApps;
    if (source.length === 0) return [];
    const filled = [...source];
    while (filled.length < 18) {
      filled.push(...source);
    }
    return filled;
  }, [shuffledApps, appLogos]);

  return (
    <div className="bg-white text-zinc-900">
      {/* ========================================================================= */}
      {/* HERO BANNER CAROUSEL (Connected to live Supabase hero_banners) */}
      {/* ========================================================================= */}
      <HeroSlider banners={heroBanners} toolCount={apps.length} loading={loading} />



      {/* Governing Standards Section */}
      <StandardsTicker />

      {/* Infinite Scrolling Engines Row (Formal & Compact) */}
      {(marqueeTrackApps.length > 0 || loading) && (
        <section className="py-3 bg-zinc-50/70 border-b border-zinc-200/80 overflow-hidden relative">
          <div className="relative w-full flex items-center">
            {/* Subtle edge fades matching section background */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-zinc-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-zinc-50 to-transparent z-10 pointer-events-none" />

            <div
              className="animate-scroll-left items-center whitespace-nowrap"
              style={{ '--marquee-duration': '45s' } as React.CSSProperties}
            >
              {[0, 1].map((groupIdx) => (
                <div
                  key={groupIdx}
                  aria-hidden={groupIdx === 1 ? 'true' : undefined}
                  className="flex items-center gap-7 md:gap-9 pr-7 md:pr-9 shrink-0"
                >
                  {marqueeTrackApps.length > 0
                    ? marqueeTrackApps.map((app, idx) => {
                        const logoUrl = appLogos[app.id] || appLogos[app.slug];
                        return (
                          <Link
                            key={`${groupIdx}-${app.id}-${idx}`}
                            to={`/app/${app.slug}`}
                            aria-label={groupIdx === 1 ? undefined : app.name}
                            title={app.name}
                            tabIndex={groupIdx === 1 ? -1 : undefined}
                            className="inline-flex items-center gap-2 shrink-0 select-none opacity-85 hover:opacity-100 transition-opacity"
                          >
                            <AssetImage
                              src={logoUrl}
                              alt={app.name}
                              fit="contain"
                              className="w-4 h-4 md:w-4.5 md:h-4.5 shrink-0"
                              fallback={<Boxes className="w-4 h-4 text-zinc-700" />}
                            />
                            <span className="text-[11px] md:text-xs font-medium text-zinc-800 tracking-tight whitespace-nowrap">
                              {app.name}
                            </span>
                          </Link>
                        );
                      })
                    : Array.from({ length: 18 }).map((_, idx) => (
                        <div
                          key={`${groupIdx}-skel-${idx}`}
                          aria-hidden="true"
                          className="w-4 h-4 bg-black rounded-none shrink-0"
                        />
                      ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* PART 1: ENGINEERING DISCIPLINES (7 CATEGORIES + FULL BUNDLE)              */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 md:px-8 bg-zinc-50 border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Engineering Disciplines
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                Civil & Structural Engineering Catalog
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

            {/* Promo Card: Engineering Full Bundle */}
            <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-900 flex flex-col justify-between shadow-lg relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <AssetImage
                    src={branding.storeIcon}
                    alt="STRATA"
                    className="w-10 h-10 filter brightness-0 invert"
                    fallback={<Zap className="w-10 h-10 text-white" />}
                  />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
                  Engineering Full Bundle
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Deploy all engineering engines across your multidisciplinary consultancy with centralized licensing.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  to="/pricing"
                  className="text-xs font-semibold uppercase tracking-wider text-white hover:text-zinc-300 transition-colors flex items-center space-x-1"
                >
                  <span>View Engineering Bundle</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PART 2: PRODUCTIVITY & CREATIVE SOFTWARE (4 CATEGORIES + BUNDLE)           */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 md:px-8 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Productivity & Creative
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                Professional Office & Media Applications
              </h2>
            </div>
            <p className="text-sm text-zinc-500 mt-2 md:mt-0 max-w-sm">
              Dedicated desktop applications for office productivity, vector design, video post-production, and 3D modeling.
            </p>
          </div>

          {/* Grid of 4 Toolbox categories + Full Bundle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {toolboxCategories.map((cat) => {
              const lower = cat.slug.toLowerCase();
              let icon = <Layers className="w-10 h-10 text-black shrink-0" />;
              if (lower === 'office') icon = <FileText className="w-10 h-10 text-black shrink-0" />;
              if (lower === 'design') icon = <Palette className="w-10 h-10 text-black shrink-0" />;
              if (lower === 'media') icon = <Film className="w-10 h-10 text-black shrink-0" />;
              if (lower === '3d') icon = <Box className="w-10 h-10 text-black shrink-0" />;

              return (
                <Link
                  key={cat.id}
                  to={`/toolbox/${cat.slug}`}
                  className="group bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 transition-all duration-200 relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {cat.logoUrl?.trim() ? (
                        <AssetImage src={cat.logoUrl} alt={cat.name} className="w-10 h-10 shrink-0" />
                      ) : (
                        icon
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-6">
                      {cat.description || `Specialized applications for professional ${cat.name.toLowerCase()} workflows.`}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                      Open Category
                    </span>
                    <div className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Promo Card: Productivity Full Bundle */}
            <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-900 flex flex-col justify-between shadow-lg relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
                  Productivity Full Bundle
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Access all office, vector design, video editing, and 3D modeling tools in one unified license.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  to="/pricing"
                  className="text-xs font-semibold uppercase tracking-wider text-white hover:text-zinc-300 transition-colors flex items-center space-x-1"
                >
                  <span>View Productivity Bundle</span>
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
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
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
              <span>Explore All Tools in Catalog</span>
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
      <section className="py-20 px-4 md:px-8 bg-zinc-50">
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
              <div className="font-mono font-bold text-xs text-black mb-4">
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
              <div className="font-mono font-bold text-xs text-black mb-4">
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
              <div className="font-mono font-bold text-xs text-black mb-4">
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
              <div className="font-mono font-bold text-xs text-black mb-4">
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
      <section className="py-20 px-4 md:px-8 bg-white">
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
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white border rounded-2xl p-8 flex flex-col justify-between relative transition-all ${
                  plan.highlight 
                    ? 'border-zinc-900 shadow-lg md:-translate-y-2 ring-1 ring-zinc-900' 
                    : 'border-zinc-200 shadow-xs hover:shadow-md hover:border-zinc-300'
                }`}
              >
                <div>
                  {(plan.badge || plan.popular || plan.highlight) && (
                    <div className="text-xs font-semibold text-black uppercase tracking-wider mb-1">
                      {plan.badge || (plan.popular ? 'Most Popular' : 'Best Value')}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mb-6 border-b border-zinc-100 pb-6">
                    <span className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">{formatUsd(plan.price)}</span>
                    <span className="text-xs text-zinc-500 ml-2">/ {normalizePeriod(plan.period)}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-700 mb-8">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <Check className="w-3.5 h-3.5 text-black mt-0.5 shrink-0 stroke-[2.5]" />
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
