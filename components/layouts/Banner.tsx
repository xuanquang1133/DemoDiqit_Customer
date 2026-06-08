
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const IMAGES = [
  { src: '/banners/Banner-1.png', alt: 'Banner 1' },
  { src: '/banners/Banner-2.png', alt: 'Banner 2' },
  { src: '/banners/Banner-3.png', alt: 'Banner 3' },
];

const DISPLAY_DURATION = 5000;

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Main Banner Container */}
      <div className="relative w-full h-full group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={IMAGES[currentIndex].src}
              alt={IMAGES[currentIndex].alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              suppressHydrationWarning
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay - Always visible on mobile, on hover for desktop */}
        <div className="absolute inset-0 flex items-end sm:items-center">
          <div className="container-custom w-full">
            {/* Mobile: always visible */}
            <div
              key={`mobile-${currentIndex}`}
              className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 ease-in-out pb-6 sm:pb-0"
            >
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                Summer Sale
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Khám phá
                <br />
                <span className="text-red-500">Phong cách mới</span>
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 max-w-md hidden sm:block">
                Cập nhật xu hướng thời trang mới nhất với bộ sưu tập độc quyền
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all duration-300 text-sm sm:text-base"
                >
                  Mua sắm ngay
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/products?category=1"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base"
                >
                  Xem khuyến mãi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-6 sm:w-8 h-2 sm:h-3 bg-red-500'
                  : 'w-2 h-2 sm:w-3 sm:h-3 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Desktop only */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hidden md:flex"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % IMAGES.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hidden md:flex"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
