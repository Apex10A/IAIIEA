"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import {
  formatLandingEventDate,
  parseEventDateForSort,
} from '../utils/landingEventDates';

interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: 'Ongoing' | 'Incoming' | 'Completed';
  resources: any[];
}

interface ApiResponse {
  status: string;
  message: string;
  data: Seminar[];
}

const SeminarListPage = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
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

        const { status, message, data }: ApiResponse = await response.json();

        if (status === 'success') {
          const activeSeminars = data.filter(
            (seminar) => seminar?.status === 'Incoming' || seminar?.status === 'Ongoing'
          );

          const sortedSeminars = activeSeminars.sort(
            (a, b) => parseEventDateForSort(a.date) - parseEventDateForSort(b.date)
          );

          setSeminars(sortedSeminars);
        } else {
          throw new Error(message || 'Failed to fetch seminars');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const handleSeminarClick = (id: number) => {
    router.push(`/seminars/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FBFF] flex items-center justify-center pt-24">
        <div className="text-center text-[#0B142F]/60">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p>Loading seminars…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FBFF] flex items-center justify-center pt-24 px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700 max-w-md">
          <p className="font-semibold mb-2">Error loading seminars</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFF] pt-24 pb-16 px-4 md:px-8 lg:px-14">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-10">
          <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-3">
            Seminars
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B142F] mb-4">
            Training &amp; Workshops
          </h1>
          <p className="text-lg text-gray-600">
            Upcoming and ongoing IAIIEA seminars. Open a programme for details and registration.
          </p>
        </div>

        {seminars.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-gray-500 italic mb-4">No active seminars right now.</p>
            <Link
              href="/programmes?type=seminar"
              className="inline-flex items-center text-blue-600 font-bold text-sm"
            >
              Browse all programmes <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seminars.map((seminar) => (
              <article
                key={seminar.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group border border-gray-100 cursor-pointer"
                onClick={() => handleSeminarClick(seminar.id)}
              >
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600" />

                <div className="p-8">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {seminar.status}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Seminar
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#0B142F] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {seminar.title}
                  </h2>

                  <p className="text-gray-500 text-sm mb-6 line-clamp-3">{seminar.theme}</p>

                  <div className="space-y-3 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500 shrink-0" />
                      <span>{formatLandingEventDate(seminar.date)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="mt-0.5 text-blue-500 shrink-0" />
                      <span className="line-clamp-2">{seminar.venue || 'Venue TBA'}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-end">
                    <span className="inline-flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-0.5 transition-transform">
                      View details <FaArrowRight className="ml-2" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeminarListPage;
