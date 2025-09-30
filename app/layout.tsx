import type { Metadata } from 'next';

import '@/app/globals.css';
import '@/app/globals-fix.css';
import '@/components/ui/carousel-layout-fixes.css';
import '@/components/ui/enhanced-card-hover.css';
import '@/components/ui/enhanced-scrolling.css';
import '@/components/ui/scrolling-fixes.css';
import '@/components/ui/counterbuters-fix.css';
import '@/components/ui/counterbuters-animation.css';
import '@/components/layout/Header/enhanced-nav.css';
import '@/components/layout/Header/perfect-mobile-menu.css';
import '@/components/layout/Header/mobile-menu-fixes.css';
import { Cairo } from 'next/font/google';
import { CustomToastProvider } from '@/components/ui/CustomToastProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';

const cairo = Cairo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cairo'
});

export const metadata: Metadata = {
  title: {
    default: 'RaiseUp - Professional Development & Career Growth',
    template: '%s | RaiseUp'
  },
  description: 'RaiseUp offers comprehensive professional development courses and career growth opportunities. Learn new skills, advance your career, and achieve your professional goals with our expert-led programs.',
  keywords: ['professional development', 'career growth', 'online courses', 'skill development', 'education', 'training', 'certification', 'RaiseUp'],
  authors: [{ name: 'RaiseUp Team' }],
  creator: 'RaiseUp',
  publisher: 'RaiseUp',
  applicationName: 'RaiseUp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://raiseup.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ar-SA': '/ar',
    },
  },
  openGraph: {
    title: 'RaiseUp - Professional Development & Career Growth',
    description: 'RaiseUp offers comprehensive professional development courses and career growth opportunities. Learn new skills, advance your career, and achieve your professional goals.',
    url: 'https://raiseup.com', // Replace with your actual domain
    siteName: 'RaiseUp',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'RaiseUp - Professional Development Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RaiseUp - Professional Development & Career Growth',
    description: 'RaiseUp offers comprehensive professional development courses and career growth opportunities.',
    images: ['/og-image.jpg'], // You'll need to add this image
    creator: '@raiseup', // Replace with your actual Twitter handle
    site: '@raiseup',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
  verification: {
    google: 'your-google-verification-code', // Replace with your actual Google verification code
    yandex: 'your-yandex-verification-code', // Replace with your actual Yandex verification code
  },
};

export default async function LocaleLayout({
  children
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <html lang="en" dir='ltr'>
      <body className={cairo.className} suppressHydrationWarning={true}>
        <NextAuthProvider>
          <CustomToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CustomToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
