// src/pages/admin/dashboard.tsx (atau sejenisnya)

'use client'

import ReportList from '@/components/admin/report-list'
import ReportMap from '@/components/admin/report-map'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div className='h-full'> 
      <div className='max-w-7xl mx-auto h-full'> 
        
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full'>
          
          <div className='lg:col-span-4 xl:col-span-3 h-full'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden h-full'> 
              <div className='bg-blue-600 text-white p-4'>
                <h2 className='text-lg font-semibold'>Daftar Laporan</h2>
              </div>
              <ReportList />
            </div>
          </div>

          <div className='lg:col-span-8 xl:col-span-9 h-full'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden h-full'> 
              <div className='bg-blue-600 text-white p-4'>
                <h2 className='text-lg font-semibold'>Peta Lokasi Laporan</h2>
              </div>

              <div className='h-[calc(100%-60px)]'> 
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