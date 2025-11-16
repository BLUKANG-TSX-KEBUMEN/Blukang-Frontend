'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Card,

  CardHeader,
  CardTitle,

} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"


const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const NewsPage = () => {
  const [loading, setLoading] = useState(true)
  const [beritaList, setBeritaList] = useState<News[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articles`)
        const data = await res.json()
        setBeritaList(data.data || [])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Gagal memuat data berita')
      } finally {
        setLoading(false)
      }
    }
    fetchBerita()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }




  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{ minHeight: '300px' }}
      >
        <Image
          src="/hero-desa.jpg"
          alt="Hero Image Desa Patukrejomulyo"
          fill
          className="object-cover brightness-[0.55]"
          priority
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Berita Terbaru
          </h1>
          <p className="text-sm text-gray-200">
            Informasi dan kegiatan terkini di Desa Patukrejomulyo
          </p>
        </div>
      </section>

      {/* Daftar Berita */}
      <main className="flex flex-col flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {loading ? '...' : `${beritaList.length} artikel`}
          </span>
        </div>

        {/* Skeleton Loading */}
        {loading ? (
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="flex flex-col sm:flex-row w-full overflow-hidden shadow-sm"
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
          <div className="flex flex-col gap-6">
            {beritaList.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col sm:flex-row w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Gambar */}
                <div className="relative w-full sm:w-1/3 h-56 sm:h-56">
                  <Image
                    src={item.imageArticle}
                    alt={item.title}
                    fill
                    className="object-cover h-full rounded-r-xl"
                    priority={false}
                  />
                </div>

                {/* Teks */}
                <div className="flex flex-col justify-between flex-1 p-5">
                  <div>
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {item.title}
                      </CardTitle>
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                      >
                        <AccordionItem value="open">
                          <AccordionTrigger className="text-sm text-gray-700 hover:no-underline">
                            {truncateText(item.bodyArticle, 100)}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                              {item.bodyArticle}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardHeader>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default NewsPage
