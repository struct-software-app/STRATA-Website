import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Play } from 'lucide-react';
import { AcademyVideo, useData } from '../../context/DataContext';
import { youtubeThumbnail } from '../../lib/youtube';
import { formatUsd, tokensToUsd } from '../../lib/pricing';
import { formatReleaseDate } from '../../lib/formatDate';
import { AssetImage } from '../AssetImage';

interface VideoCardProps {
  video: AcademyVideo;
  fromAcademy?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  fromAcademy = true,
  className = '',
  style,
}) => {
  const { apps, appLogos } = useData();
  const program = video.programId
    ? apps.find((a) => a.id === video.programId || a.slug === video.programId)
    : undefined;
  const programLogo = program ? appLogos[program.id] || appLogos[program.slug] : undefined;
  const releaseDate = formatReleaseDate(video.createdAt);

  return (
    <Link
      to={`/tutorial/${video.id}`}
      state={fromAcademy ? { fromAcademy: true } : undefined}
      style={style}
      className={`group flex flex-col rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${className}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <AssetImage
          src={youtubeThumbnail(video.videoId)}
          alt={video.title}
          fit="cover"
          className="w-full h-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <Play className="w-10 h-10 text-white fill-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />
        </div>
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[11px] font-semibold leading-none tracking-tight">
            {video.duration}
          </span>
        )}
      </div>

      {/* Fixed 2-line box so 1-line and 2-line video titles align all program rows horizontally */}
      <h3 className="mt-2.5 text-[13px] font-semibold text-black line-clamp-2 leading-[18px] h-[36px]">
        {video.title}
      </h3>

      {program && (
        <div className="mt-1.5 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <AssetImage
              src={programLogo}
              alt={program.name}
              className="w-4 h-4 shrink-0"
              fallback={<Boxes className="w-4 h-4 text-zinc-700" />}
            />
            <span className="text-xs font-medium text-zinc-700 truncate">
              {program.name}
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-black shrink-0">
            {formatUsd(tokensToUsd(program.price))}
          </span>
        </div>
      )}

      {releaseDate && (
        <div className="mt-0.5 text-[11px] text-zinc-500">
          {releaseDate}
        </div>
      )}
    </Link>
  );
};
