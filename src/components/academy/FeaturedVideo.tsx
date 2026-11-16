import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { AcademyVideo, useData } from '../../context/DataContext';
import { youtubeThumbnail } from '../../lib/youtube';
import { AssetImage } from '../AssetImage';

interface FeaturedVideoProps {
  video: AcademyVideo;
}

export const FeaturedVideo: React.FC<FeaturedVideoProps> = ({ video }) => {
  const { apps, appLogos, loading } = useData();
  const program = video.programId
    ? apps.find((a) => a.id === video.programId || a.slug === video.programId)
    : undefined;
  const programLogo = program ? appLogos[program.id] || appLogos[program.slug] : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <Link
        to={`/academy/${video.id}`}
        state={{ fromAcademy: true }}
        className="group relative block aspect-video overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
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
          <Play className="w-12 h-12 text-white fill-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />
        </div>
      </Link>

      <div>
        <h2 className="text-3xl font-bold text-black tracking-tight leading-tight">
          {video.title}
        </h2>

        {video.description && (
          <p className="mt-4 text-base text-zinc-600 leading-relaxed line-clamp-3">
            {video.description}
          </p>
        )}

        {program && (
          <div className="mt-5 flex items-center gap-2.5">
            {(loading || programLogo) && (
              <AssetImage src={programLogo} alt={program.name} className="w-6 h-6 shrink-0" />
            )}
            <span className="text-sm font-medium text-black">{program.name}</span>
          </div>
        )}

        <div className="mt-6">
          <Link
            to={`/academy/${video.id}`}
            state={{ fromAcademy: true }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <Play className="w-4 h-4 fill-white shrink-0" aria-hidden="true" />
            <span>Watch now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
