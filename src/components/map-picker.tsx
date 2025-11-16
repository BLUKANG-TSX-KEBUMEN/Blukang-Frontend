"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Dynamic imports (SSRFALSE)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });

// Leaflet CSS
import "leaflet/dist/leaflet.css";

interface MapPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  markerPos: [number, number];
  setMarkerPos: (pos: [number, number]) => void;
  onSelect: () => void;
}

const MapPickerDialog: React.FC<MapPickerDialogProps> = ({
  open,
  onOpenChange,
  markerPos,
  setMarkerPos,
  onSelect,
}) => {

  // FIX: Hindari window undefined pada server
  const customIcon = useMemo(() => {
    return new Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl w-full p-0 gap-0" style={{ height: "85vh", maxHeight: "85vh" }}>
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle>Pilih Lokasi di Peta</DialogTitle>
            <DialogDescription>
              Geser marker merah untuk memilih lokasi. Koordinat:{" "}
              {markerPos[0].toFixed(6)}, {markerPos[1].toFixed(6)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 px-6 pb-4">
            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={markerPos}
                zoom={15}
                scrollWheelZoom
                style={{ width: "100%", height: "100%" }}
                whenCreated={(map) => setTimeout(() => map.invalidateSize(), 100)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap"
                />

                <Marker
                  position={markerPos}
                  draggable
                  icon={customIcon}
                  eventHandlers={{
                    dragend: (e) => {
                      const position = e.target.getLatLng();
                      setMarkerPos([position.lat, position.lng]);
                    },
                  }}
                />
              </MapContainer>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={onSelect}>
              Gunakan Lokasi Ini
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapPickerDialog;
