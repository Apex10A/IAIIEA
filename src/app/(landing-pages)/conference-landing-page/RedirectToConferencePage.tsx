'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** Legacy URLs under /conference-landing-page → canonical /conference?id= */
export default function RedirectToConferencePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    router.replace(id ? `/conference?id=${id}` : '/conference');
  }, [router, searchParams]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-[#0B142F]/60">
      Redirecting to conference…
    </div>
  );
}
