import React from 'react';
import { Link } from 'react-router-dom';
import { AcademyVideo, useData } from '../../context/DataContext';
import { youtubeThumbnail } from '../../lib/youtube';
import { AssetImage } from '../AssetImage';

interface SuggestedListProps {
  videos: AcademyVideo[];
  fromAcademy?: boolean;
}

export const SuggestedList: React.FC<SuggestedListProps> = ({
  videos,
  fromAcademy = false,
}) => {
  const { apps } = useData();

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {videos.map((v) => {
        const program = v.programId
          ? apps.find((a) => a.id === v.programId || a.slug === v.programId)
          : undefined;

        return (
          <Link
            key={v.id}
            to={`/academy/${v.id}`}
            state={fromAcademy ? { fromAcademy: true } : undefined}
            onClick={() => window.scrollTo(0, 0)}
            className="group flex items-start gap-3.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <div className="relative w-40 aspect-video shrink-0 overflow-hidden rounded-xl bg-black">
              <AssetImage
                src={youtubeThumbnail(v.videoId)}
                alt={v.title}
                fit="cover"
                className="w-full h-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-black line-clamp-2 leading-snug group-hover:underline">
                {v.title}
              </h3>
              {program && (
                <div className="mt-1 text-xs text-zinc-600 truncate">
                  {program.name}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
