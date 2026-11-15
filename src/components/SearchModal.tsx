import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Layers, Boxes } from 'lucide-react';
import { AppItem } from '../data/apps';
import { useData } from '../context/DataContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { apps, appLogos } = useData();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(apps.slice(0, 8));
    }
  }, [isOpen, apps]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(apps.slice(0, 8));
      return;
    }
    const q = query.toLowerCase();
    const filtered = apps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.categoryName.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.standards?.some((s) => s.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query, apps]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    navigate(`/app/${slug}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-100 bg-white">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 35 engineering tools, codes, or formulas..."
            className="w-full bg-transparent text-zinc-950 text-base font-normal placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Box */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-zinc-100">
          <div className="px-3 py-1.5 text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center justify-between">
            <span>{query ? `Search Results (${results.length})` : 'Popular Engineering Engines'}</span>
            <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 font-mono">ESC</span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-30 text-zinc-800 stroke-[1.5]" />
              <p className="font-semibold text-zinc-900 text-sm">No engineering tools found</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching for &apos;Concrete&apos;, &apos;Slope&apos;, &apos;Manning&apos;, or &apos;Traverse&apos;</p>
            </div>
          ) : (
            results.map((app) => {
              const logoUrl = appLogos[app.id] || appLogos[app.slug];
              return (
                <div
                  key={app.id}
                  onClick={() => handleSelect(app.slug)}
                  className="p-3 hover:bg-zinc-50 rounded-xl flex items-center justify-between cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    {logoUrl ? (
                      <img src={logoUrl} alt={app.name} className="w-8 h-8 object-cover rounded-md shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                        <Boxes className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                          {app.categoryName}
                        </span>
                        <h4 className="font-semibold text-sm text-zinc-900 group-hover:text-black">
                          {app.name}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                        {app.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs font-mono font-semibold text-zinc-900">
                      ${app.price}
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 flex items-center justify-between">
          <span>STRATA Suite v2.4.0 Engine Index</span>
          <span>{apps.length} Desktop Tools Available</span>
        </div>
      </div>
    </div>
  );
};
