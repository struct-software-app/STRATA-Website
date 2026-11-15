import React from 'react';
import { Link } from 'react-router-dom';
import { AppItem } from '../data/apps';
import { ArrowRight, Boxes } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatUsd, tokensToUsd } from '../lib/pricing';
import { AssetImage } from './AssetImage';

interface AppCardProps {
  app: AppItem;
  showCategory?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ app, showCategory = true }) => {
  const { appLogos } = useData();
  const logoUrl = appLogos[app.id] || appLogos[app.slug];

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 transition-all duration-200">
      <div>
        {/* Top meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <AssetImage
              src={logoUrl}
              alt={app.name}
              className="w-9 h-9 shrink-0"
              fallback={<Boxes className="w-9 h-9 text-black" />}
            />
            {showCategory && (
              <span className="text-[11px] font-medium text-zinc-600 px-2.5 py-0.5 bg-zinc-100 rounded-full border border-zinc-200/60">
                {app.categoryName}
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-900 px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md">
            {formatUsd(tokensToUsd(app.price))}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-zinc-950 group-hover:text-black mb-3 tracking-tight">
          {app.name}
        </h3>

        {/* Standards badges */}

        <div className="flex flex-wrap gap-1.5 mb-6">
          {app.standards?.slice(0, 2).map((std, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-zinc-600 bg-zinc-50 border border-zinc-200/80 px-2 py-0.5 rounded"
            >
              {std}
            </span>
          ))}
        </div>
      </div>

      {/* Action bottom */}
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400">
          v{app.version}
        </span>
        <Link
          to={`/app/${app.slug}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-900 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
