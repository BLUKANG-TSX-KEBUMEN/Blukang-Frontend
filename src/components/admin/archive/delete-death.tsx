'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import React from "react"
import { toast } from "sonner"

interface DeleteDeathDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    deathId: number | null
    onSuccess: () => void
}

export default function DeleteDeathDialog({
    open,
    onOpenChange,
    deathId,
    onSuccess,
}: DeleteDeathDialogProps) {
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async (deathId: number) => {
        if (!deathId) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/arsip-kematian/${deathId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || 'Gagal menghapus data.');
            }
            toast.success('Data kematian berhasil dihapus.', {
                style: { backgroundColor: '#22c55e', color: 'white' },
            });
            onOpenChange(false);
            onSuccess();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Gagal menambahkan data.')
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apakah anda yakin ingin menghapus data kematian ini?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            disabled={loading}
                            className="hover:scale-105"
                        >
                            Batal
                        </Button>
                    </DialogClose>
                
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete(deathId || 0)}
                            disabled={loading}
                            className="hover:scale-105"
                        >
                            {loading ? <Spinner variant="circle" /> : 'Hapus'}
                            
                        </Button>
 
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}