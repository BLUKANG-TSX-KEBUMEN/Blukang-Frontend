//@ts-nocheck
'use client';

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Report {
  id: number;
  namaLengkap: string;
  title: string;
  description: string;
  coordinates: string;
  files: string[];
  status: string;
}

const ReportMap = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Gagal memuat data laporan");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const defaultCenter: [number, number] = [-7.4297, 109.2489];

  // 🧭 Ikon custom — kamu bisa ganti URL-nya dengan ikon milikmu sendiri
  const pendingIcon = new L.Icon({
    iconUrl: "/pin.png", // kuning (warning)
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
  });

  const resolvedIcon = new L.Icon({
    iconUrl: "/check.png", // hijau (check)
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
  });

  const getMarkerIcon = (status: string) => {
    return status === "PENDING" ? pendingIcon : resolvedIcon;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {reports.map((report) => {
          try {
            const [lat, lng] = report.coordinates
              .split(",")
              .map((v) => parseFloat(v.trim()));

            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={report.id}
                position={[lat, lng]}
                icon={getMarkerIcon(report.status)}
              >
                <Popup maxWidth={300}>
                  <div className="text-sm">
                    <h3 className="font-bold text-base text-gray-800 mb-2">
                      {report.title}
                    </h3>

                    <p className="text-gray-700 mb-1">{report.description}</p>

                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-semibold text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          report.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Pelapor:</span>{" "}
                      {report.namaLengkap}
                    </p>

                    {report.files?.[0] && (
                      <img
                        src={report.files[0]}
                        alt="report"
                        className="mt-2 w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          } catch {
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default ReportMap;
