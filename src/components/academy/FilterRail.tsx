import React, { useMemo, useRef } from 'react';
import { Boxes, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const { academyVideos, categories, categoryLogos, apps, appLogos } = useData();
  const chipScrollRef = useRef<HTMLDivElement | null>(null);

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

  const scrollChips = (direction: -1 | 1) => {
    chipScrollRef.current?.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  };

  if (academyVideos.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollChips(-1)}
        aria-label="Scroll filters left"
        className="hidden md:flex p-1.5 text-zinc-500 hover:text-black rounded-full hover:bg-zinc-100 shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={chipScrollRef}
        role="tablist"
        aria-label="Filter tutorials"
        className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1 py-1"
      >
        {/* All Pill */}
        <button
          type="button"
          role="tab"
          aria-selected={!selectedCategory && !selectedProgram}
          onClick={() => onSelectCategory('')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
            !selectedCategory && !selectedProgram
              ? 'bg-zinc-950 text-white font-semibold'
              : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 font-medium'
          }`}
        >
          All
        </button>

        {/* Category Pills with Icons */}
        {visibleCategories.map((cat) => {
          const isActive = selectedCategory === cat.slug && !selectedProgram;
          const catLogoUrl = categoryLogos[cat.slug];
          return (
            <button
              key={cat.slug}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.slug}
              onClick={() =>
                onSelectCategory(selectedCategory === cat.slug ? '' : cat.slug)
              }
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isActive
                  ? 'bg-zinc-950 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 font-medium'
              }`}
            >
              <AssetImage
                src={catLogoUrl}
                alt=""
                className="w-3.5 h-3.5 shrink-0"
                fallback={
                  <Boxes
                    className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-700'}`}
                  />
                }
              />
              <span>{cat.name}</span>
            </button>
          );
        })}

        {visiblePrograms.length > 0 && (
          <div className="w-px h-4 bg-zinc-200 mx-1 shrink-0" aria-hidden="true" />
        )}

        {/* Program Pills */}
        {visiblePrograms.map((program) => {
          const isActive =
            selectedProgram === program.id || selectedProgram === program.slug;
          const programLogo = appLogos[program.id] || appLogos[program.slug];
          return (
            <button
              key={program.id}
              type="button"
              title={program.name}
              aria-pressed={isActive}
              onClick={() =>
                onSelectProgram(isActive ? '' : program.id, program.categorySlug)
              }
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isActive
                  ? 'bg-zinc-950 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 font-medium'
              }`}
            >
              <AssetImage
                src={programLogo}
                alt=""
                className="w-3.5 h-3.5 shrink-0"
                fallback={
                  <Boxes
                    className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-700'}`}
                  />
                }
              />
              <span>{program.name}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollChips(1)}
        aria-label="Scroll filters right"
        className="hidden md:flex p-1.5 text-zinc-500 hover:text-black rounded-full hover:bg-zinc-100 shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {hasActiveFilterOrSearch && (
        <button
          type="button"
          onClick={onClearFilters}
          className="shrink-0 px-2 text-xs font-medium text-zinc-600 hover:text-black underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};
