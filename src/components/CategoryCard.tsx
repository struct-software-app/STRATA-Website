import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryItem } from '../data/apps';
import { ArrowRight, Boxes } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AssetImage } from './AssetImage';

interface CategoryCardProps {
  category: CategoryItem;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { categoryLogos } = useData();
  const catLogoUrl = categoryLogos[category.slug];

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 transition-all duration-200 relative overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <AssetImage
            src={catLogoUrl}
            alt={category.name}
            className="w-10 h-10 shrink-0"
            fallback={<Boxes className="w-10 h-10 text-black" />}
          />
          {/* Removed engines count badge */}
        </div>

        <h3 className="text-xl font-bold text-black tracking-tight mb-2">
          {category.name}
        </h3>

        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-6">
          {category.shortDescription}
        </p>
      </div>

      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
          Open Discipline
        </span>
        <div className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
