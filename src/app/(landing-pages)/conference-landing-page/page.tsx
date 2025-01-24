"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import RegistrationMessage from './message';

// const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const targetDateTime = new Date(targetDate).getTime(); // Convert to a number
//       const currentTime = new Date().getTime(); // Also a number
//       const difference = targetDateTime - currentTime;

//       if (difference > 0) {
//         setTimeLeft({
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//           minutes: Math.floor((difference / 1000 / 60) % 60),
//           seconds: Math.floor((difference / 1000) % 60),
//         });
//       } else {
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       }
//     };

//     const timer = setInterval(calculateTimeLeft, 1000);
//     return () => clearInterval(timer);
//   }, [targetDate]);

//   return (
//     <div className='flex items-center gap-5'>
//       <div className='flex flex-col items-center'>
//         <h1 className='text-[42px] font-[500]'>{timeLeft.days}</h1>
//         <p className='font-[500] text-[18px]'>Days</p>
//       </div>
//       <div className='flex items-center'><p className='font-bold'>:</p></div>
//       <div className='flex flex-col items-center'>
//         <h1 className='text-[42px] font-[500]'>{timeLeft.hours}</h1>
//         <p className='font-[500] text-[18px]'>Hrs</p>
//       </div>
//       <div><p className='font-bold'>:</p></div>
//       <div className='flex flex-col items-center'>
//         <h1 className='text-[42px] font-[500]'>{timeLeft.minutes}</h1>
//         <p className='font-[500] text-[18px]'>Mins</p>
//       </div>
//       <div><p className='font-bold'>:</p></div>
//       <div className='flex flex-col items-center'>
//         <h1 className='text-[42px] font-[500] text-[#D5B93C]'>{timeLeft.seconds}</h1>
//         <p className='font-[500] text-[18px] text-[#D5B93C]'>Secs</p>
//       </div>
//     </div>
//   );
// };


const ConferenceDetailsPage = () => {
  const [conferenceDetails, setConferenceDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get('id');

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (!conferenceId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch conference details');
        }

        const data = await response.json();
        
        if (data.status === "success") {
          setConferenceDetails(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch conference details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [conferenceId]);

  if (isLoading) {
    return <div>Loading conference details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!conferenceDetails) {
    return <div>No conference details found</div>;
  }

  // If not registered, show registration message
  if (!conferenceDetails.is_registered) {
    return (
      <RegistrationMessage 
      conferenceTitle={conferenceDetails.title} 
    />
    );
  }

  // If registered, show conference details
  return (
    <div>
      <div className='text-[#fff] md:px-14 px-10 py-32 mx-auto gap-5 min-h-screen background'>
        <div className='lg:flex justify-between items-center'>
          {/* <CountdownTimer targetDate={conferenceDetails.date} /> */}
        </div>
        
        <div className='flex flex-col items-center justify-center min-h-[500px]'>
          <div className='flex items-center justify-center pt-10'>
            <h1 className='text-[40px] lg:text-[80px] font-[600] text-center lg:max-w-[75%]'>
              {conferenceDetails.title}
            </h1>
          </div>
          
          <div className='lg:max-w-[60%] text-center pt-5 pb-4'>
            <p className='text-[18px] lg:text-[20px] font-[400] opacity-[0.7]'>
              <span className='text-[#D5B93C]'>Theme:</span> {conferenceDetails.theme}
            </p>
          </div>
          
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetailsPage;