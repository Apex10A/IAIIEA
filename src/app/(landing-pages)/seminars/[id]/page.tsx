"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/modules/ui/badge';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useSession } from "next-auth/react";
import '@/app/index.css'

interface SeminarDetails {
  title: string;
  status: string;
  theme: string;
  date: string;
  venue: string;
  resources?: string[];
}
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}


const SeminarDetailsPage = () => {
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conferenceDate, setConferenceDate] = useState<Date | null>(null);
  const params = useParams();
   const { data: session } = useSession();
  const seminarId = params.id;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    const fetchSeminarDetails = async () => {
      if (!seminarId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${seminarId}`, {
          headers: {
            'Authorization': `Bearer ${bearerToken}` // Assuming token is stored in localStorage
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch seminar details');
        }

        const data = await response.json();
        
        if (data.status === "success") {
          setSeminarDetails(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch seminar details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeminarDetails();
  }, [seminarId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading seminar details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!seminarDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">No seminar details found</p>
      </div>
    );
  }

  // Countdown Timer Component
  const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  
    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = targetDate.getTime() - new Date().getTime();
        
        if (difference <= 0) {
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
        }
        
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      };
  
      setTimeLeft(calculateTimeLeft());
      
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      return () => clearInterval(timer);
    }, [targetDate]);
  
    return (
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xs md:text-sm">Days</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xs md:text-sm">Hours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xs md:text-sm">Minutes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xs md:text-sm">Seconds</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 conference-bg">
      <div className="max-w-4xl mx-auto pt-32">
      <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 md:pt-20 gap-6">
        <div className="w-full md:w-auto">
          {conferenceDate && <CountdownTimer targetDate={conferenceDate} />}
        </div>
        <div>
          <button className="bg-[#D5B93C] px-4 sm:px-8 py-3 font-bold uppercase text-[#0E1A3D] rounded-md w-full md:w-auto">
            Conference portal
          </button>
        </div>
      </div>
      <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{seminarDetails.title}</h1>
              <Badge className={seminarDetails.status === 'Ongoing' ? 'bg-green-500' : 'bg-blue-500'}>
                {seminarDetails.status}
              </Badge>
            </div>
        <div className="">        
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Theme</h3>
              <p className="text-gray-600">{seminarDetails.theme}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>{seminarDetails.date}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span>{seminarDetails.venue}</span>
              </div>
            </div>
            {seminarDetails.resources && seminarDetails.resources.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Resources</h3>
                <ul className="list-disc pl-5">
                  {seminarDetails.resources.map((resource, index) => (
                    <li key={index} className="text-gray-600">{resource}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeminarDetailsPage;