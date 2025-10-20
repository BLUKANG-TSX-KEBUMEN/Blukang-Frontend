'use client'

import React, { useState } from 'react'
import Header from '../../../components/header'
import Link from 'next/link'

const ReportPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Data dummy laporan
  const laporanData = [
    {
      judul: 'Kerusakan Lampu Jalan RT 01',
      lokasi: 'RT 01 / RW 02',
      deskripsi:
        'Lampu jalan di depan rumah Pak Hadi mati sejak 3 hari lalu. Perlu pengecekan atau perbaikan instalasi listrik.',
      status: 'Proses',
    },
    {
      judul: 'Saluran Air Tersumbat Sampah',
      lokasi: 'Dusun Sido Rahayu',
      deskripsi:
        'Saluran air di Gang Melati tersumbat sampah dan mengakibatkan genangan air saat hujan. Perlu pembersihan segera.',
      status: 'Menunggu',
    },
    {
      judul: 'Jembatan Kayu Rapuh dan Berbahaya',
      lokasi: 'Dekat Lapangan Desa',
      deskripsi:
        'Jembatan kayu penghubung sawah lapuk dan membahayakan warga. Disarankan diganti dengan material beton ringan.',
      status: 'Selesai',
    },
    {
      judul: 'Tempat Sampah Penuh dan Bau',
      lokasi: 'Pasar Desa',
      deskripsi:
        'TPS di samping pasar sudah penuh dan menimbulkan bau menyengat. Perlu penambahan frekuensi pengangkutan.',
      status: 'Menunggu',
    },
    {
      judul: 'Trotoar Rusak dan Berlubang',
      lokasi: 'Depan SD Negeri',
      deskripsi:
        'Trotoar di depan SD berlubang dan membahayakan pejalan kaki. Perlu perbaikan segera.',
      status: 'Menunggu',
    },
    {
      judul: 'Pohon Tumbang Tutup Jalan',
      lokasi: 'Jl. Raya Desa KM 3',
      deskripsi:
        'Pohon besar tumbang akibat angin kencang. Sudah ditangani perangkat desa.',
      status: 'Selesai',
    },
    {
      judul: 'Papan Nama Jalan Hilang',
      lokasi: 'Pertigaan RT 04',
      deskripsi:
        'Papan penunjuk arah di pertigaan RT 04 hilang dicuri. Tidak menjadi prioritas anggaran saat ini.',
      status: 'Ditolak',
    },
  ]

  // Warna status laporan
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Proses':
        return 'bg-blue-100 text-blue-700'
      case 'Menunggu':
        return 'bg-gray-100 text-gray-700'
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-700'
      case 'Ditolak':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten utama */}
      <main className="flex flex-col flex-1 mt-[64px] md:ml-64 p-4 md:p-8">
        {/* Judul */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Laporan Terbaru
          </h1>
          <span className="text-sm text-gray-500">
            {laporanData.length} laporan
          </span>
        </div>

        {/* Kartu laporan */}
        <div className="flex flex-col gap-5">
          {laporanData.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start gap-4"
            >
              {/* Gambar placeholder */}
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />

              {/* Info laporan */}
              <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-gray-900">{item.judul}</p>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  📍 {item.lokasi}
                </p>
                <p className="mt-2">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

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

export default ReportPage
