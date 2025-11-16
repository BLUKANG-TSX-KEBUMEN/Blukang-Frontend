'use client';

import React, {  useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import Image from 'next/image';
import { Eye, Pencil, Trash, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import UpdateReportDialog from './report-update';
import DeleteReportDialog from './report-delete';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';


interface ReportProps {
    reports: Report[];
    loading: boolean;
    fetchReports: () => void;
}

export default function Report({ reports, loading, fetchReports }: ReportProps) {
    const [filter, setFilter] = useState<string>('ALL');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [selectedReportStatus, setSelectedReportStatus] = useState<string>('');
    const [selectedResponse, setSelectedResponse] = useState<string>('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDialog = (files: string[]) => {
        setSelectedFiles(files);
        setOpenDialog(true);
    };


    const filteredReports =
        filter === 'ALL'
            ? reports
            : reports.filter((report) => report.status === filter);

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                {/* Skeleton filter bar */}
                <div className="flex gap-2 mb-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-9 w-[120px] rounded-lg" />
                    ))}
                </div>

                {/* Skeleton cards */}
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="w-full">
                        <CardContent className="p-4 space-y-3">
                            {/* Title + Status */}
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>

                            {/* Description */}
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-2/3" />

                            {/* Info section */}
                            <div className="space-y-2 mt-4">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-2/5" />
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 mt-4">
                                {[...Array(3)].map((_, j) => (
                                    <Skeleton key={j} className="h-9 w-9 rounded-md" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }



    return (
        <>
            <div className="relative flex flex-col ">
                {/* Filter Button */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? status === 'ALL'
                                        ? 'bg-blue-600 text-white'
                                        : status === 'PENDING'
                                            ? 'bg-yellow-600 text-white'
                                            : status === 'IN_PROGRESS'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {status === 'ALL'
                                    ? `Semua (${reports.length})`
                                    : status === 'PENDING'
                                        ? `Pending (${reports.filter((r) => r.status === 'PENDING').length})`
                                        : status === 'IN_PROGRESS'
                                            ? `Dalam Proses (${reports.filter((r) => r.status === 'IN_PROGRESS').length})`
                                            : `Selesai (${reports.filter((r) => r.status === 'COMPLETED' || r.status === 'RESOLVED').length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Daftar Report */}
                <div className="overflow-y-auto flex-1 p-4 space-y-4 max-h-[calc(100vh-260px)] lg:max-h-[calc(100vh-210px)]">
                    {filteredReports.length === 0 ? (
                        <div>
                            <p>Tidak ada laporan yang tersedia.</p>
                        </div>
                    ) : (
                        filteredReports.map((report) => (
                            <Card key={report.id} className="w-full p-3">
                                <CardContent className="px-4">
                                    <div className='flex items-center justify-end'>

                                    </div>

                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold">{report.title}</h3>
                                        <Badge
                                            className={cn(
                                                'text-white ',
                                                report.status === 'PENDING' && 'bg-yellow-500',
                                                report.status === 'IN_PROGRESS' && 'bg-blue-500',
                                                report.status === 'COMPLETED' && 'bg-green-500',
                                                report.status === 'DECLINED' && 'bg-red-500'
                                            )}
                                        >
                                            {report.status === 'IN_PROGRESS'
                                                ? 'Dalam Proses'
                                                : report.status === 'PENDING'
                                                    ? 'Pending'
                                                    : report.status === 'COMPLETED'
                                                        ? 'Selesai'
                                                        : report.status === 'DECLINED'
                                                            ? 'Ditolak'
                                                            : report.status}
                                        </Badge>
                                    </div>

                                    <p className="text-sm mb-3 line-clamp-3">{report.description}</p>

                                    {/* {report.files.length > 0 && (
                                        <div className="mb-3 relative h-50 w-full rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={report.files[0]}
                                                alt="Gambar Laporan"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )} */}

                                    <div className="space-y-3 mb-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2 font-medium">
                                            <User className="h-5 w-5 text-black flex-shrink-0" strokeWidth={2.5} />
                                            <span>Pelapor: {report.namaLengkap} ({report.NIK})</span>
                                        </div>

                                        <div className="flex items-center gap-2 font-medium">
                                            <span className="text-gray-600">Waktu:</span>
                                            <span>
                                                {new Date(report.createdAt).toLocaleDateString()} -{" "}
                                                {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>

                                        </div>

                                        <div className="flex items-start gap-2">
                                            <span className="font-medium text-gray-600 flex-shrink-0">Respon:</span>
                                            <span
                                                className={cn(
                                                    "font-medium",
                                                    report.response ? "text-gray-600" : "italic text-red-400"
                                                )}
                                            >
                                                {report.response || "Belum ada respon"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-600 flex-shrink-0">Koordinat:</span>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* tampilkan koordinat singkat */}
                                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">
                                                    {report.coordinates
                                                        ? report.coordinates.length > 9
                                                            ? report.coordinates.substring(0, 9) + "..."
                                                            : report.coordinates
                                                        : "-"}
                                                </span>

                                            </div>
                                            {report.coordinates && (
                                                <CopyButton
                                                    content={`https://www.google.com/maps?q=${report.coordinates}`}
                                                    onCopy={() =>
                                                        toast.success("Link Google Maps berhasil disalin ke clipboard!", {
                                                            style: { backgroundColor: "#22c55e", color: "white" },
                                                        })
                                                    }
                                                    className="bg-blue-600 text-white hover:bg-blue-700 px-2 py-1 rounded-md text-xs transition-all duration-200"
                                                />
                                            )}
                                        </div>
                                    </div>



                                    <div className='flex flex-row justify-start gap-5 mt-2'>
                                        <Button
                                            variant='outline'
                                            className=' text-green-600 hover:text-green-700 hover:scale-120 transition-all duration-200'
                                            onClick={() => {
                                                setSelectedReportId(report.id);
                                                setSelectedReportStatus(report.status);
                                                setSelectedResponse(report.response || '');
                                                setOpenEditDialog(true);
                                            }}
                                        >
                                            <Pencil className=" h-7 w-7" strokeWidth={3} />
                                        </Button>
                                        <Button
                                            variant='outline'
                                            className=' text-red-500 hover:text-red-600 hover:scale-120 transition-all duration-200'
                                            onClick={() => {
                                                setSelectedReportId(report.id);
                                                setOpenDeleteDialog(true);
                                            }}
                                        >
                                            <Trash className=" h-7 w-7" strokeWidth={3} />
                                        </Button>

                                        {report.files.length > 0 && (
                                            <Button
                                                variant='outline'
                                                onClick={() => handleOpenDialog(report.files)}
                                                className="text-blue-600 hover:text-blue-700 flex items-center text-sm hover:scale-120 transition-all duration-200"
                                            >
                                                <Eye className="inline-block h-7 w-7" />

                                            </Button>
                                        )}
                                    </div>


                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>


            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="fixed z-[9999] max-w-3xl max-h-[80vh] overflow-y-auto background-white">
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle>Lihat Gambar</DialogTitle>
                        <DialogClose>
                            <X className='h-5 w-5 cursor-pointer hover:text-red-500' />
                        </DialogClose>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        {selectedFiles.map((file, index) => (
                            <Image
                                key={index}
                                src={file}
                                alt={`Gambar ${index + 1}`}
                                width={400}
                                height={900}
                            />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <UpdateReportDialog
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
                reportId={selectedReportId}
                reportStatus={selectedReportStatus}
                reportResponse={selectedResponse}
                onSuccess={fetchReports}
            />

            <DeleteReportDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                reportId={selectedReportId}
                onSuccess={fetchReports}
            />
        </>

    );
}
