'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from '@/i18n/routing';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  fallback = null,
  redirectTo = '/login'
}: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isClient, isAuthenticated, router, redirectTo]);

  // Don't render anything on server or while checking auth
  if (!isClient) {
    return fallback;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}
