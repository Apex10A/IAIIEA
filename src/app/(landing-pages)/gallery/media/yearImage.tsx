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
        <div className='group-hover:bg-[#000]'>
        <Image src={imageUrl} alt='' width={600} height={500} className='transform transition-transform rounded-[30px] duration-500 ease-in-out group-hover:scale-110  '/>
        </div>
        <div>
        <span className='absolute bottom-20 left-5 text-white font-[600] text-2xl'>{year}</span>
        </div>
        <div className='border border-[#fff] rounded-full absolute bottom-20 right-5 px-2 py-2'>
        <Link href={`/gallery/media/years/${year}`} passHref>
            <FiArrowRight className='w-6 h-6 text-white'/>
        </Link>
        </div>
    </div>
  )
}

export default YearImage