'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  titleAr: string;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
}

interface AdCarouselProps {
  locale?: string;
  autoPlayInterval?: number;
}

export function AdCarousel({ locale = 'en', autoPlayInterval = 5000 }: AdCarouselProps) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === 'ar';

  useEffect(() => {
    async function fetchAds() {
      try {
        const res = await fetch('/api/advertisements');
        if (res.ok) {
          const data = await res.json();
          setAdvertisements(data.advertisements || []);
        }
      } catch (error) {
        console.error('Failed to fetch advertisements:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAds();
  }, []);

  const goToNext = useCallback(() => {
    if (advertisements.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % advertisements.length);
  }, [advertisements.length]);

  const goToPrev = useCallback(() => {
    if (advertisements.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  }, [advertisements.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (advertisements.length <= 1 || isPaused) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [advertisements.length, isPaused, autoPlayInterval, goToNext]);

  // Don't render if loading or no ads
  if (loading) {
    return (
      <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
    );
  }

  if (advertisements.length === 0) {
    return null;
  }

  const currentAd = advertisements[currentIndex];
  const title = isRTL ? currentAd.titleAr : currentAd.title;

  const handleAdClick = () => {
    if (currentAd.linkUrl) {
      window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Container */}
      <div
        className={`relative w-full h-48 md:h-64 lg:h-80 ${currentAd.linkUrl ? 'cursor-pointer' : ''}`}
        onClick={handleAdClick}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{
            transform: `translateX(${isRTL ? currentIndex * 100 : -currentIndex * 100}%)`,
          }}
        >
          {advertisements.map((ad) => (
            <div key={ad.id} className="w-full h-full shrink-0 relative">
              <Image
                src={ad.imageUrl}
                alt={isRTL ? ad.titleAr : ad.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                priority={ad.id === currentAd.id}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-lg">
                  {isRTL ? ad.titleAr : ad.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {advertisements.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                isRTL ? goToNext() : goToPrev();
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
              style={{ opacity: isPaused ? 1 : 0 }}
              aria-label={isRTL ? 'Next slide' : 'Previous slide'}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                isRTL ? goToPrev() : goToNext();
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
              style={{ opacity: isPaused ? 1 : 0 }}
              aria-label={isRTL ? 'Previous slide' : 'Next slide'}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Dots */}
      {advertisements.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-4 md:w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {advertisements.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-primary-500 transition-all"
            style={{
              animation: `progress ${autoPlayInterval}ms linear`,
              animationIterationCount: 'infinite',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
