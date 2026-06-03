'use client';

import React, { createContext, useContext, useRef, useCallback, useState } from 'react';

interface FlyImage {
  id: string;
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  alt: string;
}

interface FlyToCartContextType {
  triggerFly: (src: string, startRect: DOMRect, endRect: DOMRect, alt: string) => void;
  cartButtonRef: React.RefObject<HTMLButtonElement | null>;
  flyingImages: FlyImage[];
  removeFlyingImage: (id: string) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null);

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error('useFlyToCart must be used within FlyToCartProvider');
  return ctx;
}

export default function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const [flyingImages, setFlyingImages] = useState<FlyImage[]>([]);

  const triggerFly = useCallback(
    (src: string, startRect: DOMRect, endRect: DOMRect, alt: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const img: FlyImage = {
        id,
        src,
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
        endX: endRect.left + endRect.width / 2,
        endY: endRect.top + endRect.height / 2,
        alt,
      };
      setFlyingImages((prev) => [...prev, img]);
    },
    []
  );

  const removeFlyingImage = useCallback((id: string) => {
    setFlyingImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  return (
    <FlyToCartContext.Provider
      value={{ triggerFly, cartButtonRef, flyingImages, removeFlyingImage }}
    >
      {children}
    </FlyToCartContext.Provider>
  );
}
