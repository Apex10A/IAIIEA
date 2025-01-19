import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface YearImageProps {
  year: string;
  imageUrl: string;
  description?: string;
}

const YearImage: React.FC<YearImageProps> = ({ year, imageUrl, description }) => {
  return (
    <Link href={`/gallery/${year}`} className='group'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl'>
        <div className='relative w-full pt-[75%]'>
          <Image 
            src={imageUrl}
            alt={`Conference ${year}`}
            fill
            className='absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
        <div className='p-4 bg-[#E9EBF3]'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-semibold text-[#0B142F]'>
              {year} Conference
            </h2>
            <button className='bg-[#203A87] text-white px-3 py-2 flex rounded-lg text-sm'>
              View Gallery
            </button>
          </div>
          {description && (
            <p className='text-sm text-[#0B142F] opacity-70 mt-2'>
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default YearImage;