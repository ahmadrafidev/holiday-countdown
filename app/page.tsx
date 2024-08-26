'use client';

import { useEffect, useState } from 'react';

import HolidayCountdown from '@/components/HolidayCountdown';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

const Page = () => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch('/api/holidays');
        if (!res.ok) {
          throw new Error('Failed to fetch holidays');
        }
        const data = await res.json();
        setHolidays(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 md:p-24">
      <header className="p-3 absolute top-0 right-0">
        <DarkModeToggle />
      </header>
      <HolidayCountdown holidays={holidays} />
    </main>
  );
};

export default Page;
