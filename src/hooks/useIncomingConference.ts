import { useState, useEffect } from 'react';

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  flyer: string;
}

export const useIncomingConference = () => {
  const [incomingConference, setIncomingConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomingConference = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch conferences');
        }

        const data = await response.json();
        if (data.status === 'success') {
          // Find the first incoming conference
          const incoming = data.data.find((conf: Conference) => conf.status === 'Incoming');
          setIncomingConference(incoming || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIncomingConference();
  }, []);

  return { incomingConference, loading, error };
}; 