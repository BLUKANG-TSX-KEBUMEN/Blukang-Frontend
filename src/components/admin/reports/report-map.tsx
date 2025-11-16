'use client';

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
//@ts-expect-error leaflet css
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import ReportDetail from "./report-detail";
import { Skeleton } from "@/components/ui/skeleton";


interface ReportProps {
  reports: Report[];
  loading: boolean;
  fetchReports: () => void;
}



export default function ReportMap({ reports, loading, fetchReports }: ReportProps) {

  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);



  const defaultCenter: [number, number] = [-7.782790587818299, 109.81895102573276];

  const icons = {
    PENDING: new L.Icon({
      iconUrl: "/new.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -38],
    }),
    IN_PROGRESS: new L.Icon({
      iconUrl: "/time.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -38],
    }),
    COMPLETED: new L.Icon({
      iconUrl: "/check.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -38],
    }),
    DECLINED: new L.Icon({
      iconUrl: "/cross.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -38],
    }),
    // ✅ Default center icon
    OFFICE: new L.Icon({
      iconUrl: "/offices.png",
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -45],
    }),
  };

  const getMarkerIcon = (status: string) =>
    icons[status as keyof typeof icons] || icons.COMPLETED;

  if (loading) {
    return (
      <div className="relative w-full h-full p-4">
        {/* Map skeleton area */}
        <div className="relative h-[calc(100vh-140px)] w-full rounded-lg overflow-hidden">
          <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />

          {/* Marker-like placeholders */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 bg-gray-300/70 rounded-full border border-white shadow-md animate-pulse"
              style={{
                top: `${20 + i * 12}%`,
                left: `${30 + (i % 3) * 15}%`,
              }}
            />
          ))}

          {/* Floating loading card (simulasi popup laporan) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[300px] rounded-xl bg-white shadow-md p-4 space-y-3 border border-gray-100 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="flex justify-end">
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="relative w-full h-full">
      <MapContainer
        //@ts-expect-error react-leaflet height fix
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full rounded-b-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          //@ts-expect-error leaflet attribution
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* ✅ Marker untuk titik pusat (kantor / default center) */}
        <Marker
          position={defaultCenter}
          //@ts-expect-error leaflet icon
          icon={icons.OFFICE}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold text-base text-gray-800 mb-1">Kantor Desa Patukrejo</h3>
              <p className="text-gray-700 mb-1">Titik pusat wilayah laporan.</p>
            </div>
          </Popup>
        </Marker>

        {/* Marker untuk semua laporan */}
        {reports.map((report) => {
          try {
            const [lat, lng] = report.coordinates.split(",").map((v) => parseFloat(v.trim()));
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={report.id}
                position={[lat, lng]}
                //@ts-expect-error leaflet icon
                icon={getMarkerIcon(report.status)}
              >
                <Popup
                  //@ts-expect-error leaflet icon
                  maxWidth={300}>
                  <div className="text-sm ">
                    <h3 className="font-bold text-base text-gray-800 mb-1">{report.title}</h3>
                    <p className="text-gray-700 mb-1">{report.description}</p>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-semibold text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${report.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "IN_PROGRESS"
                            ? "bg-purple-100 text-purple-800"
                            : report.status === "DECLINED"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {report.status === 'IN_PROGRESS'
                          ? 'Dalam Proses'
                          : report.status === 'PENDING'
                            ? 'Pending'
                            : report.status === 'COMPLETED'
                              ? 'Selesai'
                              : report.status === 'DECLINED'
                                ? 'Ditolak'
                                : report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Pelapor:</span> {report.namaLengkap}
                    </p>
                    {report.files?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={report.files[0]}
                        alt="report"
                        className="mt-2 w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                    )}

                    <div className="mt-2 flex justify-center text-center">
                      <Button
                        className="bg-gradient-to-r w-full from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          setReportId(report.id)
                          setOpenDetail(true)
                        }}
                      >
                        Detail
                      </Button>
                    </div>

                  </div>
                </Popup>
              </Marker>
            );
          } catch {
            return null;
          }
        })}
      </MapContainer>

      <ReportDetail
        open={openDetail}
        reportId={reportId}
        onOpenChange={setOpenDetail}
        onClose={fetchReports}
      />
    </div>
  );
};

