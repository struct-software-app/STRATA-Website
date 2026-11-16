import React from 'react';
import { Link } from 'react-router-dom';
import { ToolboxProgram } from '../../context/DataContext';
import { AssetImage } from '../AssetImage';

interface ProgramCardProps {
  program: ToolboxProgram;
  categorySlug: string;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  categorySlug,
}) => {
  return (
    <Link
      to={`/toolbox/${categorySlug}/${program.slug}`}
      className="group bg-white rounded-2xl border border-zinc-200 p-6 flex items-start gap-4 hover:shadow-lg hover:border-zinc-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      <AssetImage
        src={program.logoUrl}
        alt=""
        className="w-14 h-14 shrink-0"
        fallback={<div className="w-full h-full bg-black" aria-hidden="true" />}
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-black truncate group-hover:underline">
          {program.name}
        </h3>
        {program.shortDescription && (
          <p className="mt-1 text-sm text-zinc-600 line-clamp-2 leading-relaxed">
            {program.shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
};
