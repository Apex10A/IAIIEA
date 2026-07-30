"use client"
import React, { Suspense } from 'react';
import ConferenceResources from './component/ConferenceResources';
import { Loader2 } from 'lucide-react';

const ConferenceResourcesFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const Page = () => {
  return (
    <Suspense fallback={<ConferenceResourcesFallback />}>
      <ConferenceResources />
    </Suspense>
  );
};

export default Page;
