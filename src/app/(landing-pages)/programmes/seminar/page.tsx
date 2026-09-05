'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy route → programmes hub with seminar filter. */
export default function ProgrammesSeminarRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/programmes?type=seminar');
  }, [router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-[#0B142F]/60">
      Redirecting to seminars…
    </div>
  );
}
