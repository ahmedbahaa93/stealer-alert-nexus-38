'use client';

import { usePathname } from 'next/navigation';
import BackToTheTop from '@/components/layout/BackToTheTop';
import Footer from '@/components/layout/Footer/Footer';
import Nav from '@/components/layout/Header/Nav';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();

    // Check if the current route is an auth route
    const isAuthRoute = pathname.includes('/signup') || pathname.includes('/login') || pathname.includes('/auth');

    if (isAuthRoute) {
        // For auth routes, render only children without navigation
        return <>{children}</>;
    }

    // For non-auth routes, render with full navigation
    return (
        <>
            <Nav />
            {children}
            <BackToTheTop />
            <Footer />
        </>
    );
}
