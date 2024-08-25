"use client";

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Holiday = {
  localName: string;
  date: string;
};

type HolidayCountdownProps = {
  holidays: Holiday[];
};

export default function HolidayCountdown({ holidays }: HolidayCountdownProps) {
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (selectedHoliday) {
      const updateCountdown = () => {
        const now = new Date();
        const holidayDate = new Date(selectedHoliday.date);
        const timeLeft = holidayDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        setCountdown(daysLeft);
      };

      updateCountdown(); 

      const timer = setInterval(updateCountdown, 1000 * 60 * 60 * 24); 

      return () => clearInterval(timer);
    }
  }, [selectedHoliday]);

  const handleHolidaySelect = (value: string) => {
    const holiday = holidays.find(h => h.localName === value);
    setSelectedHoliday(holiday || null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Public Holiday Countdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={handleHolidaySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a holiday" />
            </SelectTrigger>
            <SelectContent>
              {holidays.map(holiday => (
                <SelectItem key={holiday.date} value={holiday.localName}>
                  {holiday.localName} ({new Date(holiday.date).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedHoliday && countdown !== null && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{selectedHoliday.localName}</h2>
              <p className="text-4xl font-bold">{countdown} days</p>
              <p className="text-sm text-gray-500 mt-1">until {new Date(selectedHoliday.date).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
