'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Trash, Pencil } from "lucide-react";
import Image from "next/image";
import NewsAdd from "./news-add";
import NewsEdit from "./news-edit";
import NewsDeleteDialog from "./news-delete";



interface NewsProps {
    news: News[];
    loading: boolean;
    fetchNews: () => void;
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

export default function NewsList({ news, loading, fetchNews }: NewsProps) {

    const [openAddNewsDialog, setOpenAddNewsDialog] = useState(false);

    const [openEditNewsDialog, setOpenEditNewsDialog] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
    const [selectedNewsTitle, setSelectedNewsTitle] = useState<string>('');
    const [selectedNewsBody, setSelectedNewsBody] = useState<string>('');
    const [selectedNewsImage, setSelectedNewsImage] = useState<string>('');

    const [openDeleteNewsDialog, setOpenDeleteNewsDialog] = useState(false);

    const truncateText = (text: string, limit: number) => {
        if (text.length <= limit) return text;
        return text.substring(0, limit) + '...';
    };
    
    if (loading) {
        return (
            <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <NewsSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Tombol Tambah */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Daftar Berita Terbaru</h2>
                <Button
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold
                      bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white hover:from-blue-700 hover:via-blue-800 hover:to-slate-800 hover:scale-105 transition-all duration-200"
                      onClick={() => setOpenAddNewsDialog(true)}
                >
                    <Plus className="h-4 w-4" strokeWidth={3} />
                    Tambah Berita
                </Button>
            </div>

            {/* Daftar Berita */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                    <Card
                        key={item.id}
                        className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                    >
                        <CardHeader className="p-0 relative h-48">
                            <Image
                                src={item.imageArticle || 'https://placehold.co/600x400/D1D5DB/4B5563?text=Gambar+Kosong'}
                                alt={item.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-300 group-hover:scale-105 h-[90px]"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </CardHeader>

                        <CardContent className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                                <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {item.title}
                                </CardTitle>

                                <Accordion
                                    type="single"
                                    collapsible

                                    className="w-full"
                                >
                                    <AccordionItem value="open">
                                        <AccordionTrigger className="text-sm text-gray-700 hover:no-underline">
                                            {truncateText(item.bodyArticle, 100)}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-gray-600 whitespace-pre-line">
                                                {item.bodyArticle}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-green-600 hover:text-green-700 hover:scale-120 transition-all duration-200"
                                        onClick={() => {
                                            setSelectedNewsId(item.id);
                                            setSelectedNewsTitle(item.title);
                                            setSelectedNewsBody(item.bodyArticle);
                                            setSelectedNewsImage(item.imageArticle || '');
                                            setOpenEditNewsDialog(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:scale-120 transition-all duration-200"
                                        onClick={() => {
                                            setSelectedNewsId(item.id)
                                            setOpenDeleteNewsDialog(true)
                                        }}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <NewsAdd
                open={openAddNewsDialog}
                onOpenChange={setOpenAddNewsDialog}
                onSuccess={fetchNews}
            />

            <NewsEdit
                open={openEditNewsDialog}
                onOpenChange={setOpenEditNewsDialog}
                newsId={selectedNewsId}
                title={selectedNewsTitle}
                bodyArticle={selectedNewsBody}
                imageArticle={selectedNewsImage}
                onSuccess={fetchNews}
            />

            <NewsDeleteDialog
                open={openDeleteNewsDialog}
                onOpenChange={setOpenDeleteNewsDialog}
                newsId={selectedNewsId}
                onSuccess={fetchNews}
            />

            {news.length === 0 && !loading && (
                <div className="text-center py-10 bg-white rounded-xl shadow-inner mt-6">
                    <p className="text-xl text-gray-500 font-medium">Belum ada berita yang tersedia saat ini.</p>
                    <p className="text-sm text-gray-400 mt-2">Silakan tambahkan berita baru.</p>
                </div>
            )}
        </div>
    );
}
