/**
 * Initialize auth state from localStorage to cookies on app startup
 * This ensures middleware can access auth tokens properly
 */

if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (accessToken) {
    // Set cookie for middleware access
    document.cookie = `access_token=${accessToken}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
  }

  if (refreshToken) {
    // Set refresh token cookie
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
  }
}
