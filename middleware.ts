import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split('/');

  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/dashboard',
    '/settings',
    '/courses/enrolled'
  ];
  const currentPath = `/${segments.join('/')}`;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      // Redirect to login page with return URL
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (locale != null && segments.join('/') === 'profile') {
    const usesNewProfile =
      (request.cookies.get('NEW_PROFILE')?.value || 'false') === 'true';

    if (usesNewProfile) {
      request.nextUrl.pathname = `/${locale}/profile/new`;
    }
  }

  const handleI18nRouting = createMiddleware({
    locales: ['en', 'ar'],
    defaultLocale: 'en'
  });
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};
