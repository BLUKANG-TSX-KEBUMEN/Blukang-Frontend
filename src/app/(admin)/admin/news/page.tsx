'use client'
import NewsList from '@/components/admin/news/news-list'
import React, { useCallback, useEffect, useState } from 'react'

const NewsAdmin = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articles`)
      const json = await res.json()
      const data = Array.isArray(json) ? json : json.data || []
      setNews(data)
    } catch (error) {
      console.error('Error fetching news:', error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])


  return (
    <div className='min-h-[calc(100vh-100px)]'>
      <div className='w-full h-screen'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>
            Berita
          </h2>
          <p className='text-gray-400 text-sm'>Tambah dan kelola berita</p>
        </div>
        <div className='flex-1'>
          <NewsList news={news} loading={loading} fetchNews={fetchNews}/>
        </div>
      </div>
    </div>
  )
}

export default NewsAdmin