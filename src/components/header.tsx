'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileArchive,
  Newspaper,
  ClipboardList,
  FilePenLine,
  Menu,
  X,
} from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

// Define the menu items
const menuItems = [
  { href: '/home', icon: Home, label: 'Beranda' },
  { href: '/news', icon: Newspaper, label: 'Berita Terkini' },
  { href: '/report', icon: ClipboardList, label: 'Laporan Warga' },
  { href: '/report/form', icon: FilePenLine, label: 'Buat Laporan' },
]

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      {/* ===== HEADER PORTAL PENGADUAN ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen
            ? 'bg-white backdrop-blur-md shadow-lg '
            : 'bg-transparent'
          }`}
      >
        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/home" className="flex items-center gap-3 group">
              <Image
                src="https://patukrejo.kec-bonorowo.kebumenkab.go.id/assets/logo/kbm.png"
                alt="Logo Desa Patukrejo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-105"
                width={48}
                height={48}
              />
              <div className="flex flex-col">
                <h1
                  className={`text-base md:text-xl font-bold transition-colors duration-300 ${isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white drop-shadow-lg'
                    }`}
                >
                  Patukrejomulyo
                </h1>
                <p
                  className={`text-xs transition-colors duration-300 ${isScrolled || isMenuOpen ? 'text-gray-600' : 'text-white/90 drop-shadow'
                    }`}
                >
                  Layanan Pengaduan Digital
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/home"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/home')
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white shadow-md'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                <Home className="w-4 h-4" />
                Beranda
              </Link>

              <Link
                href="/news"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/news')
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white shadow-md'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                <Newspaper className="w-4 h-4" />
                Berita
              </Link>

              <Link
                href="/report"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/report')
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white shadow-md'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                <ClipboardList className="w-4 h-4" />
                Laporan
              </Link>

              <Link
                href="/report/form"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all  ${isActive('/report/form')
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white shadow-md'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                <FilePenLine className="w-4 h-4" />
                Buat Laporan
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`lg:hidden p-2 rounded-lg transition-all ${isScrolled || isMenuOpen
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-dropdown"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ===== MOBILE DROPDOWN MENU ===== */}
        <div
          id="mobile-menu-dropdown"
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen ' : 'max-h-0'
            }`}
        >
          <nav className="flex flex-col bg-white backdrop-blur-md p-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm ${isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header