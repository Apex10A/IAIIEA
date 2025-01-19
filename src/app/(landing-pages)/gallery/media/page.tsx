"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import '@/app/index.css';
import YearImage from './yearImage';

interface GalleryData {
  year: string;
  cover: string;
}

const Page = () => {
  const [galleryData, setGalleryData] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch('https://iaiiea.org/api/sandbox/landing/gallery');
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setGalleryData(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch gallery data');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-center">
        <div className="absolute z-20 flex items-center justify-center">
          <h1 className="text-white font-[600] text-[40px] lg:text-[60px]">Gallery</h1>
        </div>
        <div className="w-full">
          <Image
            src="/thumbnail/Landing page (1).png"
            alt="Landing Page"
            className="z-0 h-[700px] object-cover"
            layout="responsive"
            width={1000} // Replace with the actual width of your image
            height={800} // Replace with the actual height of your image
          />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-[#0e1a3d] py-20 px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && <p className="text-white text-center col-span-full">Loading gallery...</p>}
        {error && <p className="text-red-500 text-center col-span-full">Error: {error}</p>}
        {!loading &&
          !error &&
          galleryData.map((item) => (
            <YearImage key={item.year} year={item.year} imageUrl={item.cover} />
          ))}
      </div>
    </div>
  );
};

export default Page;
