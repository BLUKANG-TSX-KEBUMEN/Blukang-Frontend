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
      {/* ===== 🔵 HEADER BAR ATAS ===== */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-700 via-blue-800 to-black text-white flex items-center justify-between px-4 md:px-8 py-3 shadow-md z-50">
        {/* Tombol Hamburger (mobile only) */}
        <button
          className="flex items-center gap-2 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Judul */}
        <div className="flex flex-col leading-tight text-sm md:text-base text-center md:text-left">
          <span className="font-semibold">Layanan Digital</span>
          <span className="font-semibold">Desa Patukrejomulyo</span>
        </div>

        {/* Tombol Lapor */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium shadow-sm transition-all">
          Lapor
        </button>
      </header>

      {/* ===== SIDEBAR DESKTOP ===== */}
      <aside className="hidden md:flex flex-col bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white w-64 h-screen fixed left-0 top-[56px] shadow-xl z-40">
        {/* Bagian atas (scrollable menu) */}
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <h1 className="text-lg font-semibold mb-10 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            Layanan Digital
          </h1>

          <nav className="flex flex-col gap-3 text-sm">
            {/* Dashboard */}
            <Link
              href="/home"
              className="flex items-center gap-3 bg-blue-800/70 hover:bg-blue-900 transition-colors rounded-lg px-3 py-2 font-semibold"
            >
              <Home className="w-5 h-5" /> Dashboard
            </Link>

            {/* Arsip Kematian */}
            <Link
              href="/information"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <FileText className="w-5 h-5" /> Arsip Kematian
            </Link>

            {/* 🔗 Berita Terkini → /news */}
            <Link
              href="/news"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <Newspaper className="w-5 h-5" /> Berita Terkini
            </Link>

            {/* 🔗 Laporan Warga → /report */}
            <Link
              href="/report"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <Activity className="w-5 h-5" /> Laporan Warga
            </Link>

            {/* Form Laporan Kerusakan */}
            <a
              href="#"
              className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
            >
              <Image className="w-5 h-5" /> Form Laporan Kerusakan
            </a>
          </nav>
        </div>

        {/* Tombol Logout sticky di bawah */}
        <div className="p-6 border-t border-blue-500/40 bg-blue-950/30 backdrop-blur-sm sticky bottom-0">
          <button className="flex items-center justify-center gap-2 text-red-300 hover:text-red-400 transition-colors w-full font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* ===== SIDEBAR MOBILE ===== */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white 
        w-64 p-6 flex flex-col justify-between rounded-r-3xl shadow-lg transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="flex justify-between items-center mb-8 mt-2">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            Menu
          </h1>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex flex-col gap-5 text-sm flex-grow overflow-y-auto">
          <Link
            href="/home"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Home className="w-5 h-5" /> Dashboard
          </Link>

          {/* Arsip Kematian */}
          <Link
            href="/information"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <FileText className="w-5 h-5" /> Arsip Kematian
          </Link>

          {/* 🔗 Berita Terkini → /news */}
          <Link
            href="/news"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Newspaper className="w-5 h-5" /> Berita Terkini
          </Link>

          {/* 🔗 Laporan Warga → /report */}
          <Link
            href="/report"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Activity className="w-5 h-5" /> Laporan Warga
          </Link>

          {/* Form Laporan Kerusakan */}
          <a
            href="#"
            className="flex items-center gap-3 hover:bg-blue-800/60 rounded-lg px-3 py-2 transition-colors"
          >
            <Image className="w-5 h-5" /> Form Laporan Kerusakan
          </a>
        </nav>

        <div className="border-t border-blue-500/40 pt-4">
          <button className="flex items-center gap-2 text-red-300 hover:text-red-400 w-full justify-center font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* ===== OVERLAY (klik area luar sidebar) ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Header
