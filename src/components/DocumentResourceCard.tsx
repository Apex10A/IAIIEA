// components/DocumentResourceCard.tsx
import React from 'react';
import Image from 'next/image';
import { DocumentResource } from '@/types/conference';

export const DocumentResourceCard: React.FC<DocumentResource> = ({ 
    icon, 
    title, 
    link, 
    bgColor = 'bg-[#e9ebf3]', 
    type 
}) => (
    <div className='flex flex-col md:flex-row items-stretch mb-6 w-full max-w-[800px]'>
        <div className={`${bgColor} rounded-t-[30px] md:rounded-l-[30px] md:rounded-tr-none p-3 flex items-center justify-center min-h-[100px] md:min-h-[175px] md:w-[150px]`}>
            <Image 
                src={icon} 
                alt={type} 
                width={80} 
                height={80}
                loading="lazy" 
            />
        </div>
        <div className='bg-[#f5f4f3] rounded-b-[30px] md:rounded-r-[30px] md:rounded-bl-none p-5 flex-1'>
            <p className='font-[600] pb-3 text-lg md:text-xl'>{title}</p>
            <p className='text-sm md:text-base break-all'>{link}</p>
        </div>
    </div>
);