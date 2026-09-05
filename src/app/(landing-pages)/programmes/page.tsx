'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { landingEventHref } from '../landing-page-one/eventLinks';

type ProgrammeType = 'conference' | 'seminar';
type TypeFilter = 'all' | ProgrammeType;
type StatusFilter = 'upcoming' | 'completed' | 'all';

interface ProgrammeEvent {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  flyer: string;
  type: ProgrammeType;
}

const parseEventDate = (dateString: string): number => {
  const [datePart] = dateString.split('To').map((part) => part.trim());
  const parsed = new Date(datePart).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatDate = (dateString: string) => {
  try {
    const [datePart] = dateString.split('To').map((part) => part.trim());
    const date = new Date(datePart);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const isUpcoming = (status: string) =>
  status === 'Incoming' || status === 'Ongoing';

export default function ProgrammesPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type');

  const [programmes, setProgrammes] = useState<ProgrammeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(
    initialType === 'conference' || initialType === 'seminar' ? initialType : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('upcoming');

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
        const [confResponse, semResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`),
        ]);

        if (!confResponse.ok || !semResponse.ok) {
          throw new Error('Failed to fetch programmes');
        }

        const confData = await confResponse.json();
        const semData = await semResponse.json();

        const conferences: ProgrammeEvent[] =
          confData.status === 'success'
            ? confData.data.map((item: Omit<ProgrammeEvent, 'type'>) => ({
                ...item,
                type: 'conference' as const,
              }))
            : [];

        const seminars: ProgrammeEvent[] =
          semData.status === 'success'
            ? semData.data.map((item: Omit<ProgrammeEvent, 'type'>) => ({
                ...item,
                type: 'seminar' as const,
              }))
            : [];

        setProgrammes([...conferences, ...seminars]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load programmes');
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  const filteredProgrammes = useMemo(() => {
    let list = programmes;

    if (typeFilter !== 'all') {
      list = list.filter((item) => item.type === typeFilter);
    }

    if (statusFilter === 'upcoming') {
      list = list.filter((item) => isUpcoming(item.status));
    } else if (statusFilter === 'completed') {
      list = list.filter((item) => item.status === 'Completed');
    }

    return [...list].sort((a, b) => {
      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);
      return statusFilter === 'completed' ? dateB - dateA : dateA - dateB;
    });
  }, [programmes, typeFilter, statusFilter]);

  const typeTabs: { id: TypeFilter; label: string }[] = [
    { id: 'all', label: 'All programmes' },
    { id: 'conference', label: 'Conferences' },
    { id: 'seminar', label: 'Seminars' },
  ];

  const statusTabs: { id: StatusFilter; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FBFF] pt-24 pb-16 px-4 md:px-8 lg:px-14">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-10">
          <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-3">
            Programmes
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B142F] mb-4">
            Conferences &amp; Seminars
          </h1>
          <p className="text-lg text-gray-600">
            Browse IAIIEA conferences and training seminars. Select a programme for
            details, fees, and registration.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {typeTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  typeFilter === tab.id
                    ? 'bg-[#0B142F] text-white'
                    : 'bg-white text-[#0B142F] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-[#0B142F]/60">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
            <p>Loading programmes…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredProgrammes.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-gray-500 italic">No programmes match these filters.</p>
          </div>
        )}

        {!loading && !error && filteredProgrammes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProgrammes.map((event) => (
              <article
                key={`${event.type}-${event.id}`}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group border border-gray-100"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={event.flyer || '/AboutTwo.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                  <div className="absolute top-5 left-5 flex gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${
                        event.type === 'conference'
                          ? 'bg-blue-600/90 text-white'
                          : 'bg-emerald-500/90 text-white'
                      }`}
                    >
                      {event.type}
                    </span>
                    {event.venue.toLowerCase().includes('virtual') && (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-600/90 text-white backdrop-blur-md">
                        Virtual
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.status && (
                      <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {event.status}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-[#0B142F] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {event.title}
                  </h2>

                  <div className="flex items-start gap-2 text-gray-500 text-sm mb-6">
                    <FaMapMarkerAlt className="mt-1 text-blue-500 shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 line-clamp-2">{event.theme}</p>
                    <Link
                      href={landingEventHref(event.id, event.type)}
                      className="inline-flex items-center text-blue-600 font-bold text-sm group/link shrink-0"
                    >
                      View <FaArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
