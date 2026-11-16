import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AssetImage } from '../components/AssetImage';
import { ProgramCard } from '../components/toolbox/ProgramCard';

export const ToolboxCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { toolboxCategories, getToolboxCategory, loading } = useData();
  const category = categorySlug ? getToolboxCategory(categorySlug) : undefined;

  useEffect(() => {
    if (category) {
      document.title = `${category.name} — STRATA Toolbox`;
    }
    return () => {
      document.title = 'Strata ENG';
    };
  }, [category]);

  if (loading && !category) {
    return <div className="min-h-[50vh]" />;
  }

  if (!category) {
    return <Navigate to="/toolbox" replace />;
  }

  return (
    <div className="bg-white text-zinc-900 min-h-screen py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div>
          <Link
            to="/toolbox"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Toolbox</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <AssetImage
              src={category.logoUrl}
              alt={category.name}
              className="w-16 h-16 shrink-0"
              fallback={<div className="w-full h-full bg-black" aria-hidden="true" />}
            />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              {category.name}
            </h1>
          </div>

          {category.description && (
            <p className="mt-4 text-zinc-600 max-w-prose leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Category Switcher Row */}
        {toolboxCategories.length > 0 && (
          <nav
            aria-label="Switch Toolbox category"
            className="mt-8 flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1"
          >
            {toolboxCategories.map((cat) => {
              const isCurrent = cat.slug === category.slug;
              return (
                <Link
                  key={cat.id}
                  to={`/toolbox/${cat.slug}`}
                  title={cat.name}
                  aria-label={cat.name}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`shrink-0 pb-2 border-b-2 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    isCurrent
                      ? 'opacity-100 border-black'
                      : 'opacity-40 hover:opacity-100 border-transparent'
                  }`}
                >
                  <AssetImage
                    src={cat.logoUrl}
                    alt={cat.name}
                    className="w-10 h-10 shrink-0"
                    fallback={<div className="w-full h-full bg-black" aria-hidden="true" />}
                  />
                </Link>
              );
            })}
          </nav>
        )}

        {/* Program Grid */}
        <div className="mt-10">
          {category.programs.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base text-zinc-600">Programs are coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {category.programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  categorySlug={category.slug}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
