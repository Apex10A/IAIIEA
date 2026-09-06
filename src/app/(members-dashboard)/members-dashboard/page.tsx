import DashboardClient from './DashboardClient';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardClient />
    </Suspense>
  );
}