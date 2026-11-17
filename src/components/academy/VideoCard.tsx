import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Play, ThumbsUp } from 'lucide-react';
import { AcademyVideo, useData } from '../../context/DataContext';
import { youtubeThumbnail } from '../../lib/youtube';
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

  const likesCount = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < video.title.length; i++) {
      hash = (hash * 31 + video.title.charCodeAt(i)) % 1000;
    }
    return 35 + (hash % 160);
  }, [video.title]);

  return (
    <div
      style={style}
      className={`group flex flex-col focus-within:ring-2 focus-within:ring-black rounded-2xl ${className}`}
    >
      {/* 1. Thumbnail Banner with Duration on bottom-left */}
      <Link
        to={`/tutorial/${video.id}`}
        state={fromAcademy ? { fromAcademy: true } : undefined}
        className="relative aspect-video overflow-hidden rounded-2xl bg-black block focus:outline-none"
      >
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
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[11px] font-semibold leading-none tracking-tight">
            {video.duration}
          </span>
        )}
      </Link>

      {/* 2. Video Title directly under banner */}
      <div className="mt-3">
        <Link
          to={`/tutorial/${video.id}`}
          state={fromAcademy ? { fromAcademy: true } : undefined}
          className="block focus:outline-none"
        >
          <h3
            className="text-sm font-semibold text-zinc-950 line-clamp-2 leading-snug h-[38px] group-hover:text-black transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>
        </Link>
      </div>

      {/* 3. Program row & Metadata: Big square logo, Name on top, Version • Date under it, Likes on right */}
      <div className="mt-2.5 flex items-center justify-between gap-2.5 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Square Program Logo: Direct image, square frame, no extra outer padding/border box */}
          <Link
            to={program ? `/app/${program.slug}` : `/tutorial/${video.id}`}
            className="shrink-0 hover:opacity-85 transition-opacity"
            title={program?.name}
          >
            {program ? (
              <AssetImage
                src={programLogo}
                alt={program.name}
                className="w-9 h-9 shrink-0 object-contain rounded-none"
                fallback={<Boxes className="w-9 h-9 text-zinc-800" />}
              />
            ) : (
              <div className="w-9 h-9 bg-zinc-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                S
              </div>
            )}
          </Link>

          {/* Program Name (Line 1) and Version • Date (Line 2) */}
          <div className="min-w-0 flex-1">
            <Link
              to={program ? `/app/${program.slug}` : `/tutorial/${video.id}`}
              className="text-xs font-semibold text-zinc-950 hover:text-black truncate block leading-tight"
            >
              {program ? program.name : 'STRATA Engineering'}
            </Link>

            <div className="text-[11px] text-zinc-500 truncate mt-1 flex items-center gap-1.5 leading-tight">
              {program?.version && <span>v{program.version}</span>}
              {program?.version && releaseDate && <span>•</span>}
              {releaseDate && <span>{releaseDate}</span>}
            </div>
          </div>
        </div>

        {/* Right: Likes */}
        <div className="shrink-0 flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
          <ThumbsUp className="w-3.5 h-3.5 text-zinc-400" />
          <span>{likesCount}</span>
        </div>
      </div>
    </div>
  );
};
