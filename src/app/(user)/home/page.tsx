'use client'

import React, { useState } from 'react'
import Header from '@/components/header'

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false)

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
        {/* Tambahkan mt-[56px] untuk turun sesuai tinggi header bar */}
        <div className="flex flex-col md:flex-row justify-between md:items-center items-start mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <input
            type="text"
            placeholder="Cari berita, laporan..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-72 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[{ title: 'Berita', value: 12 },
            { title: 'Arsip Kematian', value: 38 },
            { title: 'Jumlah Laporan', value: 14 },
            { title: 'Laporan Masuk', value: 12 }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all">
              <h3 className="text-gray-600 text-sm">{item.title}</h3>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Tabel Laporan */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-10">
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

        {/* ===== Berita, Laporan, Arsip ===== */}
        <section className="space-y-10">
          {/* Berita Terkini */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Berita Terkini
              </h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                6
              </span>
            </div>
            <div className="space-y-4">
              {[
                {
                  title:
                    'Pembangunan Gedung Baru SD Negeri Patukrejomulyo Dimulai',
                  date: '12 Oktober 2025',
                },
                {
                  title: 'Perbaikan Jalan Lingkungan RT 03 Selesai Lebih Cepat',
                  date: '9 Oktober 2025',
                },
                {
                  title:
                    'Posyandu Balita Bulan Oktober Terlaksana dengan Lancar',
                  date: '7 Oktober 2025',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-md" />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-black text-white py-2 rounded-lg font-medium">
              Lihat Semua Berita →
            </button>
          </div>

          {/* Laporan Warga */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Laporan Warga
              </h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                7
              </span>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Jembatan Kayu Rapuh dan Berbahaya', status: 'Selesai' },
                { title: 'Tempat Sampah Penuh dan Bau', status: 'Menunggu' },
                { title: 'Kerusakan Lampu Jalan RT 01', status: 'Proses' },
                { title: 'Saluran Air Tersumbat Sampah', status: 'Menunggu' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">📍 Lokasi sekitar desa</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'Selesai'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'Proses'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-black text-white py-2 rounded-lg font-medium">
                Lihat Semua
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium">
                Kirim Laporan
              </button>
            </div>
          </div>

          {/* Arsip Kematian */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Arsip Kematian
            </h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-md" />
                  <div className="text-sm text-gray-700">
                    <p>Nama : xxxxxx</p>
                    <p>Tempat Lahir : xxxxxx</p>
                    <p>Tanggal Lahir : xxxxxx</p>
                    <p>Tanggal Meninggal : xxxxxx</p>
                    <p>Alamat : xxxxxx</p>
                    <p>Jumlah Keluarga : xxxxxx</p>
                    <p>Keterangan : xxxxxx</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-black text-white py-2 rounded-lg font-medium">
              Lihat Semua Arsip Kematian →
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
