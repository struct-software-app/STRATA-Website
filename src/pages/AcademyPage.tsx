import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, Search, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FeaturedVideo } from '../components/academy/FeaturedVideo';
import { FilterRail } from '../components/academy/FilterRail';
import { VideoCard } from '../components/academy/VideoCard';

const PAGE_SIZE = 12;

export const AcademyPage: React.FC = () => {
  const { academyVideos, apps, categories, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const selectedCategory = searchParams.get('category') ?? '';
  const selectedProgram = searchParams.get('program') ?? '';

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = 'Academy — STRATA';
    return () => {
      document.title = 'Strata ENG';
    };
  }, []);

  // Keep input synced when URL changes externally (back/forward or Clear filters)
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  // Debounce search query into URL params
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

  // Reset pagination when filters or search change
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
          (matchedApp ? video.programId === matchedApp.id || video.programId === matchedApp.slug : false);
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
      .slice(0, 4);
  }, [academyVideos]);

  const isLoadingEmpty = loading && academyVideos.length === 0;
  const hasFilterOrSearch = Boolean(trimmedQuery || selectedCategory || selectedProgram);
  const showFeatured = !hasFilterOrSearch && filteredVideos.length > 0;
  const gridVideos = showFeatured ? filteredVideos.slice(1) : filteredVideos;
  const displayedGridVideos = gridVideos.slice(0, visibleCount);
  const hasMore = gridVideos.length > visibleCount;

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Hero */}
      <section className="bg-hero-glow pt-14 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="block text-xs font-semibold uppercase tracking-widest text-black mb-3">
              STRATA Academy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
              Learn every engine, step by step.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
              Guided workflows, design checks, and submittal walkthroughs for every engineering calculation tool in the suite.
            </p>

            {/* Search Input */}
            <div className="mt-8 relative max-w-2xl">
              <Search
                className="w-5 h-5 text-zinc-400 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tutorials, engines, disciplines"
                aria-label="Search tutorials, engines, disciplines"
                className="w-full h-14 pl-12 pr-12 bg-white border border-zinc-200 rounded-2xl text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors shadow-2xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  aria-label="Clear search"
                  className="p-2 text-zinc-400 hover:text-black absolute right-3 top-1/2 -translate-y-1/2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 pt-2 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
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

          {isLoadingEmpty ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10 pt-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-2xl bg-black"
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
            <div className="space-y-14 pt-6">
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
                <div className="space-y-6">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-black">
                    Suggested for you
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {newestSuggestions.map((video) => (
                      <VideoCard key={video.id} video={video} fromAcademy />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-14">
              {showFeatured && <FeaturedVideo video={filteredVideos[0]} />}

              {displayedGridVideos.length > 0 && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
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
          )}
        </div>
      </section>
    </div>
  );
};
