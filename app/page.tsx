'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { productApi } from '@/api/product/index';
import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import Banner from '@/components/layouts/Banner';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category?: { id?: number; name?: string };
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getProducts({ page: 1, limit: 8 }),
  });

  const products = data?.items || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <Banner />

      {/* Featured Products Section */}
      <section className="section bg-white !py-10 sm:!py-12 md:!py-16">
        <div className="container-custom">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
          >
            <div>
              <span className="text-red-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">Bộ sưu tập</span>
              <h2 className="section-title mt-1 sm:mt-2">Sản phẩm nổi bật</h2>
              <p className="section-subtitle">Khám phá những sản phẩm được yêu thích nhất</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors group"
            >
              Xem tất cả
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Chưa có sản phẩm nào</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-4 text-red-600 font-medium hover:underline"
              >
                Khám phá ngay
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid-products"
            >
              {products.map((product: Product, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="relative overflow-hidden promo-banner-section">
        {/* Mobile banner (phones) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url('/banners/BottomBannerMobile.png')" }}
        />
        {/* iPad Mini & Air banner (tablets portrait 768px - 1023px) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block xl:hidden"
          style={{ backgroundImage: "url('/banners/BottomBannerIpad.png')" }}
        />
        {/* Desktop / iPad Pro landscape (1024px+) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden xl:block"
          style={{ backgroundImage: "url('/banners/anh3.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="container-custom hero-banner-cta relative z-10 flex items-end justify-center pb-8 sm:pb-12 md:pb-[100px] lg:pb-[190px] min-h-[600px] sm:min-h-[600px] md:min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base md:text-lg"
            >
              <span>Mua ngay</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50 !py-10 sm:!py-12 md:!py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Miễn phí vận chuyển',
                desc: 'Cho đơn hàng từ 500K',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Thanh toán an toàn',
                desc: '100% bảo mật',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                ),
                title: 'Hỗ trợ 24/7',
                desc: 'Luôn sẵn sàng',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
                title: 'Đổi trả dễ dàng',
                desc: 'Trong 30 ngày',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 text-gray-700 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-xl transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm md:text-base">{feature.title}</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
