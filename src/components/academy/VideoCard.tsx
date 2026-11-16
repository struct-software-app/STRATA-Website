import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { AcademyVideo, useData } from '../../context/DataContext';
import { youtubeThumbnail } from '../../lib/youtube';
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
  const { apps, appLogos, loading } = useData();
  const program = video.programId
    ? apps.find((a) => a.id === video.programId || a.slug === video.programId)
    : undefined;
  const programLogo = program ? appLogos[program.id] || appLogos[program.slug] : undefined;

  return (
    <Link
      to={`/academy/${video.id}`}
      state={fromAcademy ? { fromAcademy: true } : undefined}
      style={style}
      className={`group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${className}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
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
          <Play className="w-12 h-12 text-white fill-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />
        </div>
      </div>

      <h3 className="mt-3 font-semibold text-black line-clamp-2 leading-snug">
        {video.title}
      </h3>

      {program && (
        <div className="mt-1.5 flex items-center gap-2">
          {(loading || programLogo) && (
            <AssetImage src={programLogo} alt={program.name} className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm text-zinc-600 truncate">{program.name}</span>
        </div>
      )}
    </Link>
  );
};
