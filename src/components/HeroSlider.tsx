import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroBannerItem } from '../context/DataContext';
import { AssetImage } from './AssetImage';

const buildDefaultSlides = (toolCount: number): HeroBannerItem[] => [
  {
    id: 'default-1',
    title: 'Engineering Precision. Zero Compromise.',
    paragraph:
      'Formal, standalone desktop calculation software for civil, structural, geotechnical, environmental, surveying, transportation, and water resources engineers.',
    image_url: '',
    cta_text: 'Get Started',
    cta_link: '/get-started',
  },
  {
    id: 'default-2',
    title: `${toolCount} Verified Calculation Engines`,
    paragraph:
      'Engineered for rigorous design office verification, infrastructure modeling, and 100% offline desktop productivity without cloud lock-in.',
    image_url: '',
    cta_text: 'Browse Engines',
    cta_link: '/category/structural',
  },
  {
    id: 'default-3',
    title: 'Audit-Ready Calculation Reports',
    paragraph:
      'Every output equation provides step-by-step intermediate formulations and explicit clause citations from governing standards.',
    image_url: '',
    cta_text: 'Learn More',
    cta_link: '/about',
  },
];

const VIDEO_URL_RE = /\.(mp4|webm|ogg)(\?.*)?$/i;

interface HeroSliderProps {
  banners?: HeroBannerItem[];
  toolCount?: number;
  loading: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners = [], toolCount = 35, loading }) => {
  const defaultSlides = useMemo(() => buildDefaultSlides(toolCount), [toolCount]);
  const slides = banners && banners.length > 0 ? banners : defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mouse drag & touch swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Auto scroll timer: advance slide every 6 seconds when active and permitted
  useEffect(() => {
    if (slides.length <= 1 || isDragging || isHovered || isFocused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length, isDragging, isHovered, isFocused, prefersReducedMotion]);

  // Keep index within bounds if slides array changes
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Mouse / Touch Gesture Handlers
  const handleDragStart = (clientX: number) => {
    didDragRef.current = false;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    if (Math.abs(deltaX) > 5) {
      didDragRef.current = true;
    }
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Threshold to switch slides: 50px
    if (dragOffset < -50) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (dragOffset > 50) {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setDragOffset(0);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    }
  };

  const handleKeyDownCapture = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      didDragRef.current = false;
    }
  };

  if (loading && (!banners || banners.length === 0)) {
    return (
      <section className="relative overflow-hidden h-[350px] min-h-[350px] max-h-[350px] bg-black w-full select-none" />
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden h-[350px] min-h-[350px] max-h-[350px] flex items-center bg-zinc-950 text-white w-full select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={() => {
        setIsHovered(false);
        handleDragEnd();
      }}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      onClickCapture={handleClickCapture}
      onKeyDownCapture={handleKeyDownCapture}
    >
      {/* Slides Container (Smooth CSS Transform transition right-to-left) */}
      <div
        className={`w-full h-[350px] flex flex-nowrap ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
        }}
      >
        {slides.map((slide, idx) => {
          const mediaUrl = (slide.image_url || '').trim();
          const isVideo = Boolean(
            mediaUrl && (VIDEO_URL_RE.test(mediaUrl) || mediaUrl.startsWith('data:video'))
          );
          const hasCta = Boolean(slide.cta_text && slide.cta_link);
          const ctaClassName =
            'mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl text-xs font-semibold shadow-xs transition-colors pointer-events-auto';

          return (
            <div
              key={slide.id || idx}
              className="w-full h-[350px] flex-shrink-0 relative overflow-hidden bg-zinc-950 flex items-center px-6 md:px-12 py-6"
            >
              {/* Background Media or Grid Pattern */}
              {mediaUrl ? (
                <>
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <AssetImage
                      src={mediaUrl}
                      alt={slide.title || 'STRATA Hero Banner'}
                      fit="cover"
                      className="absolute inset-0 w-full h-full pointer-events-none select-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
                </>
              ) : (
                <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
              )}

              {/* Title, Paragraph & CTA Overlay */}
              <div className="relative z-10 max-w-7xl mx-auto text-left w-full pointer-events-none">
                <div className="max-w-3xl">
                  {slide.title && (
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.08] drop-shadow-sm">
                      {slide.title}
                    </h1>
                  )}
                  {slide.paragraph && (
                    <p className="text-sm sm:text-lg text-zinc-200 leading-relaxed font-normal drop-shadow-xs max-w-2xl">
                      {slide.paragraph}
                    </p>
                  )}
                  {hasCta && slide.cta_link && (
                    slide.cta_link.startsWith('/') ? (
                      <Link to={slide.cta_link} draggable={false} className={ctaClassName}>
                        <span>{slide.cta_text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <a
                        href={slide.cta_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        draggable={false}
                        className={ctaClassName}
                      >
                        <span>{slide.cta_text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Center Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-current={idx === currentIndex ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
