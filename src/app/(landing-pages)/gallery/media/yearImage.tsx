"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

interface YearImageProps {
  year: string | number
  imageUrl: string
}

const YearImage: React.FC<YearImageProps> = ({year, imageUrl}) => {
  return (
    <div className='group relative overflow-hidden w-full max-w-xl mx-auto cursor-pointer'>
      <div className='relative'>
        <Image 
          src={imageUrl} 
          alt='' 
          width={600} 
          height={500} 
          className='w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110'
        />
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity duration-500'></div>
      </div>
      <div>
        <span className='absolute bottom-20 left-5 text-white font-[600] text-2xl z-10'>{year}</span>
      </div>
      <div className='border border-[#fff] rounded-full absolute bottom-20 right-5 px-2 py-2 z-10'>
        <Link href={`/gallery/media/years/${year}`} passHref>
          <FiArrowRight className='w-6 h-6 text-white'/>
        </Link>
      </div>
    </div>
  )
}

export default YearImage