/**
 * NextAuth Provider Wrapper
 * Provides NextAuth session context to the application
 */

'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface NextAuthProviderProps {
    children: ReactNode;
    session?: any;
}

export const NextAuthProvider = ({ children, session }: NextAuthProviderProps) => {
    return (
        <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
            {children}
        </SessionProvider>
    );
};
