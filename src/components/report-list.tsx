'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const ReportList = () => {
    const [laporanData, setLaporanData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`, {
                    cache: 'no-store',
                })
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data?.message?.message || data?.message || 'Gagal memuat laporan')
                }

                setLaporanData(data.data || [])
            } catch (err: any) {
                console.error(err)
                setError(err.message || 'Gagal memuat data laporan')
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700'
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-700'
            case 'COMPLETED':
                return 'bg-emerald-100 text-emerald-700'
            case 'REJECTED':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'Pending'
            case 'IN_PROGRESS':
                return 'Dalam Proses'
            case 'COMPLETED':
                return 'Selesai'
            case 'REJECTED':
                return 'Ditolak'
            default:
                return status
        }
    }

    if (loading) {
        return <div className="text-center text-gray-500 py-10">Memuat data laporan...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>
    }

    if (laporanData.length === 0) {
        return <div className="text-center text-gray-500 py-10">Belum ada laporan yang dikirim.</div>
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
                    Total: {laporanData.length}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm">
                    Pending: {laporanData.filter((r) => r.status === 'PENDING').length}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                    Dalam Proses: {laporanData.filter((r) => r.status === 'IN_PROGRESS').length}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                    Selesai: {laporanData.filter((r) => r.status === 'COMPLETED').length}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-700 border border-red-200 shadow-sm">
                    Ditolak: {laporanData.filter((r) => r.status === 'REJECTED').length}
                </span>
            </div>
            {laporanData.map((item, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start gap-4"
                >

                    {item.files && item.files.length > 0 ? (
                        <Image
                            src={item.files[0]}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                    )}

                    {/* Info laporan */}
                    <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                        <div className="flex items-start justify-between">
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <span
                                className={cn(
                                    "px-2 py-0.5 text-xs font-medium rounded-full",
                                    getStatusColor(item.status)
                                )}
                            >
                                {getStatusLabel(item.status)}
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">📍 {item.coordinates}</p>
                        <p className="mt-2">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ReportList
