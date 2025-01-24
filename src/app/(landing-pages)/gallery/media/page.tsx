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
      <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <Image
          src="/thumbnail/Landing page (1).png"
          alt="Gallery Header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-white font-[600] text-[40px] md:text-[60px] text-center px-4">
            Gallery
          </h1>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-[#0e1a3d] py-10 md:py-20 px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {loading && (
            <p className="text-white text-center col-span-full">
              Loading gallery...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center col-span-full">
              Error: {error}
            </p>
          )}
          {!loading &&
            !error &&
            galleryData.map((item) => (
              <YearImage 
                key={item.year} 
                year={item.year} 
                imageUrl={item.cover} 
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;