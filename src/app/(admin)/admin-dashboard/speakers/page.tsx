"use client"
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';

// TypeScript interface for a speaker
interface Speaker {
  speaker_id: string;
  speaker_image: string;
  speaker_name: string;
  speaker_institution: string;
}

// TypeScript interface for API response
interface ApiResponse {
  status: string;
  message: string;
  data: Speaker[];
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch speakers data when component mounts
    const fetchSpeakers = async () => {
      try {
        // Changed to the correct endpoint for speakers
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speakers_list`, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        if (data.status === 'success') {
          setSpeakers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch speakers');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching speakers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bearerToken) {
      fetchSpeakers();
    }
  }, [bearerToken]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-[#203a87] to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Our Distinguished Speakers</h1>
          <p className="text-xl text-center mt-4 max-w-2xl mx-auto">
            Meet the thought leaders and experts who will be sharing their knowledge and insights.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : speakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <div 
                key={speaker.speaker_id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={speaker.speaker_image}
                    alt={speaker.speaker_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      // Provide a fallback image if loading fails
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-speaker.jpg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{speaker.speaker_name}</h2>
                  <p className="text-gray-600">{speaker.speaker_institution}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No speakers found. Please check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
}