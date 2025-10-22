'use client'

import Report from '@/components/admin/report-list'
import ReportMap from '@/components/admin/report-map'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div className='min-h-[calc(100vh-100px)]'> {/* agar responsif */}
      <div className='max-w-7xl mx-auto h-full'>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-[calc(100vh-120px)]'>

          {/* Kolom kiri: daftar laporan */}
          <div className='lg:col-span-4 xl:col-span-3 h-full'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col'>
              <div className='p-4 border-b'>
                <h2 className='text-lg font-semibold'>Daftar Laporan</h2>
              </div>
              <div className='flex-1 overflow-y-auto'>
                <Report />
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
                <ReportMap />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
