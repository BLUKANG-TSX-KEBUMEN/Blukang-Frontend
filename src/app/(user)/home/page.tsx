'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReportList from '@/components/report-list'

const HomePage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ===== Hero Section ===== */}
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{  minHeight: '700px' }}
      >
        {/* Background Image */}
        <Image
          src="/hero-desa.jpg"
          alt="Hero Image Desa Patukrejomulyo"
          fill
          className="object-cover brightness-[0.55]"
          priority
        />

        {/* Overlay Text */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-10">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
            Layanan Digital Desa Patukrejomulyo
          </h1>
          <p className="text-sm sm:text-base text-gray-100 max-w-2xl mx-auto">
            Akses cepat informasi desa dan laporan fasilitas umum.
          </p>
        </div>
      </section>

      {/* ===== Main Content ===== */}
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto p-6 md:p-10 }`}
      >

        {/* ===== Berita Terkini ===== */}
        <section className="space-y-10">
          {/* Berita */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Berita Terkini</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">6</span>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Pembangunan Gedung Baru SD Negeri Patukrejomulyo Dimulai',
                  date: '12 Oktober 2025',
                },
                {
                  title: 'Perbaikan Jalan Lingkungan RT 03 Selesai Lebih Cepat',
                  date: '9 Oktober 2025',
                },
                {
                  title: 'Posyandu Balita Bulan Oktober Terlaksana dengan Lancar',
                  date: '7 Oktober 2025',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-md" />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/news"
              className="block w-full mt-4 bg-gradient-to-r from-blue-600 to-black text-white py-2 rounded-lg font-medium text-center"
            >
              Lihat Semua Berita →
            </Link>
          </div>

          {/* ===== Laporan Warga ===== */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Laporan Warga</h2>
            </div>

            <ReportList />

            <div className="flex gap-2 mt-4">
              <Link
                href="/report"
                className="flex-1 bg-gradient-to-r from-blue-600 to-black text-white py-2 rounded-lg font-medium text-center"
              >
                Lihat Semua
              </Link>
              <Link
                href="/report/form"
                className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium text-center"
              >
                Kirim Laporan
              </Link>
            </div>
          </div>


        </section>
      </main>
    </div>
  )
}

export default HomePage
