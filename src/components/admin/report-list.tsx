// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
} from "@material-tailwind/react";
import Image from "next/image";

interface Report {
    id: number;
    namaLengkap: string;
    title: string;
    description: string;
    coordinates: string;
    files: string[];
    status: string;
    NIK: string;
}

const ReportList = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("ALL");

    // State untuk dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleOpenDialog = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`);
                const data = await res.json();
                setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredReports =
        filter === "ALL"
            ? reports
            : reports.filter((report) => report.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <Typography color="gray" className="text-sm">
                        Loading data laporan...
                    </Typography>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full">
                {/* Filter Buttons */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                        {["ALL", "PENDING", "RESOLVED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? status === "ALL"
                                        ? "bg-blue-600 text-white"
                                        : status === "PENDING"
                                            ? "bg-yellow-600 text-white"
                                            : "bg-green-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {status === "ALL"
                                    ? `Semua (${reports.length})`
                                    : status === "PENDING"
                                        ? `Pending (${reports.filter((r) => r.status === "PENDING").length})`
                                        : `Selesai (${reports.filter((r) => r.status === "RESOLVED").length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Report List */}
                <div className="overflow-y-auto flex-1 p-4 space-y-4 max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-260px)]">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-10">
                            <Typography color="gray" className="text-sm">
                                Tidak ada laporan dengan status {filter.toLowerCase()}
                            </Typography>
                        </div>
                    ) : (
                        filteredReports.map((report) => (
                            <Card
                                key={report.id}
                                className="shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                            >
                                <CardBody className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <Typography
                                            variant="h6"
                                            color="blue-gray"
                                            className="font-semibold text-base line-clamp-2"
                                        >
                                            {report.title}
                                        </Typography>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${report.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {report.status}
                                        </span>
                                    </div>

                                    <Typography color="gray" className="text-sm mb-3 line-clamp-3">
                                        {report.description}
                                    </Typography>

                                    {report.files.length > 0 && (
                                        <div className="mb-3 relative h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={report.files[0]}
                                                alt="Gambar Laporan"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2 mb-3 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <svg
                                                className="w-4 h-4 mr-2 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span className="font-medium mr-1">Pelapor:</span>
                                            <span>{report.namaLengkap}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <svg
                                                className="w-4 h-4 mr-2 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                />
                                            </svg>
                                            <span className="font-medium mr-1">NIK:</span>
                                            <span>{report.NIK}</span>
                                        </div>

                                        <div className="flex items-start text-gray-600">
                                            <svg
                                                className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span className="font-medium mr-1">Koordinat:</span>
                                            <span className="text-xs break-all">
                                                {report.coordinates}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tombol buka dialog */}
                                    {report.files.length > 0 && (
                                        <Button
                                            color="blue"
                                            size="sm"
                                            className="w-full normal-case font-medium text-black"
                                            onClick={() => handleOpenDialog(report.files[0])}
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2 inline"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            Lihat Gambar Lengkap
                                        </Button>
                                    )}
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>

                {/* Dialog Gambar */}

            </div>

            <div className="flex justify-center">
                <Dialog open={openDialog} handler={handleCloseDialog} size="lg" className="max-w-3xl">
                    <DialogHeader className="justify-between items-center">
                        <span></span>
                        <button
                            onClick={handleCloseDialog}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </DialogHeader>
                    <DialogBody className="flex justify-center items-center p-4 max-h-[70vh] overflow-auto">
                        {selectedImage && (
                            <div className="relative w-full h-full flex justify-center items-center">
                                <Image
                                    src={selectedImage}
                                    alt="Gambar Lengkap"
                                    width={700}
                                    height={500}
                                    className="rounded-lg object-contain max-w-full h-auto"
                                    style={{ maxHeight: '60vh' }}
                                />
                            </div>
                        )}
                    </DialogBody>

                </Dialog>
            </div>

        </>


    );
};

export default ReportList;
