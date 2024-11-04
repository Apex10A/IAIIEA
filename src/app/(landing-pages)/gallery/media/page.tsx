import React from 'react';
import Image from 'next/image';
import '@/app/index.css'
import YearImage from './yearImage';

const Page = () => {
  return (
    <div>
     <div className='flex items-center justify-center'>
     <div className='absolute z-20 flex items-center justify-center'>
        <h1 className='text-white font-[600] text-[40px] lg:text-[60px] '>Gallery</h1>
      </div>
      <div className='w-full'>
        <Image 
          src='/thumbnail/Landing page (1).png' 
          alt='Landing Page' 
          className='z-0 h-[700px] object-cover'
          layout="responsive" 
          width={1000}  // Replace with the actual width of your image 
          height={800}  // Replace with the actual height of your image
        />
      </div>
     </div>
      <div className='bg-[#0e1a3d] py-20 px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <YearImage year='2024' imageUrl='/thumbnail/2024Thumbail.png'/>
        <YearImage year='2023' imageUrl='/thumbnail/2023 Thumbnail.png'/>
        <YearImage year='2022' imageUrl='/thumbnail/2022 Thumbnail.png'/>
        <YearImage year='2021' imageUrl='/thumbnail/2021 Thumbnail.png'/>
        <YearImage year='2020' imageUrl='/thumbnail/2020 Thumbnail.png'/>
      </div>
    </div>
  );
};

export default Page;
