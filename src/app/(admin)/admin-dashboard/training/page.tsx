"use client"

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import TrainingResourcesNew from './component/TrainingResourcesNew';

const TrainingResourcesFallback = () => (
  <div className="flex justify-center items-center min-h-[50vh] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const TrainingPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-transparent">
    <Suspense fallback={<TrainingResourcesFallback />}>
      <TrainingResourcesNew />
    </Suspense>
  </div>
);

export default TrainingPage;
