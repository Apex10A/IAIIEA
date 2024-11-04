"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Speakers from '../seminar-landing-page/speakers/page';
import Conference from '../seminar-landing-page/conference/page';
import Pricing from '../seminar-landing-page/pricing/page'
import '@/app/index.css';

interface CountdownProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDateTime = new Date(targetDate).getTime(); // Convert to a number
      const currentTime = new Date().getTime(); // Also a number
      const difference = targetDateTime - currentTime;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className='flex items-center gap-5'>
      <div className='flex flex-col items-center'>
        <h1 className='text-[42px] font-[500]'>{timeLeft.days}</h1>
        <p className='font-[500] text-[18px]'>Days</p>
      </div>
      <div className='flex items-center'><p className='font-bold'>:</p></div>
      <div className='flex flex-col items-center'>
        <h1 className='text-[42px] font-[500]'>{timeLeft.hours}</h1>
        <p className='font-[500] text-[18px]'>Hrs</p>
      </div>
      <div><p className='font-bold'>:</p></div>
      <div className='flex flex-col items-center'>
        <h1 className='text-[42px] font-[500]'>{timeLeft.minutes}</h1>
        <p className='font-[500] text-[18px]'>Mins</p>
      </div>
      <div><p className='font-bold'>:</p></div>
      <div className='flex flex-col items-center'>
        <h1 className='text-[42px] font-[500] text-[#D5B93C]'>{timeLeft.seconds}</h1>
        <p className='font-[500] text-[18px] text-[#D5B93C]'>Secs</p>
      </div>
    </div>
  );
};

const Page = () => {
  const targetDate = '2024-11-02T00:00:00';

  return (
    <div>
      <div className='text-[#fff] md:px-14 px-10 py-32 mx-auto gap-5 min-h-screen background'>
        <div className='lg:flex justify-between items-center'>
          <CountdownTimer targetDate={targetDate} />
          <div>
            <Link href='/conference-Registration'>
              <button className="bg-transparent border-2 mt-3 border-[#D5B93C] px-8 py-3 font-[600] tracking-widest text-[#D5B93C] text-[20px] uppercase ">
                Register for conference
              </button>
            </Link>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center min-h-[500px]'>
          <div className='flex items-center justify-center pt-10'>
            <h1 className='text-[40px] lg:text-[80px] font-[600] text-center lg:max-w-[75%]'>
              <span className='text-[#D5B93C]'>7th </span>
              International Association for 
              <span className='text-[#D5B93C]'> Innovations</span> in 
              <span className='text-[#D5B93C]'> Educational Assessment </span> 
              Annual Conference
            </h1>
          </div>
          <div className='lg:max-w-[60%] text-center pt-5 pb-4'>
            <p className=' text-[18px] lg:text-[20px] font-[400] opacity-[0.7]'>
              <span className='text-[#D5B93C]'>Theme:</span> Transforming Learning and Assessment Through The Application of Big Data and Artificial Intelligence
            </p>
          </div>
          <div className='lg:max-w-[50%] text-center flex items-start pb-2 gap-1'>
            <Image src='/icons/Calendar.png' alt='' width={25} height={25}/>
            <p className=' text-[18px] lg:text-[20px] font-[400] opacity-[0.7]'>
              UBEC Digital Resource Centre, Opposite Next Gen (Cash and Carry) Supermarket, Mabushi, Jahi District, Abuja. Nigeria. West Africa.
            </p>
          </div>
          <div className='flex items-start gap-3'>
            <Image src='/icons/MapPinArea.png' alt='' width={25} height={25}/>
            <p className='text-[20px] font-[400] opacity-[0.7]'>
              Mon, Nov 2 - Fri, Nov 8 
            </p>
          </div>
        </div>
      </div>
      <Speakers/>
      <Pricing />
      <Conference />
    </div>
  );
};

export default Page;
