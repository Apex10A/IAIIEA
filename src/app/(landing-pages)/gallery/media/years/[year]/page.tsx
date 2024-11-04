"use client"
import { useParams } from 'next/navigation';
import Image from 'next/image';

const YearPage = () => {
  const { year } = useParams();  // Get the dynamic year from the URL

  const images = [
    { id: 1, src: `/images/${year}/image1.png`, alt: `${year} Image 1` },
    { id: 2, src: `/images/${year}/image2.png`, alt: `${year} Image 2` },
    { id: 3, src: `/images/${year}/image3.png`, alt: `${year} Image 3` },
  ];

  return (
    <div className='flex items-center justify-center'>
      <div className='absolute z-20'>
        <p className='text-white text-[20px]'>Gallery {'>'} Media {'>'}<span className='text-yellow-500'> {year} Images</span> </p>
      <h1 className='text-white font-[600] text-[40px] lg:text-[60px]'>{year} Images</h1>
      </div>
      <div className='w-full'>
        <Image 
          src='/thumbnail/Landing page (1).png' 
          alt='Landing Page' 
          className='z-0 max-h-[700px] object-cover'
          layout="responsive" 
          width={1000}  // Replace with the actual width of your image 
          height={800}  // Replace with the actual height of your image
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative w-full h-64 overflow-hidden">
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearPage;
