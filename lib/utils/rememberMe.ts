/**
 * Remember Me Functionality
 * Handles client-side storage and retrieval of login credentials
 */

interface RememberMeData {
  email: string;
  rememberMe: boolean;
  timestamp: number;
}

const REMEMBER_ME_KEY = 'raiseup_remember_me';
const REMEMBER_ME_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export class RememberMeService {
  /**
   * Save login credentials when "Remember Me" is checked
   */
  static saveCredentials(email: string, rememberMe: boolean): void {
    if (typeof window === 'undefined') return;

    try {
      if (rememberMe) {
        const data: RememberMeData = {
          email,
          rememberMe: true,
          timestamp: Date.now()
        };
        localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
      } else {
        // If remember me is unchecked, clear stored data
        this.clearCredentials();
      }
    } catch (error) {
      console.error('Failed to save remember me data:', error);
    }
  }

  /**
   * Retrieve saved login credentials
   */
  static getSavedCredentials(): { email: string; rememberMe: boolean } | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(REMEMBER_ME_KEY);
      if (!stored) return null;

      const data: RememberMeData = JSON.parse(stored);

      // Check if data is expired
      if (Date.now() - data.timestamp > REMEMBER_ME_EXPIRY) {
        this.clearCredentials();
        return null;
      }

      return {
        email: data.email,
        rememberMe: data.rememberMe
      };
    } catch (error) {
      console.error('Failed to retrieve remember me data:', error);
      this.clearCredentials(); // Clear corrupted data
      return null;
    }
  }

  /**
   * Clear stored credentials
   */
  static clearCredentials(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(REMEMBER_ME_KEY);
    } catch (error) {
      console.error('Failed to clear remember me data:', error);
    }
  }

  /**
   * Check if there are saved credentials available
   */
  static hasSavedCredentials(): boolean {
    return this.getSavedCredentials() !== null;
  }

  /**
   * Update the timestamp to extend the expiry
   */
  static refreshTimestamp(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(REMEMBER_ME_KEY);
      if (!stored) return;

      const data: RememberMeData = JSON.parse(stored);
      data.timestamp = Date.now();
      localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to refresh remember me timestamp:', error);
    }
  }

  /**
   * Clean up expired credentials on app startup
   */
  static cleanup(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(REMEMBER_ME_KEY);
      if (!stored) return;

      const data: RememberMeData = JSON.parse(stored);

      // If expired, remove it
      if (Date.now() - data.timestamp > REMEMBER_ME_EXPIRY) {
        this.clearCredentials();
      }
    } catch (error) {
      console.error('Failed to cleanup remember me data:', error);
      this.clearCredentials(); // Clear corrupted data
    }
  }
}

/**
 * Hook for using Remember Me functionality
 */
export const useRememberMe = () => {
  const saveCredentials = (email: string, rememberMe: boolean) => {
    RememberMeService.saveCredentials(email, rememberMe);
  };

  const getSavedCredentials = () => {
    return RememberMeService.getSavedCredentials();
  };

  const clearCredentials = () => {
    RememberMeService.clearCredentials();
  };

  const hasSavedCredentials = () => {
    return RememberMeService.hasSavedCredentials();
  };

  return {
    saveCredentials,
    getSavedCredentials,
    clearCredentials,
    hasSavedCredentials
  };
};
