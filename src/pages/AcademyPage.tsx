import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, Search, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FilterRail } from '../components/academy/FilterRail';
import { VideoCard } from '../components/academy/VideoCard';

const PAGE_SIZE = 18;

export const AcademyPage: React.FC = () => {
  const { academyVideos, apps, categories, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const selectedCategory = searchParams.get('category') ?? '';
  const selectedProgram = searchParams.get('program') ?? '';

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = 'Tutorial — STRATA';
    return () => {
      document.title = 'Strata ENG';
    };
  }, []);

  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    const timer = window.setTimeout(() => {
      if (trimmed === urlQuery.trim()) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (trimmed) {
            next.set('q', trimmed);
          } else {
            next.delete('q');
          }
          return next;
        },
        { replace: true }
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [searchInput, urlQuery, setSearchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [urlQuery, selectedCategory, selectedProgram]);

  const handleSelectCategory = (slug: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (slug) {
        next.set('category', slug);
      } else {
        next.delete('category');
      }
      next.delete('program');
      return next;
    });
  };

  const handleSelectProgram = (programId: string, categorySlug: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (programId) {
        next.set('program', programId);
        if (categorySlug) {
          next.set('category', categorySlug);
        }
      } else {
        next.delete('program');
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.delete('category');
      next.delete('program');
      return next;
    });
  };

  const trimmedQuery = urlQuery.trim().toLowerCase();

  const filteredVideos = useMemo(() => {
    return academyVideos.filter((video) => {
      if (selectedCategory && video.categoryId !== selectedCategory) {
        return false;
      }

      if (selectedProgram) {
        const matchedApp = apps.find(
          (a) => a.id === selectedProgram || a.slug === selectedProgram
        );
        const matchesProgram =
          video.programId === selectedProgram ||
          (matchedApp
            ? video.programId === matchedApp.id || video.programId === matchedApp.slug
            : false);
        if (!matchesProgram) {
          return false;
        }
      }

      if (trimmedQuery) {
        const matchedApp = video.programId
          ? apps.find((a) => a.id === video.programId || a.slug === video.programId)
          : undefined;
        const matchedCategory = video.categoryId
          ? categories.find((c) => c.slug === video.categoryId)
          : undefined;
        const haystack = [
          video.title,
          video.description,
          matchedApp?.name || '',
          matchedCategory?.name || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(trimmedQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [academyVideos, apps, categories, selectedCategory, selectedProgram, trimmedQuery]);

  const newestSuggestions = useMemo(() => {
    return [...academyVideos]
      .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
      .slice(0, 6);
  }, [academyVideos]);

  const isLoadingEmpty = loading && academyVideos.length === 0;
  const displayedGridVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = filteredVideos.length > visibleCount;

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Compact Video-Portal Header + Centered Pill Search + Filter Chips */}
      <section className="pt-5 pb-3 px-4 md:px-6 bg-white">
        <div className="max-w-[1800px] mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <h1 className="text-xl font-bold tracking-tight text-black shrink-0">
              Tutorial
            </h1>

            <div className="flex-1 max-w-xl sm:mx-auto w-full h-10 flex items-center border border-zinc-300 rounded-full bg-white focus-within:border-black transition-colors overflow-hidden shadow-2xs">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tutorials, engines, disciplines"
                aria-label="Search tutorials, engines, disciplines"
                className="flex-1 h-full pl-4 pr-2 bg-transparent text-sm text-black placeholder:text-zinc-400 focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  aria-label="Clear search"
                  className="p-2 text-zinc-400 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div
                className="h-full px-4 bg-zinc-50 border-l border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0"
                aria-hidden="true"
              >
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {!isLoadingEmpty && academyVideos.length > 0 && (
            <FilterRail
              selectedCategory={selectedCategory}
              selectedProgram={selectedProgram}
              hasActiveSearch={Boolean(searchInput.trim())}
              onSelectCategory={handleSelectCategory}
              onSelectProgram={handleSelectProgram}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </section>

      {/* Main 5-6 Column Video Grid */}
      <section className="pb-20 pt-3 px-4 md:px-6 bg-white">
        <div className="max-w-[1800px] mx-auto">
          {isLoadingEmpty ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-7">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-xl bg-black"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : academyVideos.length === 0 ? (
            <div className="py-20 text-center max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-black">
                New tutorials are on the way.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
                Check back soon for guided engine walkthroughs and civil workflow tutorials.
              </p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="space-y-12 pt-6">
              <div className="py-10 text-center max-w-md mx-auto">
                <p className="text-lg font-semibold text-black">
                  No tutorials match your filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-3 text-sm font-medium text-zinc-600 hover:text-black underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  Clear filters
                </button>
              </div>

              {newestSuggestions.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-black">
                    Suggested for you
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-7">
                    {newestSuggestions.map((video) => (
                      <VideoCard key={video.id} video={video} fromAcademy />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-7">
                {displayedGridVideos.map((video, idx) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    fromAcademy
                    className="animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
                    style={{ animationDelay: `${Math.min(idx, 11) * 40}ms` }}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:opacity-75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <span>Load more</span>
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
