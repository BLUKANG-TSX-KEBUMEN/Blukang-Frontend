'use client'

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

interface EditNewsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsId: number | null
    title: string
    bodyArticle?: string
    imageArticle?: string
    onSuccess: () => void
}

export default function EditNewsDialog({
    open,
    onOpenChange,
    newsId,
    title,
    bodyArticle,
    imageArticle,
    onSuccess,
}: EditNewsDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        bodyArticle: "",
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Set data awal saat dialog terbuka
    useEffect(() => {
        if (open) {
            setFormData({
                title: title || "",
                bodyArticle: bodyArticle || "",
            })
            setPreviewUrl(imageArticle || null)
            setImageFile(null)
        }
    }, [open, title, bodyArticle, imageArticle])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleUpdate = async () => {
        if (!newsId) return

        setLoading(true)
        try {
            const form = new FormData()
            form.append("title", formData.title)
            form.append("bodyArticle", formData.bodyArticle)
            if (imageFile) form.append("image", imageFile)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/articles/${newsId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
                },
                body: form,
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message || "Gagal memperbarui berita")
            }

            toast.success(`Berita "${data.data.title}" berhasil diperbarui`, {
                style: { backgroundColor: "#22c55e", color: "white" },
            })

            onSuccess()
            onOpenChange(false)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Terjadi kesalahan saat memperbarui data.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Berita</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Judul</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Masukkan judul berita"
                        />
                    </div>

                    {/* Body */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Isi Berita</label>
                        <Textarea
                            name="bodyArticle"
                            value={formData.bodyArticle}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tulis isi berita..."
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Sampul Berita</label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {previewUrl && (
                            <div className="mt-2">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    width={400}
                                    height={200}
                                    className="rounded-md border object-cover w-full h-48"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button onClick={handleUpdate} disabled={loading}  className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200">
                        {loading ? <Spinner variant="circle"/> : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
