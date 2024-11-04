import React from 'react';
import GallerySlider from "./GallerySlider";
import Image from "@/assets/auth/images/iaiieaBg.png"; // StaticImageData import
import { StaticImageData } from 'next/image'; // Import StaticImageData type

const imageList: StaticImageData[] = [Image, Image, Image]; // Use StaticImageData[]

const Gallery: React.FC = () => {
  return (
    <div>
      <GallerySlider images={imageList} />
    </div>
  );
};

export default Gallery;
