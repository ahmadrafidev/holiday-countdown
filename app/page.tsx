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
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
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
      <div className="mb-8">
        <label htmlFor="country-select" className="mr-2">Select a country:</label>
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
    </main>
  );
};

export default Page;
