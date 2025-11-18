"use client"

import Link from "next/link"
import Image from "next/image"
import { Separator } from "./ui/separator"
import { Phone, Mail, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* LOGO + DESKRIPSI - Lebih lebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/kebumen_logo.png"
                  alt="LaporFasum Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Patukrejomulyo</h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Platform pelaporan kerusakan fasilitas umum untuk masyarakat Patukrejomulyo. 
              Sampaikan keluhan Anda, dan kami akan menindaklanjuti secepatnya.
            </p>
          </div>

          {/* NAVIGASI */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Navigasi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/form" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Buat Laporan
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Riwayat Laporan
                </Link>
              </li>
            </ul>
          </div>

          {/* INFORMASI */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Informasi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* KONTAK DARURAT */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-gray-800 mb-4 text-base">Kontak Darurat</h3>
            <ul className="space-y-3 text-sm">
             
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-700 block">WhatsApp</span>
                  <span className="text-gray-600">0812-6472-7261</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-700 block">Email</span>
                  <span className="text-gray-600">support@patukrejomulyo.id</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-300" />

        {/* COPYRIGHT */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Patukrejomulyo. Semua hak dilindungi.
          </p>
          <p className="text-xs">
            Dibuat dengan ❤️ untuk masyarakat Patukrejomulyo
          </p>
        </div>
      </div>
    </footer>
  )
}