import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { youtubeEmbedUrl } from '../lib/youtube';
import { AssetImage } from '../components/AssetImage';
import { SuggestedList } from '../components/academy/SuggestedList';

const DESCRIPTION_COLLAPSE_CHARS = 280;

export const AcademyWatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    apps,
    categories,
    appLogos,
    loading,
    getAcademyVideo,
    getRelatedVideos,
  } = useData();

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const video = videoId ? getAcademyVideo(videoId) : undefined;
  const fromAcademy = Boolean(
    (location.state as { fromAcademy?: boolean } | null)?.fromAcademy
  );

  useEffect(() => {
    setIframeLoaded(false);
    setIsExpanded(false);
  }, [videoId]);

  useEffect(() => {
    if (video) {
      document.title = `${video.title} — STRATA Academy`;
    }
    return () => {
      document.title = 'Strata ENG';
    };
  }, [video]);

  const program = useMemo(() => {
    if (!video?.programId) return undefined;
    return apps.find(
      (a) => a.id === video.programId || a.slug === video.programId
    );
  }, [apps, video]);

  const category = useMemo(() => {
    const slug = video?.categoryId || program?.categorySlug;
    if (!slug) return undefined;
    return categories.find((c) => c.slug === slug);
  }, [categories, video, program]);

  const relatedVideos = useMemo(() => {
    if (!video) return [];
    return getRelatedVideos(video, 8);
  }, [video, getRelatedVideos]);

  if (loading && !video) {
    return <div className="min-h-[50vh]" />;
  }

  if (!video) {
    return <Navigate to="/academy" replace />;
  }

  const programLogo = program
    ? appLogos[program.id] || appLogos[program.slug]
    : undefined;
  const isLongDescription = video.description.length > DESCRIPTION_COLLAPSE_CHARS;
  const displayedDescription =
    isLongDescription && !isExpanded
      ? `${video.description.slice(0, DESCRIPTION_COLLAPSE_CHARS).trimEnd()}...`
      : video.description;

  const handleBack = () => {
    if (fromAcademy) {
      navigate(-1);
    } else {
      navigate('/academy');
    }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>All tutorials</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10">
          {/* Left Column: Embedded Player & Metadata */}
          <div className="min-w-0">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-elevated">
              <iframe
                key={video.id}
                src={youtubeEmbedUrl(video.videoId, { autoplay: true })}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIframeLoaded(true)}
                className={`w-full h-full border-0 transition-opacity duration-300 motion-reduce:transition-none ${
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                {video.title}
              </h1>

              {(program || category) && (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {program && (
                    <Link
                      to={`/app/${program.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      {(loading || programLogo) && (
                        <AssetImage
                          src={programLogo}
                          alt={program.name}
                          className="w-5 h-5 shrink-0"
                        />
                      )}
                      <span>{program.name}</span>
                    </Link>
                  )}

                  {category && (
                    <span className="text-sm text-zinc-600">{category.name}</span>
                  )}
                </div>
              )}

              {video.description && (
                <div className="mt-5">
                  <p className="whitespace-pre-line text-zinc-700 max-w-prose leading-relaxed">
                    {displayedDescription}
                  </p>

                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      className="mt-2 text-sm font-semibold text-black hover:opacity-75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Suggested */}
          <aside aria-label="Suggested tutorials" className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-black mb-4">
              Suggested
            </h2>
            <SuggestedList videos={relatedVideos} fromAcademy={fromAcademy} />
          </aside>
        </div>
      </div>
    </div>
  );
};
