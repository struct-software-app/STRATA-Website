import React, { useState, useEffect, useRef } from 'react';
import { HeroBannerItem } from '../context/DataContext';

const DEFAULT_SLIDES: HeroBannerItem[] = [
  {
    id: 'default-1',
    title: 'Engineering Precision. Zero Compromise.',
    paragraph: 'Formal, standalone desktop calculation software for civil, structural, geotechnical, environmental, surveying, transportation, and water resources engineers.',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&q=80',
    cta_text: 'Get Started',
    cta_link: '/get-started'
  },
  {
    id: 'default-2',
    title: '35 Verified Calculation Engines',
    paragraph: 'Engineered for rigorous design office verification, infrastructure modeling, and 100% offline desktop productivity without cloud lock-in.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop&q=80',
    cta_text: 'Browse Engines',
    cta_link: '/download'
  },
  {
    id: 'default-3',
    title: 'Audit-Ready Calculation Reports',
    paragraph: 'Every output equation provides step-by-step intermediate formulations and explicit clause citations from governing standards.',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1920&h=1080&fit=crop&q=80',
    cta_text: 'Learn More',
    cta_link: '/about'
  }
];

interface HeroSliderProps {
  banners?: HeroBannerItem[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners = [] }) => {
  const slides = (banners && banners.length > 0) ? banners : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mouse drag & touch swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll timer: advance slide every 2 seconds if not user dragging
  useEffect(() => {
    if (slides.length <= 1 || isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [slides.length, isDragging]);

  // Keep index within bounds if slides array changes
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Mouse / Touch Gesture Handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Threshold to switch slides: 50px
    if (dragOffset < -50) {
      // Swiped left -> next slide
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (dragOffset > 50) {
      // Swiped right -> previous slide
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setDragOffset(0);
  };

  return (
    <section 
      ref={containerRef}
      className="relative border-b border-zinc-200 overflow-hidden h-[350px] min-h-[350px] max-h-[350px] flex items-center bg-zinc-950 text-white w-full select-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* Slides Container (Smooth CSS Transform transition right-to-left) */}
      <div 
        className={`w-full h-[350px] flex flex-nowrap ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
        }}
      >
        {slides.map((slide, idx) => {
          const mediaUrl = slide.image_url;
          const isVideo = mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.startsWith('data:video'));

          return (
            <div 
              key={slide.id || idx}
              className="w-full h-[350px] flex-shrink-0 relative overflow-hidden bg-zinc-900 flex items-center px-6 md:px-12 py-6"
            >
              {/* Background Media */}
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
                <img 
                  src={mediaUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&q=80'} 
                  alt={slide.title || 'STRATA Hero Banner'} 
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
                />
              )}

              {/* Dark tint overlay for crystal-clear readability */}
              <div className="absolute inset-0 bg-black/60 z-0" />

              {/* Title & Paragraph Overlay Text Above Banner */}
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
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Bottom Center Pagination Dots (No Arrow Buttons as requested) */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
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
