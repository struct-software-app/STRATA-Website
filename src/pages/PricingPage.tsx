import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQS } from '../data/apps';
import { Check, X, ChevronDown, ArrowRight, Boxes } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatUsd, tokensToUsd, normalizePeriod } from '../lib/pricing';
import { ANNUAL_DISCOUNT_PCT } from '../config';
import { AssetImage } from '../components/AssetImage';

export const PricingPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const { bundles, categories, categoryLogos, pricingPlans, pricingMatrix, faqs } = useData();
  const liveFaqs = faqs && faqs.length > 0 ? faqs : FAQS;


  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Direct Page Header + Billing Switcher */}
      <section className="pt-8 pb-6 px-4 md:px-8 bg-white border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            Plans & Pricing
          </h1>

          {/* Monthly / Annual Billing Switcher */}
          <div className="inline-flex items-center bg-zinc-100 p-1.5 rounded-full border border-zinc-200 shadow-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                Save {ANNUAL_DISCOUNT_PCT}%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Cards from Supabase */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div
            className={`grid grid-cols-1 ${
              pricingPlans.length === 2
                ? 'sm:grid-cols-2 max-w-4xl'
                : pricingPlans.length === 4
                ? 'sm:grid-cols-2 lg:grid-cols-4 max-w-7xl'
                : pricingPlans.length >= 5
                ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-[1400px]'
                : 'sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'
            } gap-6 mx-auto items-stretch`}
          >
            {pricingPlans.map((plan) => {

              const annualTotal = plan.annualPrice ?? Math.round(plan.price * 12 * (1 - ANNUAL_DISCOUNT_PCT / 100));
              const displayPrice = isAnnual ? annualTotal : plan.price;
              const periodLabel = isAnnual ? 'year' : normalizePeriod(plan.period);
              const frameText = plan.badge || (plan.popular ? 'Most Popular' : plan.highlight ? 'Best Value' : '');

              return (
                <div
                  key={plan.id}
                  className={`bg-white border rounded-2xl p-8 flex flex-col justify-between relative transition-all ${
                    plan.highlight
                      ? 'border-zinc-900 shadow-xl md:-translate-y-2 ring-1 ring-zinc-900'
                      : 'border-zinc-200 shadow-xs hover:shadow-md hover:border-zinc-300'
                  }`}
                >
                  <div>
                    {frameText && (
                      <div className="text-xs font-semibold text-black uppercase tracking-wider mb-1">
                        {frameText}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-zinc-950 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-6 min-h-[36px]">
                      {plan.description}
                    </p>

                    <div className="mb-6 border-b border-zinc-100 pb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">{formatUsd(displayPrice)}</span>
                        <span className="text-xs text-zinc-500 ml-2">/ {periodLabel}</span>
                      </div>
                      {isAnnual && (
                        <p className="text-[11px] font-mono text-emerald-600 mt-1.5">
                          ≈ {formatUsd(Math.round(annualTotal / 12))} / month, billed annually
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 text-xs text-zinc-700 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-2.5">
                          <Check className="w-3.5 h-3.5 text-black mt-0.5 shrink-0 stroke-[2.5]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <Link
                      to="/get-started"
                      className={`w-full py-3 text-center text-xs font-medium rounded-xl transition-all block ${
                        plan.highlight
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                          : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                      }`}
                    >
                      {plan.ctaText || 'Select Plan'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Real Discipline Bundles Section (Live from Supabase) */}
      {bundles.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                Discipline Packages
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Discipline Bundles
              </h2>
              <p className="text-sm text-zinc-500 mt-2">
                One-time perpetual licenses, purchased with Tokens.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bundles.map((bundle) => {
                const matchedCategory = categories.find((c) => {
                  const bCat = (bundle.categoryId || '').toLowerCase();
                  const bName = (bundle.name || '').toLowerCase();
                  return (
                    c.slug === bCat ||
                    c.name.toLowerCase() === bName ||
                    (bCat === 'construction' && c.slug === 'construction')
                  );
                });

                const catSlug = matchedCategory ? matchedCategory.slug : bundle.categoryId;
                const logoUrl = bundle.logo || (matchedCategory ? categoryLogos[matchedCategory.slug] : '');

                return (
                  <div
                    key={bundle.id}
                    className="border border-zinc-200 p-6 bg-white rounded-2xl flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <AssetImage
                          src={logoUrl}
                          alt={bundle.name}
                          className="w-10 h-10 shrink-0"
                          fallback={<Boxes className="w-10 h-10 text-black" />}
                        />
                      </div>

                      <h3 className="text-lg font-bold tracking-tight text-black mb-1">
                        {bundle.name}
                      </h3>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                        {bundle.description}
                      </p>

                      <div className="flex items-baseline mb-6 border-b border-zinc-100 pb-4">
                        <span className="text-3xl font-bold tracking-tight text-zinc-950 font-mono">{formatUsd(tokensToUsd(bundle.price))}</span>
                        <span className="text-xs text-zinc-500 ml-1.5">/ license</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/category/${catSlug}`}
                        className="w-full py-2.5 bg-zinc-900 text-white text-center text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <span>Explore Bundle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Feature Comparison Matrix */}
      <section className={`py-20 px-4 md:px-8 ${bundles.length > 0 ? 'bg-white' : 'bg-zinc-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Detailed Specifications
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
              Feature Comparison Matrix
            </h2>
          </div>

          <div className="border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-zinc-900 text-white border-b border-zinc-900 font-medium">
                    <th className="p-4 uppercase tracking-wider text-left w-1/3">Feature Specification</th>
                    {pricingPlans.map((plan) => (
                      <th
                        key={plan.id}
                        className={`p-4 uppercase tracking-wider text-center ${
                          plan.highlight ? 'bg-zinc-950 font-bold' : ''
                        }`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {pricingMatrix.map((row, idx) => (
                    <tr key={row.id ?? idx} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="p-4 font-medium text-zinc-900">{row.feature}</td>
                      {pricingPlans.map((plan) => {
                        // Lookup value by plan.id, plan.slug, or standard fallback keys
                        let val: string | boolean | undefined = undefined;
                        if (row.values && plan.id in row.values) {
                          val = row.values[plan.id];
                        } else if (row.values && plan.slug in row.values) {
                          val = row.values[plan.slug];
                        } else if (plan.id === 'single-app' || plan.slug === 'single-app') {
                          val = row.single;
                        } else if (plan.id === 'category-bundle' || plan.slug === 'category-bundle') {
                          val = row.bundle;
                        } else if (plan.id === 'full-suite' || plan.slug === 'full-suite') {
                          val = row.full;
                        } else if (row.values) {
                          // Match by plan name or index fallback
                          const keyMatch = Object.keys(row.values).find((k) => k.toLowerCase() === plan.name.toLowerCase() || k.toLowerCase() === plan.id.toLowerCase());
                          if (keyMatch) val = row.values[keyMatch];
                        }

                        return (
                          <td
                            key={plan.id}
                            className={`p-4 text-center ${
                              plan.highlight ? 'bg-zinc-50/50 font-semibold' : ''
                            }`}
                          >
                            {typeof val === 'boolean' ? (
                              val ? (
                                <Check className="w-4 h-4 text-zinc-900 mx-auto stroke-[2.5]" />
                              ) : (
                                <X className="w-4 h-4 text-zinc-300 mx-auto" />
                              )
                            ) : val === undefined || val === null || val === '' ? (
                              <span className="text-zinc-400">—</span>
                            ) : (
                              <span className="text-zinc-700 font-medium">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Accordion */}
      <section className={`py-20 px-4 md:px-8 ${bundles.length > 0 ? 'bg-zinc-50' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Engineering Inquiries
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {liveFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="border border-zinc-200 bg-white rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left font-semibold text-sm sm:text-base text-zinc-900 flex items-center justify-between hover:bg-zinc-50/80 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 ml-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need custom enterprise quote? */}
          <div className="mt-12 p-6 border border-zinc-200 bg-white rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between">
            <div>
              <div className="font-bold text-sm text-zinc-900">Need Multi-Seat Enterprise Licensing?</div>
              <div className="text-xs text-zinc-500 mt-0.5">Custom deployment packages for large engineering offices.</div>
            </div>
            <Link
              to="/contact"
              className="mt-4 sm:mt-0 px-5 py-2.5 bg-zinc-900 text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
            >
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
