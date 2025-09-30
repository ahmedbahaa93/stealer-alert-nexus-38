import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const targetPath = url.searchParams.get('path');

  if (!targetPath) {
    return NextResponse.json(
      { error: 'Missing required path parameter' },
      { status: 400 }
    );
  }

  // Forward all query parameters except the path
  const searchParams = new URLSearchParams();
  url.searchParams.forEach((value, key) => {
    if (key !== 'path') {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const targetUrl = `${API_BASE_URL}${targetPath}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
  }
}
