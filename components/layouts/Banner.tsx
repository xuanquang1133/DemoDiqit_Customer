'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';

const IMAGES = [
  '/banners/Banner-1.png',
  '/banners/Banner-2.png',
  '/banners/Banner-3.png',
];

const DISPLAY_DURATION = 4000;
const TRANSITION_DURATION = 600;

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    const next = (currentIndex + 1) % IMAGES.length;
    setNextIndex(next);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(next);
      setNextIndex(null);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    if (!mountedRef.current) return;
    const timer = setInterval(goToNext, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [goToNext]);

  if (!mountedRef.current) {
    return (
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: 500 }}
      >
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .banner-slide-out {
          animation: slideOutLeft ${TRANSITION_DURATION}ms ease-in-out forwards;
          pointer-events: none;
        }
        .banner-slide-in {
          animation: slideInFromRight ${TRANSITION_DURATION}ms ease-in-out forwards;
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: 500 }}
      >
        {/* Current Image - slides out to left */}
        <div
          key={`current-${currentIndex}`}
          className={isTransitioning ? 'banner-slide-out' : ''}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: isTransitioning ? undefined : 1,
          }}
        >
          <Image
            key={`img-current-${currentIndex}`}
            src={IMAGES[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>

        {/* Next Image - slides in from right */}
        {nextIndex !== null && (
          <div
            key={`next-${nextIndex}`}
            className="banner-slide-in"
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image
              key={`img-next-${nextIndex}`}
              src={IMAGES[nextIndex]}
              alt={`Banner ${nextIndex + 1}`}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
          </div>
        )}
      </div>
    </>
  );
}