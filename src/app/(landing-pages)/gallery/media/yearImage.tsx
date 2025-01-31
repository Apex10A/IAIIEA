import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

interface YearImageProps {
  year: string | number
  imageUrl: string
  title?: string
}

const YearImage: React.FC<YearImageProps> = ({
  year, 
  imageUrl, 
  title = `Conference ${year}`
}) => {
  return (
    <div className='group border-2 border-gray-100 rounded-xl shadow-lg overflow-hidden w-full max-w-2xl mx-auto'>
      <div className='relative h-[500px] w-full overflow-hidden'>
        <Image
          src={imageUrl}
          alt={`${title} image`}
          fill
          className='object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300'></div>
      </div>
      
      <div className='bg-white p-5 flex items-center justify-between'>
        <span className='text-black font-bold text-xl truncate pr-4'>
          {title}
        </span>
        
        <Link 
          href={`/gallery/media/years/${year}`} 
          className='group/link'
          passHref
        >
          <div className='border border-black/20 hover:border-black rounded-full p-3 transition-colors'>
            <FiArrowRight 
              className='w-6 h-6 text-black group-hover/link:translate-x-1 transition-transform'
            />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default YearImage