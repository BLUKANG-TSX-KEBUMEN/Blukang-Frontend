'use client'

import React, { useState } from 'react'
import Header from '../../../components/header' // Pastikan path sesuai lokasi file Header.tsx
import Link from 'next/link'

const InformationPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Data dummy (nanti bisa diganti API/fetch data sebenarnya)
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
      {/* Header */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten utama */}
      <main className="flex flex-col flex-1 mt-[64px] md:ml-64 p-4 md:p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Arsip Kematian
        </h1>

        {/* Kartu Arsip */}
        <div className="flex flex-col gap-5">
          {dataKematian.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start gap-4"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
              <div className="text-sm text-gray-700 leading-relaxed">
                <p>
                  <strong>Nama</strong> : {item.nama}
                </p>
                <p>
                  Tempat Lahir : {item.tempatLahir}
                </p>
                <p>
                  Tanggal Lahir : {item.tanggalLahir}
                </p>
                <p>
                  Tanggal Meninggal : {item.tanggalMeninggal}
                </p>
                <p>Alamat : {item.alamat}</p>
                <p>Jumlah Keluarga : {item.jumlahKeluarga}</p>
                <p>Keterangan : {item.keterangan}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol kembali */}
        <div className="mt-8">
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
