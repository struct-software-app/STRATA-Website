import React, { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AssetImage } from '../AssetImage';

interface FilterRailProps {
  selectedCategory: string;
  selectedProgram: string;
  hasActiveSearch: boolean;
  onSelectCategory: (slug: string) => void;
  onSelectProgram: (programId: string, categorySlug: string) => void;
  onClearFilters: () => void;
}

export const FilterRail: React.FC<FilterRailProps> = ({
  selectedCategory,
  selectedProgram,
  hasActiveSearch,
  onSelectCategory,
  onSelectProgram,
  onClearFilters,
}) => {
  const { academyVideos, categories, apps, categoryLogos, appLogos, loading } = useData();
  const programsScrollRef = useRef<HTMLDivElement | null>(null);

  const visibleCategories = useMemo(
    () =>
      categories.filter((cat) =>
        academyVideos.some((v) => v.categoryId === cat.slug)
      ),
    [categories, academyVideos]
  );

  const programsWithVideos = useMemo(
    () =>
      apps.filter((app) =>
        academyVideos.some(
          (v) => v.programId === app.id || v.programId === app.slug
        )
      ),
    [apps, academyVideos]
  );

  const visiblePrograms = useMemo(
    () =>
      selectedCategory
        ? programsWithVideos.filter((app) => app.categorySlug === selectedCategory)
        : programsWithVideos,
    [programsWithVideos, selectedCategory]
  );

  const hasActiveFilterOrSearch = Boolean(
    selectedCategory || selectedProgram || hasActiveSearch
  );

  const scrollPrograms = (direction: -1 | 1) => {
    programsScrollRef.current?.scrollBy({
      left: direction * 240,
      behavior: 'smooth',
    });
  };

  if (academyVideos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Row 1: Categories */}
      <div className="flex items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter tutorials by discipline"
          className="flex items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!selectedCategory}
            onClick={() => onSelectCategory('')}
            className={`shrink-0 pb-2.5 text-sm whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              !selectedCategory
                ? 'text-black font-semibold border-b-2 border-black'
                : 'text-zinc-500 hover:text-black border-b-2 border-transparent'
            }`}
          >
            All
          </button>

          {visibleCategories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            const catLogo = categoryLogos[cat.slug] || categoryLogos[cat.name];
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.slug)}
                className={`shrink-0 pb-2.5 inline-flex items-center gap-2 text-sm whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-zinc-500 hover:text-black border-b-2 border-transparent'
                }`}
              >
                {(loading || catLogo) && (
                  <AssetImage src={catLogo} alt="" className="w-6 h-6 shrink-0" />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {hasActiveFilterOrSearch && (
          <button
            type="button"
            onClick={onClearFilters}
            className="hidden sm:inline-block shrink-0 pb-2.5 text-xs font-medium text-zinc-600 hover:text-black underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Row 2: Programs */}
      {visiblePrograms.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollPrograms(-1)}
            aria-label="Scroll programs left"
            className="hidden md:flex p-1.5 text-zinc-500 hover:text-black shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={programsScrollRef}
            className="flex items-center gap-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1 py-1"
          >
            {visiblePrograms.map((program) => {
              const isActive =
                selectedProgram === program.id || selectedProgram === program.slug;
              const programLogo = appLogos[program.id] || appLogos[program.slug];
              return (
                <button
                  key={program.id}
                  type="button"
                  title={program.name}
                  aria-label={program.name}
                  aria-pressed={isActive}
                  onClick={() =>
                    onSelectProgram(
                      isActive ? '' : program.id,
                      program.categorySlug
                    )
                  }
                  className={`snap-start shrink-0 pb-2 border-b-2 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    isActive
                      ? 'opacity-100 border-black'
                      : 'opacity-40 hover:opacity-100 border-transparent'
                  }`}
                >
                  {(loading || programLogo) ? (
                    <AssetImage
                      src={programLogo}
                      alt={program.name}
                      className="w-12 h-12 shrink-0"
                    />
                  ) : (
                    <span className="inline-flex w-12 h-12 items-center justify-center text-[11px] font-semibold text-black text-center leading-tight line-clamp-2">
                      {program.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollPrograms(1)}
            aria-label="Scroll programs right"
            className="hidden md:flex p-1.5 text-zinc-500 hover:text-black shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {hasActiveFilterOrSearch && (
        <div className="sm:hidden">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-medium text-zinc-600 hover:text-black underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
