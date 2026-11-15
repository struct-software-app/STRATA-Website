import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { TRIAL_DAYS } from '../config';

export const AboutPage: React.FC = () => {
  const { categories, apps, categoryLogos, websiteInfo } = useData();

  const stats = [
    { label: websiteInfo.stats_calculation_engines_label || 'CALCULATION ENGINES', value: `${apps.length}+`, sub: websiteInfo.stats_calculation_engines_sub || 'Verified Solvers' },
    { label: websiteInfo.stats_civil_disciplines_label || 'CIVIL DISCIPLINES', value: `${categories.length}`, sub: websiteInfo.stats_civil_disciplines_sub || 'Unified Suite' },
    { label: websiteInfo.stats_solver_latency_label || 'SOLVER LATENCY', value: websiteInfo.stats_solver_latency_value || '< 20ms', sub: websiteInfo.stats_solver_latency_sub || 'Native C++ / TS Core' },
    { label: websiteInfo.stats_cloud_dependency_label || 'CLOUD DEPENDENCY', value: websiteInfo.stats_cloud_dependency_value || '0%', sub: websiteInfo.stats_cloud_dependency_sub || '100% Offline Ready' },
  ];

  return (
    <div className="bg-white text-zinc-900">
      {/* Header Banner */}
      <section className="border-b border-zinc-200 bg-hero-glow py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">About</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-4">
            {websiteInfo.about_title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed">
            {websiteInfo.about_description}
          </p>
        </div>
      </section>

      {/* 4-Column Stats Row */}
      <section className="border-b border-zinc-200 bg-zinc-950 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="border-l border-zinc-700 pl-6 space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight text-white">
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-500">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
              {websiteInfo.mission_title}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              {websiteInfo.mission_subtitle}
            </h2>
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 space-y-2">
              <div className="font-semibold text-zinc-900 uppercase">{websiteInfo.mission_box_title}</div>
              <p className="leading-relaxed">
                {websiteInfo.mission_box_text}
              </p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 text-sm text-zinc-600 leading-relaxed font-normal">
            <p>
              {websiteInfo.about_p1}
            </p>
            <p>
              {websiteInfo.about_p2}
            </p>
            <p>
              {websiteInfo.about_p3}
            </p>
          </div>
        </div>
      </section>

      {/* What the Suite Covers — 7 Disciplines */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Multidisciplinary Coverage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">
              {categories.length} Dedicated Engineering Disciplines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.slug} className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all">
                <div className="flex items-center justify-between">
                  {categoryLogos[cat.slug] ? (
                    <img src={categoryLogos[cat.slug]} alt={cat.name} className="w-8 h-8 object-cover rounded-md" />
                  ) : (
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-900 text-white">
                      {cat.code}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500 font-medium uppercase">
                    {apps.filter((a) => a.categorySlug === cat.slug).length} Tools
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-950 tracking-tight">
                  {cat.name}
                </h3>

                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                  {cat.detailedDescription}
                </p>

                <div className="pt-2 border-t border-zinc-100">
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-600 transition-colors flex items-center space-x-1"
                  >
                    <span>View {cat.name} Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* CTA Bar */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 rounded-2xl bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div className="space-y-1 mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold tracking-tight">
                Ready to standardize your engineering workflows?
              </h3>
              <p className="text-xs text-zinc-400">
                Download the complete {apps.length}-engine workspace or start a {TRIAL_DAYS}-day full trial.
              </p>
            </div>

            <div className="flex space-x-3">
              <Link
                to="/get-started"
                className="px-5 py-2.5 bg-white text-zinc-950 font-medium text-xs rounded-xl hover:bg-zinc-100 transition-colors shadow-xs"
              >
                Get Started
              </Link>
              <Link
                to="/download"
                className="px-5 py-2.5 border border-zinc-700 text-white font-medium text-xs rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Download Suite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
