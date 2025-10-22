'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

interface UpdateReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportId: number | null;
    reportStatus?: string;
    onSuccess: () => void;
}

export default function UpdateReportDialog({
    open,
    onOpenChange,
    reportId,
    reportStatus,
    onSuccess,
}: UpdateReportDialogProps) {
    const [status, setStatus] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

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
                <DialogHeader>
                    <DialogTitle>Update Status Laporan</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className='space-y-2'>
                        <Label>Status</Label>
                        <Select value={reportStatus} onValueChange={setStatus}>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleUpdate} disabled={loading} className='bg-green-600 hover:bg-green-700 text-white'>
                        {loading ? <Spinner variant="circle" /> : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
