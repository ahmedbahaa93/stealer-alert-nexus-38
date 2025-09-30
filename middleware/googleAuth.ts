/**
 * Backend Google OAuth Middleware
 *
 * This middleware intercepts the Google OAuth callback from our backend
 * and redirects it to our own handler with the auth data.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if this is a Google OAuth callback with authentication data
  if (request.nextUrl.pathname === '/api/v1/auth/google/callback') {
    const url = new URL(request.url);

    // Extract JSON data from response if it exists
    const body = request.headers
      .get('content-type')
      ?.includes('application/json')
      ? request.body
      : null;

    // If we have a JSON body, we can redirect to our callback handler with the data
    if (body) {
      const callbackParam = url.searchParams.get('callback');

      if (callbackParam) {
        // Redirect to the callback URL with the auth data
        const callbackUrl = new URL(callbackParam);
        callbackUrl.searchParams.set(
          'data',
          encodeURIComponent(JSON.stringify(body))
        );
        return NextResponse.redirect(callbackUrl);
      }
    }
  }

  // For all other requests, continue normal processing
  return NextResponse.next();
}

export const config = {
  // Only run this middleware for the Google OAuth callback path
  matcher: '/api/v1/auth/google/callback'
};
