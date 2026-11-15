import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { AppCard } from '../components/AppCard';
import { useData } from '../context/DataContext';
import { AssetImage } from '../components/AssetImage';
import { formatUsd, tokensToUsd } from '../lib/pricing';
import { TRIAL_DAYS } from '../config';
import { 
  ChevronRight, 
  ChevronLeft,
  Check, 
  ShieldCheck, 
  HardDrive, 
  FileCode, 
  ArrowRight, 
  Play, 
  Image as ImageIcon,
  Boxes,
  AlertCircle
} from 'lucide-react';

function getTrailerEmbedDetails(url: string | undefined | null) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytMatch = trimmed.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return {
      type: 'youtube' as const,
      src: `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0`
    };
  }

  return { type: 'video' as const, src: trimmed };
}

export const AppDetailPage: React.FC = () => {
  const { appSlug } = useParams<{ appSlug: string }>();
  const { apps, getAppBySlug, appLogos, isOwned, purchaseItem, user, branding, loading } = useData();
  const navigate = useNavigate();

  const appData = getAppBySlug(appSlug || '');

  const [purchasing, setPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const trailerUrl = appData?.trailerUrl ?? '';
  const trailerEmbed = getTrailerEmbedDetails(trailerUrl);

  const rawScreenshots = (Array.isArray((appData as any)?.screenshots) && (appData as any).screenshots.length > 0)
    ? (appData as any).screenshots.filter(Boolean)
    : (appData?.banner ? [appData.banner] : []);

  const screenshotsList: string[] = rawScreenshots;
  const coverImage = screenshotsList[0] || appData?.banner || '';

  // Active view: 'trailer' | screenshot index
  const [activeMedia, setActiveMedia] = useState<'trailer' | number>(trailerUrl ? 'trailer' : 0);

  // Update activeMedia when navigating between apps
  useEffect(() => {
    setActiveMedia(trailerUrl ? 'trailer' : 0);
  }, [appSlug, trailerUrl]);

  // Media gallery thumbnail strip
  const galleryItems = [
    ...(trailerUrl
      ? [
          {
            type: 'trailer' as const,
            id: 'trailer',
            thumb: appData?.trailerThumbnail || coverImage,
          },
        ]
      : []),
    ...screenshotsList.map((url, idx) => ({
      type: 'image' as const,
      id: `img-${idx}`,
      thumb: url,
      index: idx,
    })),
  ];

  // Gallery horizontal scroll state
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    if (galleryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [galleryItems.length]);

  if (!appData) {
    if (loading) {
      return <div className="min-h-[50vh]" />;
    }
    return <Navigate to="/" replace />;
  }

  const owned = isOwned(appData.id);

  const handleScrollLeft = () => {
    galleryScrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
    setTimeout(updateScrollState, 300);
  };

  const handleScrollRight = () => {
    galleryScrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
    setTimeout(updateScrollState, 300);
  };

  const handleBuy = async () => {
    if (!user) {
      navigate('/get-started');
      return;
    }
    setPurchasing(true);
    setPurchaseError(null);
    setPurchaseStatus(null);

    const res = await purchaseItem(appData.id);
    setPurchasing(false);
    if (!res.success) {
      setPurchaseError(res.error || 'Failed to complete purchase.');
    } else {
      setPurchaseStatus('License unlocked successfully! Added to your desktop workstations.');
    }
  };

  const logoUrl = appLogos[appData.id] || appLogos[appData.slug];
  const relatedApps = apps.filter(
    (a) => a.categorySlug === appData.categorySlug && a.id !== appData.id
  ).slice(0, 3);

  return (
    <div className="bg-white text-zinc-900">
      {/* Top Breadcrumb Header */}
      <section className="border-b border-zinc-200 bg-zinc-50/70 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-500 uppercase tracking-wider overflow-x-auto">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <Link to={`/category/${appData.categorySlug}`} className="hover:text-zinc-900 transition-colors whitespace-nowrap">
              {appData.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-900 font-semibold whitespace-nowrap">{appData.name}</span>
          </div>

          {/* Engine Version & Discipline Pill */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-zinc-200/80 text-zinc-800">
              v{appData.version}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-900 text-white uppercase tracking-wider">
              {appData.categoryName}
            </span>
          </div>
        </div>
      </section>

      {/* Main Product Layout */}
      <section className="py-12 px-4 md:px-8 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Media Viewer + Thumbnail Strip + About Overview              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Large Main Preview Container */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-zinc-200 relative">
              {activeMedia === 'trailer' && trailerEmbed ? (
                trailerEmbed.type === 'youtube' ? (
                  <iframe
                    src={trailerEmbed.src}
                    title={`${appData.name} Trailer`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={trailerEmbed.src}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <AssetImage
                  src={
                    typeof activeMedia === 'number' && screenshotsList[activeMedia]
                      ? screenshotsList[activeMedia]
                      : coverImage
                  }
                  alt={
                    typeof activeMedia === 'number' && screenshotsList[activeMedia]
                      ? `${appData.name} screenshot ${activeMedia + 1}`
                      : appData.name
                  }
                  className="w-full h-full"
                  fit="cover"
                  fallback={
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-xs font-mono text-zinc-500">
                      [ No media available ]
                    </div>
                  }
                />
              )}
            </div>

            {/* 2. Media Thumbnails Strip */}
            {galleryItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Media Gallery ({galleryItems.length})
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={handleScrollLeft}
                      disabled={!canScrollLeft}
                      className={`p-1.5 border rounded-lg transition-all ${
                        canScrollLeft
                          ? 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 cursor-pointer shadow-2xs'
                          : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                      }`}
                      title="Scroll Left"
                      aria-label="Scroll gallery left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleScrollRight}
                      disabled={!canScrollRight}
                      className={`p-1.5 border rounded-lg transition-all ${
                        canScrollRight
                          ? 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 cursor-pointer shadow-2xs'
                          : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                      }`}
                      title="Scroll Right"
                      aria-label="Scroll gallery right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  ref={galleryScrollRef}
                  className="flex items-center gap-3 overflow-x-auto py-2 px-1 scroll-smooth select-none"
                >
                  {galleryItems.map((item) => {
                    const isActive = item.type === 'trailer' ? activeMedia === 'trailer' : activeMedia === item.index;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveMedia(item.type === 'trailer' ? 'trailer' : (item.index ?? 0))}
                        aria-label={
                          item.type === 'trailer'
                            ? `Play ${appData.name} trailer`
                            : `View ${appData.name} screenshot ${(item.index ?? 0) + 1}`
                        }
                        className={`flex-shrink-0 w-36 h-20 rounded-xl relative overflow-hidden text-left transition-all cursor-pointer ${
                          isActive
                            ? 'border-2 border-zinc-900 shadow-md'
                            : 'border border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <AssetImage
                          src={item.thumb}
                          alt={
                            item.type === 'trailer'
                              ? `${appData.name} trailer thumbnail`
                              : `${appData.name} thumbnail ${(item.index ?? 0) + 1}`
                          }
                          className="w-full h-full"
                          fit="cover"
                          fallback={
                            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          }
                        />

                        <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />

                        <div className="absolute bottom-1.5 right-1.5 bg-zinc-950/80 backdrop-blur-xs text-white p-1 rounded-md">
                          {item.type === 'trailer' ? (
                            <Play className="w-3 h-3 fill-current" />
                          ) : (
                            <ImageIcon className="w-3 h-3" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Detailed Scope & About */}
            <div className="border border-zinc-200 rounded-2xl p-8 bg-white shadow-2xs space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                Detailed Engineering Scope
              </span>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
                {appData.fullDescription || appData.shortDescription}
              </p>
            </div>


            {/* 4. Technical Engine Specs */}
            <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-zinc-900 text-white px-6 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Technical Engine Specifications
                </h3>
              </div>
              <div className="divide-y divide-zinc-100 bg-white">
                {(appData as any).techSpecs && typeof (appData as any).techSpecs === 'object' && Object.keys((appData as any).techSpecs).length > 0 ? (
                  Object.entries((appData as any).techSpecs).map(([key, value], idx) => (
                    <div key={idx} className={`grid grid-cols-3 p-4 text-xs ${idx % 2 === 1 ? 'bg-zinc-50/50' : ''}`}>
                      <span className="text-zinc-500 font-medium">{key}</span>
                      <span className="col-span-2 font-mono font-semibold text-zinc-900">
                        {String(value)}
                      </span>
                    </div>
                  ))
                ) : Array.isArray(appData.specs) && appData.specs.length > 0 ? (
                  appData.specs.map((spec, idx) => (
                    <div key={idx} className={`grid grid-cols-3 p-4 text-xs ${idx % 2 === 1 ? 'bg-zinc-50/50' : ''}`}>
                      <span className="text-zinc-500 font-medium">{spec.label}</span>
                      <span className="col-span-2 font-mono font-semibold text-zinc-900">
                        {spec.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-3 p-4 text-xs">
                      <span className="text-zinc-500 font-medium">Architecture</span>
                      <span className="col-span-2 font-mono font-semibold text-zinc-900">
                        Standalone Desktop (Windows 10/11 x64, macOS Apple Silicon / Intel)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-4 text-xs bg-zinc-50/50">
                      <span className="text-zinc-500 font-medium">Execution Engine</span>
                      <span className="col-span-2 font-mono font-semibold text-zinc-900">
                        Deterministic Compiled Engine (Zero Cloud Latency)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-4 text-xs">
                      <span className="text-zinc-500 font-medium">Export Formats</span>
                      <span className="col-span-2 font-mono font-semibold text-zinc-900">
                        Formal PDF/A Calculation Sheet, XLSX Audit Model, DXF CAD Drawings
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: App Header, Price, Buy/Trial CTAs & Features                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* App Identification Card */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-2xs space-y-4">
              <div className="flex items-center space-x-4">
                <AssetImage
                  src={logoUrl}
                  alt={appData.name}
                  className="w-12 h-12 shrink-0"
                  fallback={<Boxes className="w-12 h-12 text-black" />}
                />
                <div>
                  <h1 className="text-2xl font-bold text-zinc-950 tracking-tight leading-tight">
                    {appData.name}
                  </h1>
                  <span className="text-xs text-zinc-500 font-medium">
                    {appData.categoryName} Engine
                  </span>
                </div>
              </div>
            </div>


            {/* Pricing & Commercial Actions Card */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Engine Perpetual Seat
                </div>
                <div className="flex items-baseline space-x-2">
                  {(loading || branding.storeIcon) && (
                    <AssetImage src={branding.storeIcon} alt="Tokens" className="w-5 h-5 shrink-0" />
                  )}
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-zinc-950">
                    {appData.price}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    Tokens ≈ {formatUsd(tokensToUsd(appData.price))}
                  </span>
                </div>
              </div>

              {/* Purchase Feedback Alerts */}
              {purchaseError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{purchaseError}</span>
                </div>
              )}

              {purchaseStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{purchaseStatus}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {owned ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-center space-x-2 font-semibold">
                    <Check className="w-4 h-4" />
                    <span>Perpetual License Owned (Active)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={purchasing}
                    className="w-full py-3 bg-zinc-900 text-white text-center text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
                  >
                    {(loading || branding.storeIcon) && (
                      <AssetImage src={branding.storeIcon} alt="Tokens" className="w-3.5 h-3.5 shrink-0 filter brightness-0 invert" />
                    )}
                    <span>{purchasing ? 'Processing...' : `Buy Engine License (${appData.price} Tokens)`}</span>
                  </button>
                )}

                <Link
                  to="/trial"
                  className="w-full py-2.5 bg-zinc-50 text-zinc-900 text-center text-xs font-medium uppercase tracking-wider rounded-xl border border-zinc-200 hover:bg-zinc-100 transition-colors block shadow-2xs"
                >
                  Request {TRIAL_DAYS}-Day Free Trial Key
                </Link>

                <Link
                  to="/pricing"
                  className="w-full py-2 text-center text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:underline block"
                >
                  View Full Suite & Discipline Bundles →
                </Link>
              </div>

              {/* Offline & security notes */}
              <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-800 shrink-0" />
                  <span>Verified Deterministic Algorithm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-zinc-800 shrink-0" />
                  <span>100% Offline Desktop Operation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-zinc-800 shrink-0" />
                  <span>Instant PDF/A, XLSX, & DXF Exports</span>
                </div>
              </div>
            </div>

            {/* Governing Design Codes */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-2xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Governing Standards & Reference Codes
              </h3>
              <div className="flex flex-wrap gap-2">
                {appData.standards?.map((std, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono font-medium px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-700"
                  >
                    {std}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features Bullet List */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-2xs space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Calculation Features & Workflows
              </h3>
              <ul className="space-y-3">
                {appData.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-700 leading-relaxed">
                    <div className="p-0.5 bg-zinc-100 text-zinc-900 rounded mt-0.5 shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Apps in this Category */}
      {relatedApps.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-zinc-50/50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/60">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                  Discipline Ecosystem
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Related {appData.categoryName} Tools
                </h3>
              </div>
              <Link
                to={`/category/${appData.categorySlug}`}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-600 transition-colors flex items-center space-x-1"
              >
                <span>All {appData.categoryName} Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
