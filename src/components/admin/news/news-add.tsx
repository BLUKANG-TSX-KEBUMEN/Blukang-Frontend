'use client'

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Spinner } from '@/components/ui/shadcn-io/spinner'


interface AddNewsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export default function NewsAdd({
    open,
    onOpenChange,
    onSuccess,
}: AddNewsDialogProps) {

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        bodyArticle: '',
        image: null as File | null,
    })
    const [preview, setPreview] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setForm({ ...form, image: file })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('bodyArticle', form.bodyArticle)
            if (form.image) formData.append('image', form.image)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articles`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                body: formData,
            })

            if (!res.ok) {
                throw new Error('Gagal menambahkan data')
            }

            const data = await res.json()

            toast.success(`Berita dengan Judul ${data.data.nama} berhasil ditambahkan`, {
                style: { backgroundColor: '#22c55e', color: 'white' },
            })

            onSuccess()
            resetForm()
            onOpenChange(false)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Gagal menambahkan data.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setForm({
            title: '',
            bodyArticle: '',
            image: null,
        })
        setPreview(null)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Tambah Berita</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul Berita</Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bodyArticle">Isi Berita</Label>
                            <Textarea
                                id="bodyArticle"
                                name="bodyArticle"
                                value={form.bodyArticle}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <Label htmlFor="image">Sampul Berita</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="image"
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
                            />
                            <Upload className="h-5 w-5 text-gray-500" />
                        </div>

                        {/* preview muncul jika ada */}
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
                                resetForm()
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