'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

interface DeleteNewsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsId: number | null
    onSuccess: () => void
}

export default function NewsDeleteDialog({
    open,
    onOpenChange,
    newsId,
    onSuccess,
}: DeleteNewsDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async (newsId: number) => {
        if (!newsId) return
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articles/${newsId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data?.message || 'Gagal menghapus data.')
            }

            toast.success('Berita berhasil dihapus.', {
                style: { backgroundColor: '#22c55e', color: 'white' },
            })
            onOpenChange(false)
            onSuccess()

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Gagal menambahkan data.')
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apakah anda yakin ingin menghapus data berita ini?</DialogTitle>
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
                        onClick={() => handleDelete(newsId || 0)}
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