'use client'

import React from 'react'
import Link from 'next/link'
import {
  Home,
  FileText,
  Newspaper,
  Activity,
  LogOut,
  Image,
  Menu,
  X,
} from 'lucide-react'

interface HeaderProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* ===== Sidebar Desktop ===== */}
      <aside className="hidden md:flex flex-col justify-between bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white w-64 h-screen fixed left-0 top-0 shadow-xl z-40">
        <div className="p-6">
          <h1 className="text-lg font-semibold mb-10 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            Layanan Digital
          </h1>

          <nav className="flex flex-col gap-3 text-sm">
            {/* 🔗 Dashboard */}
            <Link
              href="/"
              className="flex items-center gap-3 bg-blue-800/70 hover:bg-blue-900 transition-colors rounded-lg px-3 py-2 font-semibold"
            >
              <Home className="w-5 h-5" /> Dashboard
            </Link>

            {/* 🔗 Arsip Kematian */}
            <a
              href="#"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <FileText className="w-5 h-5" /> Arsip Kematian
            </a>

            {/* 🔗 Berita Terkini */}
            <a
              href="#"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <Newspaper className="w-5 h-5" /> Berita Terkini
            </a>

            {/* 🔗 Laporan Warga */}
            <a
              href="#"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <Activity className="w-5 h-5" /> Laporan Warga
            </a>

            {/* 🔗 Form Laporan Kerusakan */}
            <a
              href="#"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <Image className="w-5 h-5" /> Form Laporan Kerusakan
            </a>
          </nav>
        </div>

        <div className="p-6 border-t border-blue-500/40">
          <button className="flex items-center gap-2 text-red-300 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* ===== Sidebar Mobile ===== */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white 
        w-64 p-6 flex flex-col justify-between rounded-r-3xl shadow-lg transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            Layanan Digital
          </h1>
          {/* Tombol X di dalam sidebar */}
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex flex-col gap-5 text-sm flex-grow">
          {/* 🔗 Dashboard */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Home className="w-5 h-5" /> Dashboard
          </Link>

          {/* 🔗 Arsip Kematian */}
          <a
            href="#"
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <FileText className="w-5 h-5" /> Arsip Kematian
          </a>

          {/* 🔗 Berita Terkini */}
          <a
            href="#"
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Newspaper className="w-5 h-5" /> Berita Terkini
          </a>

          {/* 🔗 Laporan Warga */}
          <a
            href="#"
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Activity className="w-5 h-5" /> Laporan Warga
          </a>

          {/* 🔗 Form Laporan Kerusakan */}
          <a
            href="#"
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Image className="w-5 h-5" /> Form Laporan Kerusakan
          </a>
        </nav>

        <div className="border-t border-blue-500/40 pt-4">
          <button className="flex items-center gap-2 text-red-300 hover:text-red-400">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* ===== Overlay hitam transparan ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

// ✅ Tombol hamburger toggle (hanya muncul saat sidebar tertutup)
export const NavbarToggle: React.FC<HeaderProps> = ({ isOpen, setIsOpen }) =>
  !isOpen ? (
    <button
      className="fixed top-5 left-5 z-50 md:hidden bg-blue-700 p-2 rounded-lg text-white shadow-md"
      onClick={() => setIsOpen(true)}
    >
      <Menu className="w-6 h-6" />
    </button>
  ) : null

export default Header
