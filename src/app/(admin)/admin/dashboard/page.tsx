'use client'

import StatsSection from '@/components/admin/dashboard/stats'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Dashboard Statistik</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <StatsSection />
      </div>

    </div>
  )
}

export default AdminDashboard
