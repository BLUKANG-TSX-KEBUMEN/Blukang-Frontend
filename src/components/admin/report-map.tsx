'use client';

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ReportMap = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`);
        if (!res.ok) throw new Error("Gagal mengambil data");

        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data || [];
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Gagal memuat data laporan");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const defaultCenter: [number, number] = [-7.4297, 109.2489];

  const icons = {
    PENDING: new L.Icon({ iconUrl: "/pin.png", iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -38] }),
    IN_PROGRESS: new L.Icon({ iconUrl: "/time.png", iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -38] }),
    COMPLETED: new L.Icon({ iconUrl: "/check.png", iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -38] }),
    DECLINED: new L.Icon({ iconUrl: "/cross.png", iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -38] }),
  };

  const getMarkerIcon = (status: string) =>
    icons[status as keyof typeof icons] || icons.COMPLETED;

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    );

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
                <Popup maxWidth={300}>
                  <div className="text-sm">
                    <h3 className="font-bold text-base text-gray-800 mb-1">{report.title}</h3>
                    <p className="text-gray-700 mb-1">{report.description}</p>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-semibold text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          report.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.status === "IN_PROGRESS"
                            ? "bg-purple-100 text-purple-800"
                            : report.status === "DECLINED"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Pelapor:</span> {report.namaLengkap}
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
