'use client'; // Tambahkan ini jika Anda menggunakan App Router di Next.js

import React, { useState, useEffect } from 'react';
import Image from 'next/image';




const HeroCarousel: React.FC = () => {
  const [images, setImages] = useState<SliderContent[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Fetching Data dari API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/contents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Pastikan 'data' ada dan merupakan array
        if (result.success && Array.isArray(result.data)) {
          setImages(result.data);
        } else {
          setError('Format data API tidak sesuai.');
        }
      } catch (err) {
        // Handle error: casting error to Error object for proper logging
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data.';
        setError(errorMessage);
        console.error('Fetching error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Hanya dijalankan saat komponen di-mount

  // --- 2. Auto-Slide Carousel ---
  useEffect(() => {
    // Hanya jalankan auto-slide jika ada gambar
    if (images.length === 0) return;

    const intervalTime = 5000; // Ganti setiap 5 detik (5000 ms)

    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
    }, intervalTime);

    // Cleanup function untuk menghapus interval saat komponen unmount
    return () => clearInterval(interval);
  }, [images.length]); // Jalankan ulang jika jumlah gambar berubah

  // Tampilkan loading/error state
  if (isLoading) {
    return (
      <section
        className="relative w-full flex items-center justify-center text-center bg-gray-700 text-white"
        style={{ minHeight: '700px' }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="ml-4">Memuat Gambar...</p>
      </section>
    );
  }

  if (error || images.length === 0) {
    return (
      <section
        className="relative w-full flex items-center justify-center text-center bg-red-800 text-white"
        style={{ minHeight: '700px' }}
      >
        <div className="relative z-10  p-4">
            <h1 className="text-2xl font-bold mb-2">Layanan Digital Desa Patukrejomulyo</h1>
            <p className="text-sm">Tidak dapat memuat gambar carousel. {error ? `Error: ${error}` : 'Data kosong.'}</p>
            <p className="mt-2 text-xs">Menggunakan fallback gambar statis jika tersedia.</p>
        </div>
        {/* FALLBACK STATIC IMAGE JIKA DIPERLUKAN */}
        <Image
            src="/fallback-hero.jpg" // Ganti dengan path gambar statis Anda
            alt="Fallback Hero Image"
            fill
            className="object-cover brightness-[0.55]"
            priority
        />
      </section>
    );
  }

  // --- 3. Rendering Carousel ---
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '700px' }}
    >
      {/* Container untuk semua slide */}
      <div className="absolute inset-0 transition-transform duration-500 ease-in-out" 
           style={{ 
               width: `${images.length * 100}%`, // Lebar total slide
               transform: `translateX(-${(100 / images.length) * activeIndex}%)` // Geser sesuai activeIndex
           }}
      >
        {images.map((item, index) => (
          <div
            key={item.id}
            className="relative h-full float-left"
            style={{ width: `${100 / images.length}%` }} // Setiap slide mengambil proporsi yang sama
          >
            {/* Background Image (Slider Image) */}
            <Image
              // Menggunakan item.imageSlider dari data API
              src={item.imageSlider}
              alt={`Slide ${index + 1} Desa Patukrejomulyo`}
              fill
              className="object-cover brightness-[0.55]"
              priority={index === 0} // Prioritaskan gambar pertama
              sizes="(max-width: 768px) 100vw, 100vw"
            />

            {/* Overlay Text (Tetap Statis) */}
            {/* Teks ditampilkan di atas semua slide, tetapi diposisikan secara absolut di dalam <section> */}
            {/* Saya pindahkan teks di luar loop untuk ditampilkan sebagai overlay statis */}
          </div>
        ))}
      </div>

      {/* Overlay Text (Posisi di tengah atas semua gambar) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full px-4 py-10 text-white text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight drop-shadow-lg">
          Layanan Digital Desa Patukrejomulyo
        </h1>
        <p className="text-sm sm:text-base text-gray-100 max-w-2xl mx-auto drop-shadow-md">
          Akses cepat informasi desa dan laporan fasilitas umum.
        </p>
      </div>

      {/* Indikator Navigasi (Dots) */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === activeIndex ? 'bg-white' : 'bg-gray-400 opacity-60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;