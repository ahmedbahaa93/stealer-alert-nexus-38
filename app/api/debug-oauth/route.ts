import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'Google OAuth Debug Info - Updated Credentials',
      timestamp: new Date().toISOString(),
      project: 'raiseup-production',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'NOT_SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
          ? 'SET (hidden)'
          : 'NOT_SET',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
          ? 'SET (hidden)'
          : 'NOT_SET'
      },
      newCredentials: {
        projectId: 'raiseup-production',
        clientId:
          '414450089870-dqoad4a8fa4np9klr01d6icilndhsosv.apps.googleusercontent.com',
        redirectUris: [
          'https://raiseup-front.vercel.app/api/auth/callback/google',
          'http://localhost:3000/api/auth/callback/google'
        ],
        javascriptOrigins: [
          'https://raiseup-front.vercel.app',
          'http://localhost:3000'
        ]
      },
      notice:
        'Need to add more localhost ports (3001, 3002) to Google Console for development',
      instructions: {
        message: 'Updated with new Google Cloud Project: raiseup-production',
        nextSteps: [
          '1. Update Vercel environment variables with new credentials',
          '2. Add localhost:3001 and localhost:3002 to Google Console JavaScript origins',
          '3. Add corresponding redirect URIs for ports 3001 and 3002',
          '4. Test authentication on both local and production'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
