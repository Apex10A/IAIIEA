import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  resources: any[];
}

const SeminarCards = () => {
  const [seminar, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch seminars');
        }

        const data = await response.json();
        
        if (data.status === "success") {
          setSeminars(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch seminars');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const handleReadSeminar = (SeminarId: number) => {
    router.push(`/seminar-landing-page?id=${SeminarId}`);
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Loading Seminars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // Function to get background color based on index
  const getBgColor = (index: number) => {
    const colors = ['bg-blue-50', 'bg-amber-50', 'bg-emerald-50'];
    return colors[index % colors.length];
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const [datePart] = dateString.split('To').map(part => part.trim());
    return datePart;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {seminar.map((conference, index) => (
          <div
            key={conference.id}
            className={`${getBgColor(index)} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
          >
            <div className="relative">
              <div className="absolute z-20 bottom-5 left-5">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
                    conference.status === 'Completed'
                      ? 'bg-[#f2e9c3] text-[#0B142F] hover:bg-[#e9dba3]'
                      : 'bg-[#203A87] text-white hover:bg-[#152a61]'
                  }`}
                >
                  {conference.status}
                </button>
              </div>
              <Image
                src="/Meeting.png"
                alt={conference.title}
                width={600}
                height={400}
                className="w-full h-[250px] object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-[#0B142F] text-2xl lg:text-4xl font-semibold">
                  {conference.title}
                </h1>
                <span className="text-[#203A87] font-bold text-lg">
                  {conference.title.split(' ')[1]} {/* Extract year from title */}
                </span>
              </div>
              <p className="text-[#0B142F] text-base lg:text-lg font-medium mb-4 line-clamp-2">
                {conference.theme}
              </p>
              <p className="text-gray-600 text-sm lg:text-base font-medium mb-6">
                {conference.date}
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleReadSeminar(conference.id)}
                  className="bg-[#203A87] px-4 py-3 rounded-lg text-white font-medium hover:bg-[#152a61] transition-colors duration-300 flex-grow sm:flex-grow-0"
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeminarCards;