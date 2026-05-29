'use client';

import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden flex items-center justify-center">
      <Image
        src="https://cdn.hstatic.net/files/1000253775/file/2048x813_-_banner_web_d__h__m_i_-_ngang.jpg"
        alt="Banner"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
