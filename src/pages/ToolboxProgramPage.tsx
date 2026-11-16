import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AssetImage } from '../components/AssetImage';
import { ProgramCard } from '../components/toolbox/ProgramCard';

export const ToolboxProgramPage: React.FC = () => {
  const { categorySlug, programSlug } = useParams<{
    categorySlug: string;
    programSlug: string;
  }>();
  const { getToolboxCategory, getToolboxProgram, loading } = useData();

  const category = categorySlug ? getToolboxCategory(categorySlug) : undefined;
  const program =
    categorySlug && programSlug
      ? getToolboxProgram(categorySlug, programSlug)
      : undefined;

  useEffect(() => {
    if (program) {
      document.title = `${program.name} — STRATA Toolbox`;
    }
    return () => {
      document.title = 'Strata ENG';
    };
  }, [program]);

  const otherPrograms = useMemo(() => {
    if (!category || !program) return [];
    return category.programs.filter((p) => p.id !== program.id).slice(0, 4);
  }, [category, program]);

  if (loading && (!category || !program)) {
    return <div className="min-h-[50vh]" />;
  }

  if (!category) {
    return <Navigate to="/toolbox" replace />;
  }

  if (!program) {
    return <Navigate to={`/toolbox/${category.slug}`} replace />;
  }

  const websiteUrl = program.websiteUrl.trim();
  const hasSafeWebsiteUrl =
    websiteUrl.startsWith('https://') || websiteUrl.startsWith('http://');

  return (
    <div className="bg-white text-zinc-900 min-h-screen py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div>
          <Link
            to={`/toolbox/${category.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{category.name}</span>
          </Link>
        </div>

        {/* Program Header & Details */}
        <div className="mt-8 max-w-3xl">
          <AssetImage
            src={program.logoUrl}
            alt={program.name}
            className="w-24 h-24 shrink-0"
            fallback={<div className="w-full h-full bg-black" aria-hidden="true" />}
          />

          <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-black">
            {program.name}
          </h1>

          {program.shortDescription && (
            <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
              {program.shortDescription}
            </p>
          )}

          {program.fullDescription && (
            <p className="mt-6 whitespace-pre-line text-zinc-700 max-w-prose leading-relaxed">
              {program.fullDescription}
            </p>
          )}

          {hasSafeWebsiteUrl && (
            <div className="mt-8">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <span>Visit website</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        {/* More in this Category */}
        {otherPrograms.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold tracking-tight text-black mb-6">
              More in {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {otherPrograms.map((item) => (
                <ProgramCard
                  key={item.id}
                  program={item}
                  categorySlug={category.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
