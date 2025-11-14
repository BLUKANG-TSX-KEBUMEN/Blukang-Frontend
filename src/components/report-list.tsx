'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { CopyButton } from './ui/shadcn-io/copy-button'
import { Skeleton } from './ui/skeleton'
import { Dialog, DialogClose, DialogContent } from './ui/dialog'
import { ArrowLeft, ArrowRight, Eye, X } from 'lucide-react'



const ReportListSkeleton = () => {
    return (
        <div className="flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start gap-4"
                >
                    <Skeleton className="w-16 h-16 rounded-md" />

                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>

                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[85%]" />
                    </div>
                </div>
            ))}
        </div>
    )
}

const ReportList = () => {
    const [laporanData, setLaporanData] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [previewImgs, setPreviewImgs] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)


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
                console.log(data)

                setLaporanData(data.data || [])

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (loading) return <ReportListSkeleton />


    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>
    }

    if (laporanData.length === 0) {
        return <div className="text-center text-gray-500 py-10">Belum ada laporan yang dikirim.</div>
    }

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === previewImgs.length - 1 ? 0 : prev + 1
        )
    }

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? previewImgs.length - 1 : prev - 1
        )
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
                        <div
                            onClick={() => {
                                setPreviewImgs(item.files)
                                setCurrentIndex(0)
                            }}
                            className="relative w-16 h-16 cursor-pointer group"
                        >
                            <Image
                                src={item.files[0]}
                                alt={item.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-md"
                            />

                            {/* Overlay blur + icon Eye */}
                            <div
                                className="
        absolute inset-0 rounded-md 
        bg-black/40 
        flex items-center justify-center
        transition-all

        opacity-100        /* MOBILE: selalu terlihat */
        sm:opacity-0       /* DESKTOP: default hilang */
        sm:group-hover:opacity-100  /* DESKTOP: muncul saat hover */

        backdrop-blur-sm
    "
                            >
                                <Eye className="text-white w-6 h-6" />
                            </div>
                        </div>
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
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600 flex-shrink-0">Koordinat:</span>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* tampilkan koordinat singkat */}
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">
                                    {item.coordinates
                                        ? item.coordinates.length > 9
                                            ? item.coordinates.substring(0, 9) + "..."
                                            : item.coordinates
                                        : "-"}
                                </span>

                            </div>
                            {item.coordinates && (
                                <CopyButton
                                    content={`https://www.google.com/maps?q=${item.coordinates}`}
                                    onCopy={() =>
                                        toast.success("Link Google Maps berhasil disalin ke clipboard!", {
                                            style: { backgroundColor: "#22c55e", color: "white" },
                                        })
                                    }
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-2 py-1 rounded-md text-xs transition-all duration-200"
                                />
                            )}
                        </div>
                        <p className="mt-2">{item.description}</p>
                    </div>
                </div>
            ))}

            <Dialog open={previewImgs.length > 0} onOpenChange={() => setPreviewImgs([])}>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                    <DialogClose
                        className="absolute top-3 right-4 z-50 bg-black/50 hover:bg-black/70 text-red-500 
               rounded-full p-2  transition backdrop-blur-md"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </DialogClose>
                    {previewImgs.length > 0 && (
                        <div className="relative w-full">
                            <Image
                                src={previewImgs[currentIndex]}
                                alt="Preview"
                                width={800}
                                height={800}
                                className="w-full h-auto rounded-lg"
                            />

                            {/* Prev Button */}
                            <button
                                onClick={prevImage}
                                className="
        absolute left-3 top-1/2 -translate-y-1/2
        bg-black/40 hover:bg-black/60 
        text-white rounded-full 
        p-2 sm:p-3
        backdrop-blur-sm 
        active:scale-90 transition
    "
                            >
                                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                            {/* Next Button */}
                            <button
                                onClick={nextImage}
                                className="
        absolute right-3 top-1/2 -translate-y-1/2
        bg-black/40 hover:bg-black/60 
        text-white rounded-full 
        p-2 sm:p-3
        backdrop-blur-sm 
        active:scale-90 transition
    "
                            >
                                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>

                            {/* Counter */}
                            <div
                                className="
        absolute bottom-4 right-4
        bg-black/50 text-white text-xs sm:text-sm 
        px-3 py-1 rounded-full backdrop-blur-sm
    "
                            >
                                {currentIndex + 1} / {previewImgs.length}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ReportList
