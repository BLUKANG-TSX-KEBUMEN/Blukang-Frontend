'use client'

import ImageList from '@/components/admin/content/image-list'
import React, { useCallback, useEffect } from 'react'

const SliderPage = () => {
    const [images, setImages] = React.useState<SliderContent[]>([])
    const [loading, setLoading] = React.useState(true)

    const fetchSliderImages = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/contents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
            const json = await res.json()
            const data = Array.isArray(json) ? json : json.data || []
            setImages(data)
        } catch (error) {
            console.error('Error fetching news:', error)
            setImages([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSliderImages()
    }, [fetchSliderImages])


    return (
        <div className='min-h-screen flex flex-col'>
            <div className='p-4 border-b bg-white'>
                <h2 className='text-lg font-semibold'>Slider Management</h2>
            </div>
            <div className='p-4'>
                {/* Slider management content goes here */}
                <ImageList sliderImages={images} loading={loading} fetchSliderImages={fetchSliderImages} />
            </div>
        </div>
    )
}

export default SliderPage