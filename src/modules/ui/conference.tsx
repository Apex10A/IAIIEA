import React, { useState } from 'react';
import Image from 'next/image';

const conference = () => {

    return (
        <div className='flex items-center justify-center py-20'>
            <div className='max-w-[600] '>
            <div className='relative'>
                <div className='absolute z-[20] bottom-5 left-5'>
                    <button className='bg-[#f2e9c3] px-3 py-2 rounded-md font-[600] text-[18px]'>Completed</button>
                </div>
                <Image  
                  src='/Meeting.png'
                  alt=''
                  className=''
                  width={600}
                  height={400}
                  />
            </div>
            <div className='bg-[#fff] border rounded-b-2xl px-7 pt-3 pb-8 max-w-[600px]'>
                <h1 className='text-[#0B142F] text-[40px] font-[500]'>Conference 2024</h1>
                <p className='text-[#0B142F] text-[19px] font-[500] max-w-xl'>Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence</p>
                <p className='text-[#0B142F] text-[19px] font-[400] pt-2 pb-3'>Mon, Nov 2 -  Fri, Nov 8 </p>
                <button className='bg-[#203A87] px-7 py-3 rounded-3xl text-[#fff] font-[500]'>Read</button>
            </div>
        </div>
        </div>
    );
};

export default conference;
