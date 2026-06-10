
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const DESKTOP_IMAGES = [
  { src: '/banners/Banner-1.png', alt: 'Banner 1' },
  { src: '/banners/Banner-2.png', alt: 'Banner 2' },
  { src: '/banners/Banner-3.png', alt: 'Banner 3' },
];

const IPAD_MINI_IMAGES = [
  { src: '/banners/Banner1-Ipad-Mini.png', alt: 'Banner iPad Mini 1' },
  { src: '/banners/Banner2-Ipad-Mini.png', alt: 'Banner iPad Mini 2' },
  { src: '/banners/Banner3-Ipad-Mini.png', alt: 'Banner iPad Mini 3' },
];

const IPAD_AIR_IMAGES = [
  { src: '/banners/Banner1-Ipad-Air.png', alt: 'Banner iPad Air 1' },
  { src: '/banners/Banner2-Ipad-Air.png', alt: 'Banner iPad Air 2' },
  { src: '/banners/Banner3-Ipad-Air.png', alt: 'Banner iPad Air 3' },
];

const IPAD_PRO_IMAGES = [
  { src: '/banners/Banner1-Ipad-Pro.png', alt: 'Banner iPad Pro 1' },
  { src: '/banners/Banner2-Ipad-Pro.png', alt: 'Banner iPad Pro 2' },
  { src: '/banners/Banner3-Ipad-Pro.png', alt: 'Banner iPad Pro 3' },
];

const MOBILE_IMAGES = [
  { src: '/banners/Banner1-Mobile-All.png', alt: 'Banner Mobile 1' },
  { src: '/banners/Banner2-Mobile-All.png', alt: 'Banner Mobile 2' },
  { src: '/banners/Banner3-Mobile-All.png', alt: 'Banner Mobile 3' },
];

const DISPLAY_DURATION = 5000;

type IpadVariant = 'mini' | 'air' | 'pro';

function BannerSlide({ src, alt, contain = false, active = true }: {
  src: string;
  alt: string;
  contain?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-opacity duration-800 ease-in-out"
      style={{ opacity: active ? 1 : 0 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className={contain ? 'object-contain' : 'object-cover'}
        sizes="100vw"
        suppressHydrationWarning
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
    </div>
  );
}

function getIpadVariant(width: number): IpadVariant {
  if (width <= 768) return 'mini';
  if (width <= 820) return 'air';
  return 'pro';
}

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ipadVariant, setIpadVariant] = useState<IpadVariant>('air');

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % MOBILE_IMAGES.length);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIpadVariant(getIpadVariant(window.innerWidth));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [goToNext]);

  const SLIDE_COUNT = MOBILE_IMAGES.length;

  const currentIpadImages =
    ipadVariant === 'mini'
      ? IPAD_MINI_IMAGES
      : ipadVariant === 'air'
      ? IPAD_AIR_IMAGES
      : IPAD_PRO_IMAGES;

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-[85vh] xl:h-[85vh] 2xl:h-screen overflow-hidden bg-gray-900">
      <div className="relative w-full h-full group">

        {/* ===== iPad banners (md to xl: 768px - 1279px) ===== */}
        <div className="absolute inset-0 hidden md:block xl:hidden" aria-hidden="true">
          {currentIpadImages.map((img, i) => (
            <BannerSlide
              key={`ipad-${i}`}
              src={img.src}
              alt={img.alt}
              contain
              active={i === currentIndex}
            />
          ))}
        </div>

        {/* ===== iPad Pro banners (xl to 2xl: 1280px - 1535px) ===== */}
        <div className="absolute inset-0 hidden xl:block 2xl:hidden" aria-hidden="true">
          {currentIpadImages.map((img, i) => (
            <BannerSlide
              key={`ipad-pro-${i}`}
              src={img.src}
              alt={img.alt}
              contain
              active={i === currentIndex}
            />
          ))}
        </div>

        {/* ===== Desktop banners (2xl+: 1536px+) ===== */}
        <div className="absolute inset-0 hidden 2xl:block" aria-hidden="true">
          {DESKTOP_IMAGES.map((img, i) => (
            <BannerSlide
              key={`desktop-${i}`}
              src={img.src}
              alt={img.alt}
              active={i === currentIndex}
            />
          ))}
        </div>

        {/* ===== Mobile banners (< md: < 768px) ===== */}
        <div className="absolute inset-0 md:hidden" aria-hidden="true">
          {MOBILE_IMAGES.map((img, i) => (
            <BannerSlide
              key={`mobile-${i}`}
              src={img.src}
              alt={img.alt}
              active={i === currentIndex}
            />
          ))}
        </div>

        {/* ===== Content Overlay ===== */}
        <div className="absolute inset-0 flex items-end 2xl:items-center z-10">
          <div className="container-custom w-full">
            <div className="pb-6 2xl:pb-0">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                Summer Sale
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Khám phá
                <br />
                <span className="text-red-500">Phong cách mới</span>
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 max-w-md">
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

        {/* ===== Navigation Dots ===== */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10">
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
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

        {/* ===== Navigation Arrows (tablet+ only) ===== */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 hidden md:flex"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % SLIDE_COUNT)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 hidden md:flex"
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
