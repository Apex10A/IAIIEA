import React from 'react'
import GallerySlider from "./GallerySlider"
import Image from "@/assets/auth/images/iaiieaBg.png"; // Importing image path

const imageList = [
  Image, // Using the image path
  Image,
  Image,
];

const Gallery = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[600px]'>
        <div>
            <h1 className='text-[48px] font-[500] text-[#0B142F]'>Gallery</h1>
        </div>
        <GallerySlider images={imageList}/>
    </div>
  )
}

export default Gallery