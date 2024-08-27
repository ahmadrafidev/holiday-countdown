import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentYear = new Date().getFullYear();
  const country = searchParams.get('country') || 'ID';

  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${country}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch holidays from Nager.Date API with status ${response.status}`);
    }

    const holidays = await response.json();
    return NextResponse.json(holidays);
  } catch (error: any) {
    console.error('Error fetching holidays:', error.message);
    return NextResponse.json({ error: 'Failed to fetch holidays' }, { status: 500 });
  }
}
