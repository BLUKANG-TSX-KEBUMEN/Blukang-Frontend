'use client'

import React, { useCallback, useState, useEffect } from 'react'
import Report from '@/components/admin/reports/report-list'
import ReportMap from '@/components/admin/reports/report-map'

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`)
      const json = await res.json()
      const data = Array.isArray(json) ? json : json.data || []
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return (
    <div className='min-h-[calc(100vh-100px)]'>
      <div className='w-full h-screen'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-screen p-4 md:p-6'>
          
          {/* Kolom kiri: daftar laporan */}
          <div className='lg:col-span-4 xl:col-span-3 h-full'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col'>
              <div className='p-4 border-b'>
                <h2 className='text-lg font-semibold'>Daftar Laporan</h2>
              </div>
              <div className='flex-1 overflow-y-auto'>
                <Report reports={reports} loading={loading} fetchReports={fetchReports} />
              </div>
            </div>
          </div>

          {/* Kolom kanan: peta */}
          <div className='lg:col-span-8 xl:col-span-9 h-full'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col'>
              <div className='p-4 border-b'>
                <h2 className='text-lg font-semibold'>Peta Lokasi Laporan</h2>
              </div>
              <div className='flex-1'>
                <ReportMap reports={reports} loading={loading} fetchReports={fetchReports}/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminReports
