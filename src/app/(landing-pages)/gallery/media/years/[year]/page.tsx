"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  gallery_id: number;
  date: string;
  year: string;
  caption: string;
  image: string;
}

const YearPage = () => {
  const { year } = useParams<{ year: string }>(); // Ensure TypeScript knows the `year` is a string
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `https://iaiiea.org/api/sandbox/landing/gallery/${year}`
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setImages(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch gallery images");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (year) fetchGallery();
  }, [year]);

  return (
    <div className="px-4 lg:px-10 py-10 bg-[#0e1a3d] text-white">
      {/* Header Section */}
      <div className="text-center mb-10 mt-20">
        <p className="text-yellow-500 text-sm md:text-base">
          Gallery {'>'} Media {'>'} <span className="text-white">{year} Images</span>
        </p>
        <h1 className="font-bold text-3xl md:text-5xl">{year} Images</h1>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p className="text-center">Loading images...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Images Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.gallery_id}
              className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg"
            >
              <Image
                src={image.image}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 w-full p-2 text-sm">
                <p>{image.caption}</p>
                <p className="text-xs text-gray-300">{new Date(image.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearPage;
