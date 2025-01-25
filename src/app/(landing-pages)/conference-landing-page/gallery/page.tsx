import React from 'react';
import { ImageOff } from 'lucide-react';

const GalleryPage: React.FC<{ gallery: string[] }> = ({ gallery }) => {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ImageOff className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-semibold">Gallery is Empty</h2>
        <p className="text-gray-400">No images have been uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gallery.map((image, index) => (
        <div 
          key={index} 
          className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform"
        >
          <img 
            src={image} 
            alt={`Gallery image ${index + 1}`} 
            className="w-full h-48 object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryPage;