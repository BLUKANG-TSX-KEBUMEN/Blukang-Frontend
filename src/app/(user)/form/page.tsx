"use client"

import React, { useState } from 'react'

import { toast } from 'sonner'

import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { MapIcon, MapPinIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import dynamic from 'next/dynamic';


const MapPickerDialog = dynamic(() => import('@/components/map-picker'), {
  ssr: false,
});




const ReportForm = () => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [showMapDialog, setShowMapDialog] = useState(false)
  const [markerPos, setMarkerPos] = useState<[number, number]>([-7.782790587818299, 109.81895102573276])
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [loading, setLoading] = useState(false)

  const [namaLengkap, setNamaLengkap] = useState('')
  const [nik, setNik] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 3) {
      toast.error('Maksimal 3 gambar yang boleh diunggah.');
      return;
    }

    // Tambahkan file baru tanpa menimpa yang lama
    setFiles((prev) => [...prev, ...selectedFiles]);
  };


  const requestLocation = () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("Browser Anda tidak mendukung geolokasi.")
        reject("Geolocation not supported")
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setMarkerPos([latitude, longitude])
          setLatitude(latitude.toFixed(6))
          setLongitude(longitude.toFixed(6))
          resolve() // 🔥 baru selesai di sini
        },
        (error) => {
          console.warn("Gagal mendapatkan lokasi:", error)
          toast.error("Gagal mengambil lokasi. Pastikan GPS aktif dan izin lokasi diberikan.")
          reject(error)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      )
    })
  }


  // ✅ Validasi NIK Indonesia (16 digit numerik)
  const validateNIK = (nik: string) => {
    const nikRegex = /^[0-9]{16}$/;
    return nikRegex.test(nik);
  }

  // ✅ Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateNIK(nik)) {
      toast.error('NIK harus berupa 16 digit angka.');
      return;
    }

    if (files.length === 0) {
      toast.error('Minimal harus melampirkan 1 file foto/dokumen.');
      return;
    }

    if (files.length > 3) {
      toast.error('Maksimal hanya boleh melampirkan 3 file.');
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} terlalu besar. Maksimal ukuran file 5MB.`);
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('namaLengkap', namaLengkap);
      formData.append('NIK', nik);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('coordinates', latitude && longitude ? `${latitude},${longitude}` : ' ');

      files.slice(0, 3).forEach((f) => formData.append('files', f));

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({})); // antisipasi kalau bukan JSON

      if (!res.ok) {
        // Ambil pesan error dari response backend
        const errorMessage =
          data?.message?.message || // kasus nested message
          data?.message ||          // kasus message tunggal
          data?.error ||            // fallback untuk error lain
          'Gagal mengirim laporan.';

        toast.error(errorMessage, {
          style: { backgroundColor: "#ef4444", color: "white" },
        });
        return;
      }

      toast.success(`Laporan "${data.data.title}" berhasil dikirim.`, {
        style: { backgroundColor: "#22c55e", color: "white" },
      });

      // Reset form
      setNamaLengkap('');
      setNik('');
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setFiles([]);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Terjadi kesalahan saat mengirim laporan.');
    } finally {
      setLoading(false);
    }
  };


  const handleSelectLocation = () => {
    setLatitude(markerPos[0].toFixed(6))
    setLongitude(markerPos[1].toFixed(6))
    setShowMapDialog(false)
  }

  const handleOpenMapDialog = async () => {
    setLoadingLocation(true)

    try {
      await requestLocation()     // 🔥 benar-benar menunggu koordinat
      setShowMapDialog(true)      // 🔥 map dibuka SETELAH koordinat baru didapat
    } catch (error) {
      console.error("Gagal mendapatkan lokasi sebelum membuka peta:", error)
    } finally {
      setLoadingLocation(false)
    }
  }




  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section
        className="relative w-full flex items-center justify-center text-center text-white"
        style={{ minHeight: '300px' }}
      >
        <Image
          src="/hero-desa.jpg"
          alt="Hero Image Desa Patukrejomulyo"
          fill
          className="object-cover brightness-[0.55]"
          priority
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Form Laporan Kerusakan Fasilitas Umum
          </h1>
          <p className="text-sm text-gray-200">
            Laporkan kerusakan atau keluhan fasilitas umum di desa kami. Tim kami akan menindaklanjuti secepatnya.

          </p>
        </div>
      </section>

      <main className='flex transition-all duration-300 overflow-y-auto p-6 justify-center'>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10 w-full max-w-5xl">
          {/* Nama */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Pelapor <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Nama lengkap Anda"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* NIK */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span></label>
            <label className='block text-xs font-medium text-gray-600 mb-1'>Contoh: 3273056010900009</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // hanya angka
                if (val.length <= 16) setNik(val);
              }}
              placeholder="16 digit NIK"
              maxLength={16}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {nik && !validateNIK(nik) && (
              <p className="text-xs text-red-500 mt-1">NIK harus 16 digit angka.</p>
            )}
          </div>

          {/* Judul */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Singkat dan jelas"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi/Lokasi Kerusakan <span className="text-red-500">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara detail kondisi kerusakan"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Upload Foto */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Bukti Foto (Maks. 3)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white 
               file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 
               file:bg-blue-600 file:text-white file:text-sm hover:file:bg-blue-700 transition"
            />
            {files.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded-bl"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Anda dapat mengunggah hingga 3 gambar sebagai bukti.
            </p>
          </div>


          {/* Titik Koordinat */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titik Koordinat (opsional)</label>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input type="text" disabled value={latitude} placeholder="Latitude" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 cursor-not-allowed" />
              <input type="text" disabled value={longitude} placeholder="Longitude" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 cursor-not-allowed" />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={requestLocation}
                disabled={loadingLocation}
                className={`flex-1 font-medium text-sm py-2 rounded-lg transition-all ${loadingLocation
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-50 hover:bg-green-100 text-green-700'
                  }`}
              >
                {loadingLocation ? (
                  'Mengambil lokasi...'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-green-700" />
                    Lokasi Saya
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenMapDialog}
                disabled={loadingLocation}
                className={`flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm py-2 rounded-lg transition-all ${loadingLocation ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <MapIcon className="w-5 h-5 text-blue-700" />
                  Pilih di Peta
                </span>
              </button>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 via-blue-800 justify-center items-center to-black hover:from-blue-800 hover:to-gray-900 text-white font-medium text-sm py-2.5 rounded-lg transition-all mt-6 disabled:opacity-70"
          >
            {loading ? <Spinner className='justify-self-center' variant="circle" /> : 'Kirim Laporan'}
          </button>
        </form>


      </main>

      {/* Dialog Map */}
      <MapPickerDialog
        open={showMapDialog}
        onOpenChange={setShowMapDialog}
        markerPos={markerPos}
        setMarkerPos={setMarkerPos}
        onSelect={handleSelectLocation}
      />

    </div>
  )
}

export default ReportForm
