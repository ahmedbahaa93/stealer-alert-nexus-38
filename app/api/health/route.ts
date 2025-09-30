import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables (don't expose secrets, just check if they exist)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET ✅' : 'MISSING ❌',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET ✅' : 'MISSING ❌',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET ✅' : 'MISSING ❌',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
        ? 'SET ✅'
        : 'MISSING ❌',
      BACKEND_API_URL: process.env.BACKEND_API_URL ? 'SET ✅' : 'MISSING ❌'
    };

    // Check if any required variables are missing
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);
    const allRequiredSet = missingVars.length === 0;

    return NextResponse.json({
      status: allRequiredSet ? 'HEALTHY ✅' : 'MISSING_ENV_VARS ❌',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      missingVariables: missingVars,
      message: allRequiredSet
        ? 'All required environment variables are set!'
        : `Missing required variables: ${missingVars.join(', ')}. Please set them in Vercel dashboard.`,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT_SET'
    });
  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json(
      {
        status: 'ERROR ❌',
        message: 'Environment check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
