import React from 'react'
import Logo from '@/assets/auth/images/IAIIEA Logo I.png';
import Link from 'next/link';
import Image from 'next/image';

const page = () => {
  return (
    <div className='bg-[#0B142F] md:px-14 px-5 py-3 min-h-[300px] flex justify-between items-center'>
        <div className=''>
        <div className='text-[#fff]'>
        <div>
            <Link href="/" className='flex items-center w-full'>
              <Image src='/IAIIEA II.png' alt="Logo" width={400} height={400}/>
            </Link>
          </div>
        </div>
        <div className='flex items-center gap-3'>
            <p className='text-[#fff]'>+234803 429 2924,</p>
            <p className='text-[#fff]'>+234904 420 0021,</p>
            <p className='text-[#fff]'>+234816 565 2157</p>
        </div> 
        <div>
            <p className='text-[#fff]'>Bwari, Abuja, Nigeria</p>
        </div>
        <div>
            <p className='text-[#fff]'>info@iaiiea.org</p>
        </div>
        </div>

        <div>
            <div>
                <p className='text-[#fff]'>Useful links</p>
            </div>
            <div className='flex gap-5'>
            <div className='flex flex-col'>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
            </div>
            <div className='flex flex-col'>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
                <Link href='/' className='text-[#fff]'>
                  Home
                </Link>
            </div>
            </div>
        </div>
    </div>
  )
}

export default page