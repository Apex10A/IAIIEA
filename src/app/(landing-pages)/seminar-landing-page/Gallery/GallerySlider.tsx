import React from 'react';
import Image, { StaticImageData } from 'next/image'; // Import Image from next/image

interface GallerySliderProps {
  images: StaticImageData[]; // Correct type for images
}

const GallerySlider: React.FC<GallerySliderProps> = ({ images }) => {
  return (
    <div>
      {images.map((img, index) => (
        <Image key={index} src={img} alt={`Gallery image ${index}`} />
      ))}
    </div>
  );
};

export default GallerySlider;
