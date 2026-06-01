'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useFlyToCart } from '@/contexts/FlyToCartContext';

function FlyingImage({ id, src, startX, startY, endX, endY, alt }: {
  id: string;
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  alt: string;
}) {
  const { removeFlyingImage } = useFlyToCart();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const duration = 800;

    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;

    const animation = el.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(${endX - startX}px - 50%), calc(${endY - startY}px - 50%)) scale(0.1)`, opacity: 0 },
      ],
      { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );

    animation.onfinish = () => removeFlyingImage(id);
  }, [startX, startY, endX, endY, id, removeFlyingImage]);

  return (
    <div
      ref={ref}
      className="fixed z-[9999] pointer-events-none"
      style={{ left: startX, top: startY }}
    >
      <div className="w-16 h-16 relative rounded-lg overflow-hidden shadow-xl border-2 border-white bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    </div>
  );
}

export default function FlyingImageLayer() {
  const { flyingImages } = useFlyToCart();

  if (flyingImages.length === 0) return null;

  return (
    <>
      {flyingImages.map((img) => (
        <FlyingImage key={img.id} {...img} />
      ))}
    </>
  );
}
