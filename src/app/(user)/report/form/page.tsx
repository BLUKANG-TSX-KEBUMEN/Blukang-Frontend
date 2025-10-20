'use client'

import React, { useState } from 'react'
import Header from '@/components/header'
import Link from 'next/link'

const ReportForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
        },
        (error) => {
          alert('Gagal mengambil lokasi. Pastikan izin lokasi diaktifkan.')
          console.error(error)
        }
      )
    } else {
      alert('Browser Anda tidak mendukung geolokasi.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Laporan berhasil dikirim!')
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar & Header */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten utama */}
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto p-6 md:p-10 mt-[56px] ${
          isOpen ? 'blur-sm md:ml-64' : 'md:ml-64'
        }`}
      >
        {/* Breadcrumb */}
        <p className="text-xs text-gray-500 mb-1">Laporan Warga</p>

        {/* Judul */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Form Laporan Kerusakan Fasilitas Umum
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Laporkan kerusakan atau keluhan fasilitas umum di desa kami. Tim kami
          akan menindaklanjuti secepatnya.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10 w-full max-w-5xl"
        >
          {/* Nama */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap Pelapor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nama lengkap Anda"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* NIK */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIK (Nomor Induk Kependudukan){' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="16 digit NIK"
              maxLength={16}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Judul */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Laporan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Singkat dan jelas"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Lokasi */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="RT/RW atau nama lokasi"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Kerusakan <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Jelaskan secara detail kondisi kerusakan"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Upload Foto */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Bukti Foto
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:text-sm hover:file:bg-blue-700 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Anda dapat mengunggah 1 foto sebagai bukti (opsional).
            </p>
          </div>

          {/* Titik Koordinat */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titik Koordinat (opsional)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleLocation}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm py-2 rounded-lg transition-all"
            >
              Gunakan Lokasi Saya
            </button>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-black hover:from-blue-800 hover:to-gray-900 text-white font-medium text-sm py-2.5 rounded-lg transition-all mt-6"
          >
            Kirim Laporan
          </button>
        </form>

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

export default ReportForm
