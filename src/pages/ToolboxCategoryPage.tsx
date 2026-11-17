import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Box, ChevronRight, FileText, Film, Layers, Palette } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AssetImage } from '../components/AssetImage';
import { ProgramCard } from '../components/toolbox/ProgramCard';

function getCategoryFallbackIcon(slug: string, sizeClass = 'w-10 h-10') {
  const lower = slug.toLowerCase();
  if (lower === 'office') return <FileText className={`${sizeClass} text-black`} />;
  if (lower === 'design') return <Palette className={`${sizeClass} text-black`} />;
  if (lower === 'media') return <Film className={`${sizeClass} text-black`} />;
  if (lower === '3d') return <Box className={`${sizeClass} text-black`} />;
  return <Layers className={`${sizeClass} text-black`} />;
}

export const ToolboxCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { toolboxCategories, getToolboxCategory, loading } = useData();
  const category = categorySlug ? getToolboxCategory(categorySlug) : undefined;

  useEffect(() => {
    if (category) {
      document.title = `${category.name} — STRATA`;
    }
    return () => {
      document.title = 'Strata ENG';
    };
  }, [category]);

  if (loading && !category) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm font-mono text-zinc-500">
        Loading category…
      </div>
    );
  }

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const otherCategories = toolboxCategories.filter((c) => c.slug !== category.slug);

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header Banner & Breadcrumb matching CategoryPage */}
      <section className="bg-zinc-50 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs font-medium text-zinc-500 mb-6">
            <Link to="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-900 font-semibold">
              {category.name}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-3">
              <AssetImage
                src={category.logoUrl}
                alt={category.name}
                className="w-12 h-12 shrink-0"
                fallback={getCategoryFallbackIcon(category.slug, 'w-12 h-12')}
              />
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">
                {category.name} Suite
              </h1>
            </div>
            {category.description && (
              <p className="text-base text-zinc-600 leading-relaxed font-normal">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Grid of Program Cards matching CategoryPage */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Included {category.name} Tools
            </h2>
          </div>

          {category.programs.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base text-zinc-600">Programs are coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  categorySlug={category.slug}
                  categoryName={category.name}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other Categories Nav Bar matching CategoryPage */}
      {otherCategories.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 mb-6">
              Explore Other Categories
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {otherCategories.map((other) => (
                <Link
                  key={other.id}
                  to={`/toolbox/${other.slug}`}
                  className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 hover:shadow-md transition-all text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <AssetImage
                    src={other.logoUrl}
                    alt={other.name}
                    className="w-10 h-10 mx-auto mb-2 shrink-0 flex items-center justify-center"
                    fallback={getCategoryFallbackIcon(other.slug, 'w-8 h-8')}
                  />
                  <div className="font-semibold text-xs text-black">
                    {other.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
