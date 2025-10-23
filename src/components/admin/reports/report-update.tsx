'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface UpdateReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportId: number | null;
    reportStatus?: string;
    reportResponse?: string;
    onSuccess: () => void;
}

export default function UpdateReportDialog({
    open,
    onOpenChange,
    reportId,
    reportStatus,
    reportResponse,
    onSuccess,
}: UpdateReportDialogProps) {
    const [status, setStatus] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && reportStatus && reportResponse) {
            setStatus(reportStatus);
            setResponse(reportResponse);
        }
    }, [open, reportStatus, reportResponse]);

    const handleUpdate = async () => {
        if (!reportId) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/${reportId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                body: JSON.stringify({ status, response }),
            });

            const data = await res.json();
            console.log('Update response:', data);
            if (!res.ok) {
                throw new Error('Gagal memperbarui laporan');
            }

            toast.success(`Laporan ${data.data.title} berhasil diperbarui`, {
                style: { backgroundColor: "#22c55e", color: "white" },
            });


            onOpenChange(false);
            onSuccess(); // refetch reports
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className='flex flex-row justify-between'>
                    <DialogTitle>Update Status Laporan</DialogTitle>
                    <DialogClose onClick={() => {
                        setStatus('')
                        setResponse('')
                    }}>
                        <X className='h-5 w-5 cursor-pointer hover:text-red-500' />
                    </DialogClose>
                </DialogHeader>

                <div className="space-y-4">
                    <div className='space-y-2'>
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">Dalam Proses</SelectItem>
                                <SelectItem value="COMPLETED">Selesai</SelectItem>
                                <SelectItem value="DECLINED">Tolak</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label>Respon</Label>
                        <Textarea
                            placeholder="Masukkan respon terkait laporan..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>

                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200"
                    >
                        {loading ? <Spinner variant="circle" /> : 'Simpan'}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
