'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** Legacy URL: /seminar-landing-page?id= → canonical /seminars/[id] */
export default function SeminarLandingPageRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    router.replace(id ? `/seminars/${id}` : '/seminars');
  }, [router, searchParams]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-[#0B142F]/60">
      Redirecting to seminar…
    </div>
  );
}
