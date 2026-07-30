'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Until L7 programmes hub exists, send visitors to upcoming events on the home page. */
export default function ProgrammesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#upcoming-events');
  }, [router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-[#0B142F]/60">
      Redirecting to upcoming events…
    </div>
  );
}
