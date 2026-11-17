import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, FileText, Film, Layers, Palette } from 'lucide-react';
import { ToolboxProgram } from '../../context/DataContext';
import { formatUsd, tokensToUsd } from '../../lib/pricing';
import { AssetImage } from '../AssetImage';

interface ProgramCardProps {
  program: ToolboxProgram;
  categorySlug: string;
  categoryName?: string;
}

function getProgramFallbackIcon(categorySlug: string) {
  const lower = categorySlug.toLowerCase();
  if (lower === 'office') return <FileText className="w-7 h-7 text-black" />;
  if (lower === 'design') return <Palette className="w-7 h-7 text-black" />;
  if (lower === 'media') return <Film className="w-7 h-7 text-black" />;
  if (lower === '3d') return <Box className="w-7 h-7 text-black" />;
  return <Layers className="w-7 h-7 text-black" />;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  categorySlug,
  categoryName,
}) => {
  const priceValue = typeof program.price === 'number' ? program.price : 39;
  const versionValue = program.version || '1.0.0';

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 transition-all duration-200">
      <div>
        {/* Top meta matching AppCard */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <AssetImage
              src={program.logoUrl}
              alt={program.name}
              className="w-9 h-9 shrink-0"
              fallback={getProgramFallbackIcon(categorySlug)}
            />
            {categoryName && (
              <span className="text-[11px] font-medium text-black">
                {categoryName}
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-semibold text-black">
            {formatUsd(tokensToUsd(priceValue))}
          </span>
        </div>

        {/* Title & Summary */}
        <h3 className="text-lg font-bold text-black mb-2 tracking-tight">
          {program.name}
        </h3>
        {program.shortDescription && (
          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-5">
            {program.shortDescription}
          </p>
        )}
      </div>

      {/* Action bottom matching AppCard */}
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-black">
          v{versionValue}
        </span>
        <Link
          to={`/toolbox/${categorySlug}/${program.slug}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-900 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
