'use client'

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import UpdateReportDialog from './report-update';
import DeleteReportDialog from './report-delete';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';

interface ReportDetailProps {
    open: boolean;
    reportId: number | null;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
}

export default function ReportDetail({ reportId, onOpenChange, open, onClose }: ReportDetailProps) {
    const [reportDetail, setReportDetail] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [selectedReportStatus, setSelectedReportStatus] = useState<string>('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<string>('');

    const fetchReportDetail = async () => {
        if (!reportId) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/${reportId}`);
            const data = await res.json();
            if (data.success) {
                setReportDetail(data.data);
            }
            console.log('Fetched report detail:', data);
        } catch (error) {
            console.error('Fetch report detail failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reportId) fetchReportDetail();
    }, [reportId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg sm:max-w-2xl sm:max-h-[99vh] overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center gap-5 text-center p-6 text-gray-500">
                        <Spinner variant='circle' /> Memuat detail laporan...
                    </div>
                ) : reportDetail ? (
                    <>
                        <DialogHeader className='flex flex-row justify-between'>
                            <DialogTitle className="text-xl font-semibold">{reportDetail.title}</DialogTitle>
                            <Badge
                                className={cn(
                                    'text-white w-fit',
                                    reportDetail.status === 'PENDING' && 'bg-yellow-500',
                                    reportDetail.status === 'IN_PROGRESS' && 'bg-blue-500',
                                    reportDetail.status === 'COMPLETED' && 'bg-green-500',
                                    reportDetail.status === 'DECLINED' && 'bg-red-500'
                                )}
                            >
                                {reportDetail.status === 'IN_PROGRESS'
                                    ? 'Dalam Proses'
                                    : reportDetail.status === 'PENDING'
                                        ? 'Pending'
                                        : reportDetail.status === 'COMPLETED'
                                            ? 'Selesai'
                                            : 'Ditolak'}
                            </Badge>
                        </DialogHeader>

                        <div className="space-y-3 text-sm text-gray-700 grid grid-cols-2">

                            <div><span className="font-medium">Pelapor:</span> {reportDetail.namaLengkap}</div>
                            <div><span className="font-medium">NIK:</span> {reportDetail.NIK}</div>
                            <div><span className="font-medium">Deskripsi:</span> {reportDetail.description}</div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-600 flex-shrink-0">Koordinat:</span>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* tampilkan koordinat singkat */}
                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">
                                        {reportDetail.coordinates
                                            ? reportDetail.coordinates.length > 9
                                                ? reportDetail.coordinates.substring(0, 9) + "..."
                                                : reportDetail.coordinates
                                            : "-"}
                                    </span>

                                </div>
                                {reportDetail.coordinates && (
                                    <CopyButton
                                        content={`https://www.google.com/maps?q=${reportDetail.coordinates}`}
                                        onCopy={() =>
                                            toast.success("Link Google Maps berhasil disalin ke clipboard!", {
                                                style: { backgroundColor: "#22c55e", color: "white" },
                                            })
                                        }
                                        className="bg-blue-600 text-white hover:bg-blue-700 px-2 py-1 rounded-md text-xs transition-all duration-200"
                                    />
                                )}
                            </div>
                            <div>
                                <span className="font-medium">Respon:</span>{' '}
                                {reportDetail.response ? reportDetail.response : <i className="text-red-400">Belum ada respon</i>}
                            </div>
                            <div className="font-medium">
                                Dibuat: {new Date(reportDetail.createdAt).toLocaleString('id-ID')}
                            </div>
                        </div>

                        <div className='flex flex-row justify-between'>

                            <div className='flex flex-row justify-start gap-5 '>
                                <Button
                                    variant='outline'
                                    className=' text-green-600 hover:text-green-700 hover:scale-120 transition-all duration-200'
                                    onClick={() => {
                                        setSelectedReportId(reportDetail.id);
                                        setSelectedReportStatus(reportDetail.status);
                                        setSelectedResponse(reportDetail.response || '');
                                        setOpenEditDialog(true);
                                    }}
                                >
                                    <Pencil className="h-7 w-7" strokeWidth={3} />
                                </Button>
                                <Button
                                    variant='outline'
                                    className=' text-red-500 hover:text-red-600 hover:scale-120 transition-all duration-200'
                                    onClick={() => {
                                        setSelectedReportId(reportDetail.id);
                                        setOpenDeleteDialog(true);
                                    }}
                                >
                                    <Trash className=" h-7 w-7" strokeWidth={3} />
                                </Button>

                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false);
                                    onClose();
                                }}
                            >
                                Tutup
                            </Button>
                        </div>



                        {reportDetail?.files && reportDetail.files.length > 0 && (
                            <div className="flex flex-col mt-4 max-h-[400px] overflow-y-auto ">
                                {reportDetail.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative w-full aspect-square rounded-lg border border-gray-200"
                                    >
                                        <Image
                                            src={file}
                                            alt={`Report Image ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-fit rounded-lg "
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center p-6 text-gray-500">
                        Data laporan tidak ditemukan.
                    </div>

                )}

            </DialogContent>

            <UpdateReportDialog
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
                reportId={selectedReportId}
                reportStatus={selectedReportStatus}
                reportResponse={selectedResponse}
                onSuccess={() => {
                    setOpenEditDialog(false);
                    fetchReportDetail();
                }}
            />

            <DeleteReportDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                reportId={selectedReportId}
                onSuccess={() => {
                    setOpenDeleteDialog(false);
                    onOpenChange(false);
                    onClose();
                }}
            />
        </Dialog>
    );
}

