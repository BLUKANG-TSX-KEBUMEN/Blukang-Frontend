'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const InformationPage = () => {

    // Data dummy (bisa diganti dengan API/fetch real data)
    const dataKematian = Array(6).fill({
        nama: 'xxxxxx',
        tempatLahir: 'xxxxxx',
        tanggalLahir: 'xxxxxx',
        tanggalMeninggal: 'xxxxxx',
        alamat: 'xxxxxx',
        jumlahKeluarga: 'xxxxxx',
        keterangan: 'xxxxxx',
    })

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* === Header === */}


            {/* === Konten utama === */}
            <main className="flex flex-col flex-1 mt-[64px] md:ml-64 px-4 sm:px-6 lg:px-10 py-8">
                {/* Judul halaman */}
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                    Arsip Kematian
                </h1>

                {/* Daftar arsip */}
                <div className="flex flex-col gap-5">
                    {dataKematian.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 flex items-start gap-4 hover:shadow-md transition-all"
                        >
                            {/* Foto/Placeholder */}
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />

                            {/* Informasi detail */}
                            <div className="text-sm text-gray-700 leading-relaxed space-y-0.5">
                                <p>
                                    <strong>Nama</strong> : {item.nama}
                                </p>
                                <p>Tempat Lahir : {item.tempatLahir}</p>
                                <p>Tanggal Lahir : {item.tanggalLahir}</p>
                                <p>Tanggal Meninggal : {item.tanggalMeninggal}</p>
                                <p>Alamat : {item.alamat}</p>
                                <p>Jumlah Keluarga : {item.jumlahKeluarga}</p>
                                <p>Keterangan : {item.keterangan}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tombol kembali */}
                {/* Tombol kembali */}
                <div className="mt-8 text-center">
                    <Link
                        href="/home"
                        className="text-blue-700 hover:underline font-medium text-sm"
                    >
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default InformationPage
