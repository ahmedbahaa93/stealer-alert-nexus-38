/**
 * Debug utility for auth state
 * Helps troubleshoot profile navigation issues
 */

export const debugAuthState = () => {
  if (typeof window === 'undefined') {
    console.log('Running on server - no auth debug available');
    return;
  }

  console.log('=== AUTH STATE DEBUG ===');

  // Check localStorage
  const localAccessToken = localStorage.getItem('access_token');
  const localRefreshToken = localStorage.getItem('refresh_token');
  console.log(
    'localStorage access_token:',
    localAccessToken ? 'EXISTS' : 'MISSING'
  );
  console.log(
    'localStorage refresh_token:',
    localRefreshToken ? 'EXISTS' : 'MISSING'
  );

  // Check cookies
  const cookieAccessToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];

  const cookieRefreshToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('refresh_token='))
    ?.split('=')[1];

  console.log('Cookie access_token:', cookieAccessToken ? 'EXISTS' : 'MISSING');
  console.log(
    'Cookie refresh_token:',
    cookieRefreshToken ? 'EXISTS' : 'MISSING'
  );

  // Check auth store state
  try {
    const { useAuthStore } = require('@/lib/store/authStore');
    const authState = useAuthStore.getState();
    console.log('Auth store isAuthenticated:', authState.isAuthenticated);
    console.log('Auth store user:', authState.user ? 'EXISTS' : 'MISSING');
    console.log(
      'Auth store accessToken:',
      authState.accessToken ? 'EXISTS' : 'MISSING'
    );
  } catch (error) {
    console.log('Cannot access auth store:', error);
  }

  console.log('=== END AUTH DEBUG ===');
};

// Auto-run debug on page load if in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    debugAuthState();
  }, 1000);
}
