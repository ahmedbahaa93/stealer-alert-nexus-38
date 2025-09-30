import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
});

export const metadata: Metadata = {
    title: 'RiseUp Authentication',
    description: 'RiseUp Authentication Pages'
};

export default async function AuthLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    await params; // Ensure params are awaited for Next.js
    const messages = await getMessages();

    return (
        <div className={`${inter.variable} font-inter min-h-screen bg-[#f3f8fb]`}>
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </div>
    );
}
