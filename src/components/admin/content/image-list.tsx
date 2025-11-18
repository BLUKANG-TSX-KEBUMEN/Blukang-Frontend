'use client'

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import ImageAdd from "./image-add";
import ImageDeleteDialog from "./image-delete";


interface ImageListProps {
    sliderImages: SliderContent[];
    loading: boolean;
    fetchSliderImages: () => void;
}



const NewsSkeleton = () => (
    <Card className="animate-pulse flex flex-col rounded-xl overflow-hidden shadow-lg border border-gray-100 h-full">
        <CardHeader className="p-0">
            <div className="bg-gray-200 h-40 w-full" />
        </CardHeader>
        <CardContent className="p-4 flex flex-col justify-between flex-grow">
            <div>
                <div className="h-6 bg-gray-200 rounded-md w-4/5 mb-3" />
                <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-4" />
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded-md w-full" />
                    <div className="h-3 bg-gray-200 rounded-md w-11/12" />
                    <div className="h-3 bg-gray-200 rounded-md w-4/6" />
                </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="h-8 w-16 bg-blue-100 rounded-full" />
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function ImageList({
    sliderImages,
    loading,
    fetchSliderImages,
}: ImageListProps) {
    const [openAddImageDialog, setOpenAddImageDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);


    if (loading) {
        return (
            <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <NewsSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-800">Daftar Image</h2>
                <Button
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold
                                bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200"
                    onClick={() => setOpenAddImageDialog(true)}
                >
                    <Plus className="h-4 w-4" strokeWidth={3} />
                    Tambah Gambar
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sliderImages.map((item) => (
                    <Card
                        key={item.id}
                        className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                    >
                        <CardContent className="p-0 relative h-48">
                            <Image
                                src={item.imageSlider}
                                fill
                                alt={item.imageSlider}
                                style={{ objectFit: 'contain' }}
                                className="transition-transform duration-300 group-hover:scale-105 h-full"
                            />
                            <div
                                className="
                                absolute inset-0 rounded-md 
                                bg-black/40 
                                flex items-center justify-center
                                transition-all
                                opacity-100
                                sm:opacity-0
                                sm:group-hover:opacity-100
                                group-hover:scale-105
                                backdrop-blur-sm
                                cursor-pointer
                             
                            "
                                onClick={() => {
                                    setPreviewImage(item.imageSlider)
                                    setOpenPreview(true)
                                }}
                            >
                                <Eye className="text-white w-6 h-6" />
                            </div>

                        </CardContent>
                        <CardFooter className="pb-4 justify-end">
                            <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:scale-120 transition-all duration-200"
                                onClick={() => {
                                    setSelectedImageId(item.id)
                                    setOpenDeleteDialog(true)
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
                    <DialogClose
                        className="absolute top-18 right-4 z-50 bg-black/50 hover:bg-black/70 text-red-500 
               rounded-full p-2  transition backdrop-blur-md"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </DialogClose>
                    <div className="relative w-full h-[70vh]">
                        {previewImage && (
                            <Image
                                src={previewImage}
                                alt="Preview"
                                fill
                                className="object-contain rounded-xl"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ImageDeleteDialog 
                open={openDeleteDialog} 
                onOpenChange={setOpenDeleteDialog} 
                imageId={selectedImageId} 
                onSuccess={fetchSliderImages} 
            />

            <ImageAdd 
                open={openAddImageDialog} 
                onOpenChange={setOpenAddImageDialog} 
                onSuccess={fetchSliderImages} 
            />
        </div>
    )
}