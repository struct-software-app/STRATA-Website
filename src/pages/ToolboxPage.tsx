import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CategoryTile } from '../components/toolbox/CategoryTile';

const TILE_WIDTH_CLASS =
  'w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]';

export const ToolboxPage: React.FC = () => {
  const { toolboxCategories, loading } = useData();

  useEffect(() => {
    document.title = 'Toolbox — STRATA';
    return () => {
      document.title = 'Strata ENG';
    };
  }, []);

  const isLoadingEmpty = loading && toolboxCategories.length === 0;

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Hero */}
      <section className="bg-hero-glow pt-14 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="block text-xs font-semibold uppercase tracking-widest text-black mb-3">
              STRATA Toolbox
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
              Everything else you work with.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
              Office, design, media and 3D tools — organised in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-24 pt-4 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {isLoadingEmpty ? (
            <div className="flex flex-wrap justify-center gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`${TILE_WIDTH_CLASS} aspect-square rounded-2xl bg-black`}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : toolboxCategories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-base text-zinc-600">Toolbox is being prepared.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {toolboxCategories.map((category) => (
                <CategoryTile
                  key={category.id}
                  category={category}
                  className={TILE_WIDTH_CLASS}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
