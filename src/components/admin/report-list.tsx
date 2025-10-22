'use client';

import React, { useEffect, useState } from 'react';
import { Spinner } from '../ui/shadcn-io/spinner';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Edit, Eye, Pencil, Trash, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import UpdateReportDialog from './report-update';


export default function Report() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
   
    // State untuk dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [selectedReportStatus, setSelectedReportStatus] = useState<string>('');

    const handleOpenDialog = (files: string[]) => {
        setSelectedFiles(files);
        setOpenDialog(true);
    };

    const fetchReports = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`);
            const json = await res.json();

            const data = Array.isArray(json) ? json : json.data || [];
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);


    const filteredReports =
        filter === 'ALL'
            ? reports
            : reports.filter((report) => report.status === filter);

    if (loading) {
        return (
            <div className="justify-center items-center p-15">
                <Spinner variant='circle' />
            </div>
        );
    }


    return (
        <>
            <div className="flex flex-col h-full">
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
                <div className="overflow-y-auto flex-1 p-4 space-y-4 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-260px)]">
                    {filteredReports.length === 0 ? (
                        <div>
                            <p>Tidak ada laporan yang tersedia.</p>
                        </div>
                    ) : (
                        filteredReports.map((report) => (
                            <Card key={report.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold">{report.title}</h3>
                                        <Badge
                                            className={cn(
                                                'text-white',
                                                report.status === 'PENDING' && 'bg-yellow-500',
                                                report.status === 'IN_PROGRESS' && 'bg-blue-500',
                                                report.status === 'COMPLETED' && 'bg-green-500',
                                                report.status === 'DECLINED' && 'bg-red-500'
                                            )}
                                        >
                                            {report.status}
                                        </Badge>
                                    </div>

                                    <p className="text-sm mb-3 line-clamp-3">{report.description}</p>

                                    {report.files.length > 0 && (
                                        <div className="mb-3 relative h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={report.files[0]}
                                                alt="Gambar Laporan"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2 mb-3 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <User className="mr-2 h-4 w-4" />
                                            Dilaporkan oleh: {report.namaLengkap} ({report.NIK})
                                        </div>
                                        <div className="text-gray-600">
                                            Tanggal Laporan:{' '}
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                   

                                    <div className='flex flex-row justify-start gap-5 mt-2'>
                                        <Button
                                            variant='outline'
                                            className=' text-green-600 hover:text-green-700'
                                            onClick={() => {
                                                setSelectedReportId(report.id);
                                                setSelectedReportStatus(report.status);
                                                setOpenEditDialog(true);
                                            }}
                                        >
                                            <Pencil className=" h-7 w-7" strokeWidth={3} />
                                        </Button>
                                        <Button
                                            variant='outline'
                                            className=' text-red-500 hover:text-red-600'
                                            // onClick={() => {
                                            //     setSelectedReportId(report.id);
                                            //     setOpenEditDialog(true);
                                            // }}
                                        >
                                            <Trash className=" h-7 w-7" strokeWidth={3} />
                                        </Button>

                                         {report.files.length > 1 && (
                                        <Button
                                            variant='outline'
                                            onClick={() => handleOpenDialog(report.files)}
                                            className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
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
                    <DialogHeader className="flex justify-between items-center">
                        <DialogTitle>Lihat Gambar</DialogTitle>

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
                onSuccess={fetchReports}
            />
        </>

    );
}
