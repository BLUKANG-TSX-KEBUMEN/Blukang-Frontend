'use client'

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Upload } from "lucide-react";

interface ImageAddProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function ImageAdd({
    open,
    onOpenChange,
    onSuccess,
}: ImageAddProps) {

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        imageSlider: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setForm({ ...form, imageSlider: file })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData()
            if (form.imageSlider) formData.append('imageSlider', form.imageSlider)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/contents`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                body: formData,
            })

            if (!res.ok) {
                throw new Error('Gagal menambahkan data')
            }

            toast.success('Image berhasil ditambahkan',
                { style: { backgroundColor: '#22c55e', color: 'white' }, }
            )
            onSuccess()
            setPreview(null)
            onOpenChange(false)

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
                <DialogTitle>Tambah Gambar</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                        <label className="block mb-2 font-medium">Pilih Gambar</label>

                        <div className="flex items-center gap-3">
                            <Input
                                type="file"
                                accept="image/*"

                                onChange={(e) => {
                                    handleFileChange(e)
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onload = () => {
                                            setPreview(reader.result as string)
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <Upload className="h-5 w-5 text-gray-500" />

                        </div>

                        {preview && (
                            <div className="mt-2 flex justify-center">
                                <Image
                                    src={preview}
                                    alt="Preview foto"
                                    className="rounded-lg border border-gray-300 w-48 h-48 object-cover"
                                    width={500}
                                    height={500}
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false)
                                setPreview(null)
                            }}
                            className='hover:scale-105 transition-all duration-200'
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? <Spinner variant="circle" /> : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}