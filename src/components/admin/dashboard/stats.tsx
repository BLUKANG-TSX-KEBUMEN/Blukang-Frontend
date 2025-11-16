'use client'

import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BarChart3, CheckCircle, Clock, FileText, Newspaper } from "lucide-react"

interface StatsResponse {
    arsipKematian: { count: number }
    articles: { count: number }
    reports: {
        all: number
        pending: number
        inProgress: number
        completed: number
    }
}

export default function StatisticsSection() {
    const [stats, setStats] = useState<StatsResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/statistics`)
                const data = await res.json()

   

                setStats(data.data)  // ← FIX DI SINI
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="p-4">
                            <Skeleton className="h-6 w-32 mb-3" />
                            <Skeleton className="h-10 w-20" />
                        </Card>
                    ))}

                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="p-4 ">
                            <Skeleton className="h-8 w-32 mb-3" />
                            <Skeleton className="h-40 w-full" />
                        </Card>
                    ))}
                </div>

                <Card className="p-4">
                    <Skeleton className="h-70 w-full" />
                </Card>
            </div>

        )
    }

    if (!stats) return <p className="text-red-500">Failed to load statistics.</p>

    const { arsipKematian, articles, reports } = stats



    return (
        <div className="space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">

            {/* ========== GRID CARD ========= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Arsip Kematian</CardTitle>
                            <FileText className="w-5 h-5 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <p className="text-4xl font-bold text-purple-600">{arsipKematian.count}</p>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                Total Arsip
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Artikel</CardTitle>
                            <Newspaper className="w-5 h-5 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <p className="text-4xl font-bold text-blue-600">{articles.count}</p>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                Berita
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Total Laporan</CardTitle>
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <p className="text-4xl font-bold text-emerald-600">{reports.all}</p>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                Semua Status
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* ========== RING SUMMARY ========== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Card className="p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-yellow-50 to-white">
                    <div className="flex items-center justify-between mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            {reports.pending}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-700">{reports.pending}</p>
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                            {((reports.pending / reports.all) * 100).toFixed(1)}% dari total
                        </Badge>
                    </div>
                </Card>

                <Card className="p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                            {reports.inProgress}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Diproses</p>
                    <p className="text-2xl font-semibold text-blue-700">{reports.inProgress}</p>
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                            {((reports.inProgress / reports.all) * 100).toFixed(1)}% dari total
                        </Badge>
                    </div>
                </Card>

                <Card className="p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <Badge className="bg-green-500 hover:bg-green-600">
                            {reports.completed}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Selesai</p>
                    <p className="text-2xl font-semibold text-green-700">{reports.completed}</p>
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                            {((reports.completed / reports.all) * 100).toFixed(1)}% dari total
                        </Badge>
                    </div>
                </Card>

                <Card className="p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="w-5 h-5 text-slate-600" />
                        <Badge variant="secondary">
                            Total
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Laporan</p>
                    <p className="text-2xl font-semibold text-slate-700">{reports.all}</p>
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">
                            100% keseluruhan
                        </Badge>
                    </div>
                </Card>

            </div>

            {/* ========== PROGRESS BAR ========= */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Progress Penyelesaian Laporan</h3>
                    <Badge variant="outline" className="text-sm">
                        Status Overview
                    </Badge>
                </div>

                <div className="space-y-5">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                    Pending
                                </Badge>
                                <span className="text-sm font-medium">{reports.pending} laporan</span>
                            </div>
                            <span className="text-sm font-semibold text-yellow-600">
                                {((reports.pending / reports.all) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <Progress
                            value={(reports.pending / reports.all) * 100}
                            className="h-3 bg-yellow-100 "
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500 hover:bg-blue-600">
                                    Diproses
                                </Badge>
                                <span className="text-sm font-medium">{reports.inProgress} laporan</span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                                {((reports.inProgress / reports.all) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <Progress
                            value={(reports.inProgress / reports.all) * 100}
                            className="h-3 bg-blue-100"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-green-500 hover:bg-green-600">
                                    Selesai
                                </Badge>
                                <span className="text-sm font-medium">{reports.completed} laporan</span>
                            </div>
                            <span className="text-sm font-semibold text-green-600">
                                {((reports.completed / reports.all) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <Progress
                            value={(reports.completed / reports.all) * 100}
                            className="h-3 bg-green-100"
                        />
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Progress</span>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-green-700 border-green-300">
                            {reports.completed} Selesai
                        </Badge>
                        <Badge variant="outline" className="text-slate-700 border-slate-300">
                            {reports.pending + reports.inProgress} Tersisa
                        </Badge>
                    </div>
                </div>
            </Card>

        </div>
    )
}
