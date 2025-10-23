'use client'

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import React from 'react'
import { toast } from 'sonner';



interface UpdateReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reportId: number | null;
    onSuccess: () => void;
}

export default function DeleteReportDialog({
    open,
    onOpenChange,
    reportId,
    onSuccess,
}: UpdateReportDialogProps) {

    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        if (!reportId) return;

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Gagal menghapus laporan');
            }

            // Tutup dialog lebih dulu biar tidak bentrok dengan re-render
            onOpenChange(false);

            toast.success("Laporan berhasil dihapus", {
                style: { backgroundColor: '#22c55e', color: 'white' },
            });

            // Baru refetch data
            onSuccess();
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle className='text-center'>Yakin ingin menghapus laporan ini?</DialogTitle>
                </DialogHeader>
                <div className="mb-4 text-center">
                    Laporan yang dihapus tidak dapat dikembalikan lagi.
                </div>
                <DialogFooter>


                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-500 text-white hover:bg-red-600 hover:text-white hover:scale-105 transition-all duration-200"
                    >
                        {loading ? <Spinner variant="circle" /> : 'Hapus'}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
