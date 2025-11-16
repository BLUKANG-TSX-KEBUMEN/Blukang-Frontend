'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReportList from '@/components/report-list'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const HomePage = () => {

  const [newsLoading, setNewsLoading] = useState(false)
  const [newsData, setNewsData] = useState<News[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articles`)
        const data = await res.json()
        setNewsData(data.data || [])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Error fetching news:', error)
        setError(error.message || 'Gagal memuat data berita')
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ===== Hero Section ===== */}
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{ minHeight: '700px' }}
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
            </div>

            {newsLoading ? (
              <div className='flex flex-col gap-6'>
                {[...Array(3)].map((_, i) => (
                  <Card
                    key={i}
                    className='flex flex-col sm:flex-row w-full overflow-hidden shadow-sm'
                  >
                    <Skeleton className="w-full sm:w-1/3 h-56" />
                    <div className="flex flex-col justify-between flex-1 p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-10 w-32 self-end mt-4" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='flex flex-col gap-6'>
                {newsData.map((news, i) => (
                  <Card
                    key={i}
                    className='flex flex-col sm:flex-row w-full overflow-hidden shadow-sm'
                  >
                    <Image
                      src={news.imageArticle}
                      alt={news.title}
                      width={500}
                      height={500}
                      className="w-full sm:w-1/3 h-56 object-cover"
                    />
                    <div className="flex flex-col flex-1 p-5 space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">{news.title}</h3>
                      <p className="text-sm text-gray-600">{news.bodyArticle}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

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
                href="/form"
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
