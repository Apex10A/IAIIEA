// components/VideoResourceCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoResource } from '@/types/conference';

export const VideoResourceCard: React.FC<VideoResource> = ({ 
    imageUrl, 
    duration, 
    title, 
    hasAudio = true 
}) => (
    <div className='w-full lg:max-w-[600px] mb-8'>
        <div className='relative'>
            <div className='absolute z-[20] bottom-5 right-5'>
                <span className='bg-[#f2e9c3] px-3 py-2 rounded-md font-[600] text-[18px]'>{duration}</span>
            </div>
            <div className='absolute z-[20] top-7 right-0'>
                <span className='bg-[#f2e9c3] px-5 py-3 rounded-l-[30px] font-[500] text-[18px]'>Video resources</span>
            </div>
            <Image
                src={imageUrl}
                alt={title}
                width={600}
                height={400}
                className='w-full h-auto rounded-t-2xl'
                loading="lazy"
            />
        </div>
        <div className='bg-white border rounded-b-2xl px-7 pt-3 pb-8'>
            <p className='text-[#0B142F] text-[20px] md:text-[24px] font-[500] pt-3 pb-2'>{title}</p>
            {hasAudio && <Link href='/' className='font-[600] underline pt-3'>Audio listen</Link>}
        </div>
    </div>
);