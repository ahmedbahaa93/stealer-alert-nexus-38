#!/bin/bash

# RaiseUp Frontend Deployment Script
# This script prepares the project for production deployment

echo "🚀 Starting RaiseUp Frontend Deployment Process..."

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

if [ -z "$NEXTAUTH_URL" ]; then
    echo "⚠️  WARNING: NEXTAUTH_URL not set. Make sure to set this in production!"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "⚠️  WARNING: NEXTAUTH_SECRET not set. Make sure to set this in production!"
fi

if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ ERROR: GOOGLE_CLIENT_ID not set. This is required for Google OAuth!"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ ERROR: GOOGLE_CLIENT_SECRET not set. This is required for Google OAuth!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Run build
echo "🔨 Building the application..."
yarn build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Deployment preparation complete!"
    echo ""
    echo "📋 Next steps for deployment:"
    echo "1. Set environment variables in your hosting platform:"
    echo "   - NEXTAUTH_URL=https://your-domain.com"
    echo "   - NEXTAUTH_SECRET=your-super-secure-secret"
    echo "   - GOOGLE_CLIENT_ID=1052837195692-r7mt002598g0ladssv568hfmbp1kr5le.apps.googleusercontent.com"
    echo "   - GOOGLE_CLIENT_SECRET=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"
    echo "   - BACKEND_API_URL=https://booking-courses-gilt.vercel.app/api/v1"
    echo ""
    echo "2. Update Google Cloud Console with production redirect URI:"
    echo "   https://your-domain.com/api/auth/callback/google"
    echo ""
    echo "3. Deploy the .next folder and other necessary files"
    echo ""
    echo "✅ Your application is ready for production deployment!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
