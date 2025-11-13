'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ReportList from '@/components/report-list'
import Image from 'next/image'


const ReportPage = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{ minHeight: '300px' }}
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
            Laporan Kerusakan Terbaru
          </h1>
          
        </div>
      </section>
      <main className="flex flex-col flex-1  p-4 md:p-8">

        {/* Daftar laporan */}
        <ReportList />

        {/* Tombol kembali */}
        
      </main>
    </div>
  )
}

export default ReportPage
