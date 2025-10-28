'use client'

import DeathArchiveTable from '@/components/admin/archive/death-table'
import React from 'react'

const DeathArchive = () => {
  return (
    <div className='min-h-[calc(100vh-100px)]'>
      <div className='w-full h-screen'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Arsip Kematian</h2>
          <p className='text-gray-400 text-sm'>Tambah dan kelola arsip (upload gambar, jumlah keluarga, TTL)</p>
        </div>
        <div className='flex-1 overflow-y-auto p-4'>
          <DeathArchiveTable />
        </div>
      </div>
    </div>
  )
}

export default DeathArchive
