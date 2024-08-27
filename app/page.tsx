'use client';

import { useEffect, useState } from 'react';

import HolidayCountdown from '@/components/HolidayCountdown';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

type Country = {
  countryCode: string;
  name: string;
};

const Page = () => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('ID');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        if (!res.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await res.json();
        setCountries(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/holidays?country=${selectedCountry}`);
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
  }, [selectedCountry]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-2xl font-sans font-medium tracking-tight text-black dark:text-white">Wait a moment. ⌛️</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-12 md:p-24">
      <header className="p-3 absolute top-0 right-0">
        <DarkModeToggle />
      </header>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="mb-4">
          <label htmlFor="country-select" className="mr-2 text-lg font-medium font-sans text-black dark:text-white">Select a country:</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="p-2 border rounded"
          >
            {countries.map((country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <HolidayCountdown holidays={holidays} />
      </div>
    </main>
  );
};

export default Page;
