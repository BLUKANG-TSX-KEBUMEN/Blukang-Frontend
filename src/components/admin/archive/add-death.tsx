'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CalendarIcon, Upload } from "lucide-react"
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { id } from "date-fns/locale"
import Image from 'next/image'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

interface AddDeathDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export default function AddDeathDialog({
    open,
    onOpenChange,
    onSuccess,
}: AddDeathDialogProps) {

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: '',
        tanggal_lahir: '',
        tanggal_kematian: '',
        alamat: '',
        jumlah_keluarga: '',
        keterangan: '',
        foto: null as File | null,
    })
    const [preview, setPreview] = useState<string | null>(null)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setForm({ ...form, foto: file })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Buat FormData untuk kirim data beserta file
            const formData = new FormData()
            formData.append('nama', form.nama)
            formData.append('tanggal_lahir', form.tanggal_lahir)
            formData.append('tanggal_kematian', form.tanggal_kematian)
            formData.append('alamat', form.alamat)
            formData.append('jumlah_keluarga', form.jumlah_keluarga)
            formData.append('keterangan', form.keterangan)
            if (form.foto) formData.append('foto', form.foto)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/arsip-kematian`, {
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

            toast.success(`Data kematian atas nama ${data.data.nama} berhasil ditambahkan`, {
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
            nama: '',
            tanggal_lahir: '',
            tanggal_kematian: '',
            alamat: '',
            jumlah_keluarga: '',
            keterangan: '',
            foto: null,

        })
        setPreview(null)
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[825px]">
                <DialogHeader>
                    <DialogTitle>Tambah Data Kematian</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor="nama">Nama</Label>
                            <Input
                                id="nama"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input
                                id="alamat"
                                name="alamat"
                                value={form.alamat}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        {/* Tanggal Lahir */}
                        <div className="grid gap-2">
                            <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${!form.tanggal_lahir && "text-muted-foreground"
                                            }`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {form.tanggal_lahir
                                            ? format(new Date(form.tanggal_lahir), "dd MMMM yyyy", { locale: id })
                                            : "Pilih tanggal lahir"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.tanggal_lahir ? new Date(form.tanggal_lahir) : undefined}
                                        onSelect={(date) =>
                                            setForm({
                                                ...form,
                                                tanggal_lahir: date ? date.toLocaleDateString("en-CA") : "",
                                            })
                                        }
                                        locale={id}
                                        captionLayout='dropdown'

                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Tanggal Kematian */}
                        <div className="grid gap-2">
                            <Label htmlFor="tanggal_kematian">Tanggal Kematian</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${!form.tanggal_kematian && "text-muted-foreground"
                                            }`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {form.tanggal_kematian
                                            ? format(new Date(form.tanggal_kematian), "dd MMMM yyyy", { locale: id })
                                            : "Pilih tanggal kematian"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.tanggal_kematian ? new Date(form.tanggal_kematian) : undefined}
                                        onSelect={(date) =>
                                            setForm({
                                                ...form,
                                                tanggal_kematian: date ? date.toLocaleDateString("en-CA") : "",
                                            })
                                        }
                                        locale={id}
                                        captionLayout='dropdown'
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 items-start'>
                        <div className='grid gap-2'>
                            <Label htmlFor="jumlah_keluarga">Jumlah Keluarga</Label>
                            <Input
                                id="jumlah_keluarga"
                                name="jumlah_keluarga"
                                type="number"
                                value={form.jumlah_keluarga}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Textarea
                                id="keterangan"
                                name="keterangan"
                                value={form.keterangan}
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                    <div className="grid gap-2">
                        <Label htmlFor="foto">Foto</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="foto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e)
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file)
                                        setPreview(previewUrl)
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
