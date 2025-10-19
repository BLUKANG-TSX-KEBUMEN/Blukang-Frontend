'use client'

import React, { useState } from 'react'
import Header, { NavbarToggle } from '@/components/header'

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <NavbarToggle isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten Utama */}
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto p-6 md:p-10 ${
          isOpen ? 'blur-sm md:ml-64' : 'md:ml-64'
        }`}
      >
        {/* Header Dashboard */}
        <div
          className="
            flex flex-col md:flex-row 
            justify-between md:items-center 
            items-start 
            mb-8
            pt-12 md:pt-0
            space-y-4 md:space-y-0
          "
        >
          {/* 🔧 Tambahan pt-12 agar turun sedikit di mobile */}
          <h1 className="text-3xl font-bold text-gray-900 order-2 md:order-1">
            Dashboard
          </h1>

          <input
            type="text"
            placeholder="Cari berita, laporan..."
            className="
              border border-gray-300 rounded-lg px-4 py-2 text-sm 
              w-full md:w-72 
              focus:ring-2 focus:ring-blue-400 focus:outline-none 
              order-1 md:order-2
            "
          />
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: 'Berita', value: 12 },
            { title: 'Arsip Kematian', value: 38 },
            { title: 'Jumlah Laporan', value: 14 },
            { title: 'Laporan Masuk', value: 12 },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all"
            >
              <h3 className="text-gray-600 text-sm">{item.title}</h3>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Tabel Laporan */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold mb-4 text-lg text-gray-800">
            Kelola Laporan Warga
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="pb-3 pr-4">Judul</th>
                  <th className="pb-3 pr-4">Pelapor</th>
                  <th className="pb-3 pr-4">Deskripsi</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Keterangan</th>
                  <th className="pb-3 pr-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td>Lampu jalan mati</td>
                  <td>Budi</td>
                  <td>Di RT 03, lampu jalan mati sejak kemarin.</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td>-</td>
                  <td>
                    <button className="bg-black text-white px-3 py-1 rounded-md text-xs hover:opacity-80">
                      Simpan
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td>Sampah menumpuk</td>
                  <td>Sari</td>
                  <td>TPS penuh dan berbau tak sedap.</td>
                  <td>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      On progress
                    </span>
                  </td>
                  <td>-</td>
                  <td>
                    <button className="bg-black text-white px-3 py-1 rounded-md text-xs hover:opacity-80">
                      Simpan
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
