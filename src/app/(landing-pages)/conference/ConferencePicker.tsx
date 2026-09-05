'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatLandingEventDate } from '../utils/landingEventDates';
import { Button } from '@/components/ui/button';

interface ConferenceListItem {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

export default function ConferencePicker() {
  const router = useRouter();
  const [conferences, setConferences] = useState<ConferenceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch conferences');
        }

        const data = await response.json();
        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to load conferences');
        }

        const list = data.data as ConferenceListItem[];
        const incoming = list.filter((conf) => conf.status === 'Incoming');

        if (incoming.length === 1) {
          router.replace(`/conference?id=${incoming[0].id}`);
          return;
        }

        const active = list.filter(
          (conf) => conf.status === 'Incoming' || conf.status === 'Ongoing'
        );
        setConferences(active.length > 0 ? active : list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conferences');
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Loader2 className="w-12 h-12 text-[#D5B93C] animate-spin mb-4" />
        <p className="text-white/70">Loading conferences…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <p className="text-white/70 max-w-md mb-6">{error}</p>
        <Button asChild className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (conferences.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">No conferences available</h2>
        <p className="text-white/70 max-w-md mb-6">
          Check back later for upcoming IAIIEA conferences.
        </p>
        <Button asChild className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="conference-bg min-h-screen pt-24 px-4 md:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#D5B93C] mb-2 text-center">
          Choose a conference
        </h1>
        <p className="text-white/70 text-center mb-10">
          Select a conference to view details and registration options.
        </p>

        <div className="space-y-4">
          {conferences.map((conf) => (
            <button
              key={conf.id}
              type="button"
              onClick={() => router.push(`/conference?id=${conf.id}`)}
              className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#D5B93C]">
                    {conf.status}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1 group-hover:text-[#D5B93C] transition-colors">
                    {conf.title}
                  </h2>
                  <p className="text-white/60 text-sm mt-1 line-clamp-2">{conf.theme}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 shrink-0" />
                      {formatLandingEventDate(conf.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {conf.venue}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-[#D5B93C] shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity self-end md:self-center" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
