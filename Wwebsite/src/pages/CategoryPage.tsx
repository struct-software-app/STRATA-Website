import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { AppCard } from '../components/AppCard';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { categories, apps, getCategoryBySlug, getBundleByCategoryId, categoryLogos } = useData();

  const category = getCategoryBySlug(categorySlug || '');

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const categoryApps = apps.filter((app) => app.categorySlug === category.slug);
  const matchingBundle = getBundleByCategoryId(category.slug);
  const catLogoUrl = categoryLogos[category.slug];

  const bundleName = matchingBundle ? `${matchingBundle.name} Bundle` : `${category.name} Suite Bundle`;
  const bundlePrice = matchingBundle ? matchingBundle.price : 99.99;
  const bundleDescription = matchingBundle ? matchingBundle.description : 'All individual tools included in this discipline.';

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header Banner & Breadcrumb */}
      <section className="border-b border-zinc-200 bg-zinc-50/50 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-zinc-500 mb-6">
            <Link to="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-900 font-semibold">
              {category.name}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700 font-mono text-xs font-semibold mb-4 shadow-2xs">
                <span>CODE: {category.code}</span>
                <span>•</span>
                <span>{categoryApps.length} ENGINES</span>
              </div>
              <div className="flex items-center space-x-4 mb-3">
                {catLogoUrl && (
                  <img src={catLogoUrl} alt={category.name} className="w-12 h-12 object-cover rounded-lg" />
                )}
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">
                  {category.name} Suite
                </h1>
              </div>
              <p className="text-base text-zinc-600 leading-relaxed font-normal">
                {category.detailedDescription}
              </p>
            </div>

            {/* Category Bundle Action (Live from Supabase) */}
            <div className="shrink-0 p-6 rounded-2xl border border-zinc-200 bg-white shadow-xs max-w-sm w-full">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                {bundleName}
              </div>
              <div className="text-3xl font-bold tracking-tight text-zinc-950 font-mono mb-1">
                ${bundlePrice} <span className="text-xs font-normal text-zinc-500">/ license</span>
              </div>
              <div className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
                {bundleDescription}
              </div>
              <Link
                to="/pricing"
                className="w-full block text-center py-2.5 bg-zinc-900 text-white text-xs font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-xs"
              >
                Explore Bundle Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of App Cards */}
      <section className="py-16 px-4 md:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Included Calculation Engines ({categoryApps.length})
            </h2>
            <span className="text-xs font-medium text-zinc-500">
              Verified Against International Codes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryApps.map((app) => (
              <AppCard key={app.id} app={app} showCategory={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Disciplines Nav Bar */}
      <section className="py-16 px-4 md:px-8 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-bold tracking-tight text-zinc-950 mb-6">
            Explore Other Engineering Disciplines
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.filter((c) => c.slug !== category.slug).map((other) => (
              <Link
                key={other.slug}
                to={`/category/${other.slug}`}
                className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 hover:shadow-md transition-all text-center group"
              >
                <div className="font-mono text-xs font-semibold text-zinc-400 group-hover:text-zinc-600">
                  {other.code}
                </div>
                <div className="font-semibold text-xs text-zinc-900 mt-1">
                  {other.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
