"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

interface Speaker {
  name: string;
  title: string;
  picture: string;
}

interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

interface SeminarDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[];
  work_shop: string[];
  speakers: Speaker[];
  resources: Resource[];
}

const SeminarsList = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminar, setSelectedSeminar] = useState<SeminarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchSeminars = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
      const data = await response.json();
      if (data.status === "success") {
        const sortedSeminars = data.data.sort((a: Seminar, b: Seminar) => {
          const yearA = new Date(a.date).getFullYear();
          const yearB = new Date(b.date).getFullYear();
          return yearB - yearA;
        });
        setSeminars(sortedSeminars);
      }
    } catch (error) {
      console.error('Error fetching seminars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeminarDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setSelectedSeminar(data.data);
      }
    } catch (error) {
      console.error('Error fetching seminar details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderSeminarCard = (seminar: Seminar) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{seminar.title}</h3>
        <p className="text-gray-600 mt-2">{seminar.theme}</p>
      </div>
      <div className="text-sm text-gray-500">
        <p className="mb-2">{seminar.venue}</p>
        <p>{seminar.date}</p>
      </div>
      <button 
        onClick={() => fetchSeminarDetails(seminar.id)}
        className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
      >
        View Details
      </button>
    </div>
  );

  const renderSeminarDetails = (details: SeminarDetails) => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setSelectedSeminar(null)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Seminars
        </button>
      </div>

      <div className="">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{details.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h1 className="font-bold md:text-2xl text-md uppercase opacity-[0.9]">{details.theme}</h1>
            {details.venue && (
              <p className="text-gray-600"><span className="font-semibold">Venue:</span> {details.venue}</p>
            )}
            <p className="text-gray-600"><span className="font-semibold">Date:</span> {details.date}</p>
            <p className="text-gray-600"><span className="font-semibold">Time:</span> {details.start_time}</p>
          </div>
        </div>
      </div>
      <div>
        <hr />
      </div>
      {details.sub_theme.length > 0 && (
        <div className="">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Sub-themes</h3>
          <ul className="list-disc list-inside space-y-2">
            {details.sub_theme.map((theme, index) => (
              <li key={index} className="text-gray-600">{theme}</li>
            ))}
          </ul>
        </div>
      )}

      {details.work_shop.length > 0 && (
        <div className="">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Workshops</h3>
          <ul className="list-disc list-inside space-y-2">
            {details.work_shop.map((workshop, index) => (
              <li key={index} className="text-gray-600">{workshop}</li>
            ))}
          </ul>
        </div>
      )}
<div>
        <hr />
      </div>
      {details.speakers.length > 0 && (
        <div className="">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Speakers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.speakers.map((speaker, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-50 shadow-md rounded-lg">
                <div className="w-36 h-36 mb-4 rounded-md overflow-hidden ">
                  <img
                    src={speaker.picture}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-avatar.png';
                    }}
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 text-center">{speaker.name}</h4>
                <p className="text-sm max-w-[70%] opacity-[0.7] text-center mt-2">{speaker.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {details.resources.length > 0 && (
        <div className="">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {details.resources.map((resource) => (
              <div key={resource.resource_id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{resource.caption}</h4>
                <p className="text-sm text-gray-600 mb-3">Added: {new Date(resource.date).toLocaleDateString()}</p>
                {resource.file && (
                  <a
                    href={resource.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    Download Resource
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {selectedSeminar ? (
        renderSeminarDetails(selectedSeminar)
      ) : (
        <>
          <div className="bg-gray-200 px-5 py-3 mb-6">
            <h1 className="text-2xl font-semibold">Seminars</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seminars.map((seminar) => (
              <div key={seminar.id}>
                {renderSeminarCard(seminar)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SeminarsList;
