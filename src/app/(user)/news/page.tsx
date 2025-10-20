'use client'

import React, { useState } from 'react'
import Header from '../../../components/header' // Pastikan path sesuai lokasi Header.tsx
import Link from 'next/link'

const NewsPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Data dummy berita (bisa diganti dari API)
  const beritaList = [
    {
      judul: 'Pembangunan Gedung Baru SD Negeri Patukrejomulyo Dimulai',
      isi: 'Pemerintah desa bersama komite sekolah memulai proyek pembangunan gedung baru.',
      tanggal: '12 Oktober 2025',
    },
    {
      judul: 'Perbaikan Jalan Lingkungan RT 03 Selesai Lebih Cepat',
      isi: 'Pekerjaan pengaspalan jalan lingkungan RT 03 RW 01 telah selesai lebih cepat dari jadwal.',
      tanggal: '9 Oktober 2025',
    },
    {
      judul: 'Posyandu Balita Bulan Oktober Terlaksana dengan Lancar',
      isi: 'Kegiatan Posyandu untuk balita di bulan Oktober berjalan dengan lancar di 5 lokasi di desa.',
      tanggal: '7 Oktober 2025',
    },
    {
      judul: 'Festival UMKM Desa Akan Digelar Bulan Depan',
      isi: 'Pemerintah desa merencanakan Festival UMKM yang akan digelar di halaman balai desa pada tanggal 20 November 2025.',
      tanggal: '5 Oktober 2025',
    },
    {
      judul: 'Pelatihan Komputer Gratis untuk Remaja Desa',
      isi: 'Karang Taruna bekerja sama dengan relawan IT mengadakan pelatihan komputer gratis untuk remaja desa setiap hari Sabtu.',
      tanggal: '3 Oktober 2025',
    },
    {
      judul: 'Musyawarah Rencana Pembangunan Desa 2026 Sukses Digelar',
      isi: 'Musrenbangdes untuk tahun 2026 telah dilaksanakan dengan dihadiri 120 warga dari berbagai RT/RW. Warga mengusulkan berbagai program prioritas.',
      tanggal: '1 Oktober 2025',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten utama */}
      <main className="flex flex-col flex-1 mt-[64px] md:ml-64 px-4 sm:px-6 lg:px-10 py-8">
        {/* Judul Halaman */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Berita Terkini
          </h1>
          <span className="text-sm text-gray-600">
            {beritaList.length} artikel
          </span>
        </div>

        {/* Daftar Berita */}
        <div className="flex flex-col gap-5">
          {beritaList.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Gambar Placeholder */}
              <div className="w-full h-32 bg-gray-300" />

              {/* Konten berita */}
              <div className="p-4 sm:p-6">
                <h2 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  {item.judul}
                </h2>
                <p className="text-sm text-gray-600 mb-3">{item.isi}</p>

                <p className="text-xs text-gray-500 mb-3">{item.tanggal}</p>

                <Link
                  href="#"
                  className="text-sm text-blue-700 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                >
                  Baca selengkapnya →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol kembali */}
        <div className="mt-10 text-center md:text-left">
          <Link
            href="/home"
            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 hover:underline font-medium text-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  )
}

export default NewsPage
