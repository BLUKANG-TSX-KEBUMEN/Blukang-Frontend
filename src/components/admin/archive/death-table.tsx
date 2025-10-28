"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Loader2, Plus, Search, X, ArrowUpDown, Trash, Pencil, FileSpreadsheet } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"


export default function DeathArchiveTable() {
    const [data, setData] = useState<DeathRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalData, setTotalData] = useState(0)
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")
    const [openExportDialog, setOpenExportDialog] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

    // ✅ Fetch data dengan pagination dan sort
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/arsip-kematian?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}&sortBy=tanggal_kematian&sortOrder=${sortOrder}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            )

            console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/arsip-kematian?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}&sortBy=tanggal_kematian&sortOrder=${sortOrder}`)

            if (!res.ok) throw new Error("Gagal mengambil data")
            const result = await res.json()
            console.log(result)

            setData(result.data.data || [])
            setTotalData(result.data.total || 0)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [currentPage, itemsPerPage, search, sortOrder])

    const fetchByDate = async () => {
        if (!selectedDate) {
            alert("Pilih tanggal kematian terlebih dahulu")
            return
        }

        console.log("Tanggal dipilih:", selectedDate)

        const formatted = format(selectedDate, "yyyy-MM-dd", { locale: id });
        console.log("Tanggal dipilih:", formatted)

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/arsip-kematian/by-date?date=${formatted}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            )

            if (!res.ok) throw new Error("Gagal mengambil data")

            const result = await res.json()
            console.log("Hasil fetch:", result)

            // ✅ Karena struktur JSON berlapis, data aslinya ada di result.data.data.data
            const deathData = result?.data?.data?.data || []

            if (!deathData.length) {
                alert("Tidak ada data untuk tanggal tersebut")
                return
            }

            // ✅ Format data untuk diekspor ke Excel
            const exportData = deathData.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (item: any, index: number) => ({
                    No: index + 1,
                    Nama: item.nama,
                    "Tanggal Lahir": new Date(item.tanggal_lahir).toLocaleDateString("id-ID"),
                    "Tanggal Kematian": new Date(item.tanggal_kematian).toLocaleDateString("id-ID"),
                    Alamat: item.alamat,
                    "Jumlah Keluarga": item.jumlah_keluarga,
                    Keterangan: item.keterangan,
                }))

            // ✅ Buat file Excel
            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Arsip Kematian")

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
            saveAs(blob, `arsip_kematian_${formatted}.xlsx`)
            toast.success(`Arsip kematian untuk tanggal ${formatted} berhasil diekspor `,
                {
                    style: {
                        backgroundColor: "#22c55e",
                        color: "white",
                    }
                }
            )
            setSelectedDate(null)
            setOpenExportDialog(false)
        } catch (err) {
            console.error("Terjadi kesalahan:", err)
            alert("Gagal mengekspor data")
        }
    }



    // Fetch saat page, limit, search, atau sort berubah
    useEffect(() => {
        fetchData()
    }, [fetchData])

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
    }




    const columns = useMemo<ColumnDef<DeathRecord>[]>(
        () => [
            {
                header: "No",
                cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
            },
            { accessorKey: "nama", header: "Nama" },
            {
                accessorKey: "tanggal_lahir",
                header: "Tanggal Lahir",
                cell: ({ row }) =>
                    new Date(row.original.tanggal_lahir).toLocaleDateString("id-ID"),
            },
            {
                accessorKey: "tanggal_kematian",
                header: () => (
                    <div className="flex items-center justify-center gap-1">
                        <span>Tanggal Wafat</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleSort}
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                ),
                cell: ({ row }) =>
                    new Date(row.original.tanggal_kematian).toLocaleDateString("id-ID"),
            },
            { accessorKey: "alamat", header: "Alamat" },
            { accessorKey: "jumlah_keluarga", header: "Jumlah Keluarga" },
            { accessorKey: "keterangan", header: "Keterangan" },
            {
                accessorKey: "createdAt",
                header: "Dibuat pada",
                cell: ({ row }) =>
                    new Date(row.original.createdAt).toLocaleDateString("id-ID"),
            },
            {
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex justify-between gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedImage(row.original.foto)}
                            title="Lihat Foto"
                            className="hover:bg-blue-50 hover:text-blue-500 text-blue-500"
                        >
                            <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedImage(row.original.foto)}
                            title="Hapus"
                            className="hover:bg-red-50 hover:text-red-500 text-red-500"
                        >
                            <Trash className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedImage(row.original.foto)}
                            title="Edit"
                            className="hover:bg-green-50 hover:text-green-500 text-green-500"
                        >
                            <Pencil className="h-5 w-5" />
                        </Button>
                    </div>

                ),
            },
        ],
        [currentPage, itemsPerPage]
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const totalPages = Math.ceil(totalData / itemsPerPage)

    return (
        <>
            <div>
                {/* 🔍 Search dan Tambah */}
                <div className="flex items-center justify-between mb-4 ">
                    <div className="flex items-center gap-3">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Cari nama..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-8"
                            />
                        </div>

                        <Select
                            value={String(itemsPerPage)}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value))
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="5" />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 25, 50, 100].map((num) => (
                                    <SelectItem key={num} value={String(num)}>
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-between gap-3">
                        <Button className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200">
                            <Plus className="h-4 w-4" strokeWidth={3} />
                        </Button>
                
                        <Dialog open={openExportDialog} onOpenChange={setOpenExportDialog}>
                            <DialogTrigger asChild>
                                <Button
                                    
                                    className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-200"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Export Excel
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Pilih Tanggal Kematian</DialogTitle>
                                </DialogHeader>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col items-center">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate ?? undefined}
                                            // @ts-expect-error dsd
                                            onSelect={setSelectedDate}
                                            locale={id}
                                            required={false}
                                        />
                                        {selectedDate && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Tanggal dipilih:{" "}
                                                <span className="font-medium">
                                                    {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={() => {
                                            setOpenExportDialog(false)
                                            setSelectedDate(null)

                                        }}>
                                            Batal
                                        </Button>
                                        <Button
                                            onClick={fetchByDate}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Export Excel
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>



                </div>

                {/* 📄 Table */}
                <div className="rounded-sm border-gray-200">
                    {loading ? (
                        <div>
                            {/* Skeleton Header */}
                            <div className="bg-gray-50 border-b px-4 py-3 flex gap-4">
                                {[...Array(9)].map((_, i) => (
                                    <Skeleton key={i} className="h-5 flex-1" />
                                ))}
                            </div>

                            {/* Skeleton Rows */}
                            {[...Array(itemsPerPage)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-4 px-4 py-3 border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    {[...Array(9)].map((_, j) => (
                                        <Skeleton key={j} className="h-5 flex-1" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-b">

                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="font-semibold text-center text-gray-700 border-none"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {data.length ? (
                                    table.getRowModel().rows.map((row, idx) => (
                                        <TableRow
                                            key={row.id}
                                            className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b transition-colors`}

                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="border-none text-center text-gray-800"
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="text-center text-gray-500 py-6 border-none"
                                        >
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* 🔢 Pagination */}
                {!loading && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
                        <div className="text-sm text-gray-600 text-center sm:text-left">
                            {totalData > 0 ? (
                                <>
                                    Menampilkan{" "}
                                    <span className="font-semibold">
                                        {(currentPage - 1) * itemsPerPage + 1}
                                    </span>{" "}
                                    -{" "}
                                    <span className="font-semibold">
                                        {Math.min(currentPage * itemsPerPage, totalData)}
                                    </span>{" "}
                                    dari <span className="font-semibold">{totalData}</span> data
                                </>
                            ) : (
                                "Tidak ada data"
                            )}
                        </div>

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        className={
                                            currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                        }
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(i + 1)}
                                            isActive={currentPage === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                                        }
                                        className={
                                            currentPage === totalPages
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div >

            {/* 🖼️ Dialog View Image */}
            <Dialog open={!!selectedImage
            } onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle>Foto Arsip</DialogTitle>
                        <DialogClose>
                            <X className="h-5 w-5 cursor-pointer hover:text-red-500" />
                        </DialogClose>
                    </DialogHeader>
                    <div className="flex justify-center">
                        <Image
                            src={selectedImage ?? ""}
                            alt="Foto Arsip"
                            width={500}
                            height={500}
                            className="rounded-lg max-h-[400px] object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}