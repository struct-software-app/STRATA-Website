import React from 'react';
import { Link } from 'react-router-dom';
import { AcademyVideo, useData } from '../../context/DataContext';
import { youtubeThumbnail } from '../../lib/youtube';
import { formatUsd, tokensToUsd } from '../../lib/pricing';
import { formatReleaseDate } from '../../lib/formatDate';
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
        const releaseDate = formatReleaseDate(v.createdAt);

        return (
          <Link
            key={v.id}
            to={`/tutorial/${v.id}`}
            state={fromAcademy ? { fromAcademy: true } : undefined}
            onClick={() => window.scrollTo(0, 0)}
            className="group flex items-start gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <div className="relative w-40 aspect-video shrink-0 overflow-hidden rounded-xl bg-black">
              <AssetImage
                src={youtubeThumbnail(v.videoId)}
                alt={v.title}
                fit="cover"
                className="w-full h-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {v.duration && (
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-white font-mono text-[10px] font-semibold leading-none">
                  {v.duration}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-black line-clamp-2 leading-snug group-hover:underline">
                {v.title}
              </h3>
              {program && (
                <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-700 truncate">{program.name}</span>
                  <span className="font-mono font-semibold text-black shrink-0">
                    {formatUsd(tokensToUsd(program.price))}
                  </span>
                </div>
              )}
              {releaseDate && (
                <div className="mt-0.5 text-[11px] text-zinc-500">
                  {releaseDate}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
