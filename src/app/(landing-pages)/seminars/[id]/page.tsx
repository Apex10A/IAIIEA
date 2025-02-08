"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/modules/ui/badge';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import '@/app/index.css'

interface SeminarDetails {
  title: string;
  status: string;
  theme: string;
  date: string;
  venue: string;
  resources?: string[];
}

const SeminarDetailsPage = () => {
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const seminarId = params.id;

  useEffect(() => {
    const fetchSeminarDetails = async () => {
      if (!seminarId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${seminarId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto pt-32">
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