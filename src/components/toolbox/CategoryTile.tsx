import React from 'react';
import { Link } from 'react-router-dom';
import { ToolboxCategory } from '../../context/DataContext';
import { AssetImage } from '../AssetImage';

interface CategoryTileProps {
  category: ToolboxCategory;
  className?: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  category,
  className = '',
}) => {
  return (
    <Link
      to={`/toolbox/${category.slug}`}
      className={`group aspect-square bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-zinc-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${className}`}
    >
      <AssetImage
        src={category.logoUrl}
        alt=""
        className="w-16 h-16 md:w-20 md:h-20 shrink-0 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        fallback={<div className="w-full h-full bg-black" aria-hidden="true" />}
      />
      <span className="mt-4 font-semibold text-black">{category.name}</span>
    </Link>
  );
};
