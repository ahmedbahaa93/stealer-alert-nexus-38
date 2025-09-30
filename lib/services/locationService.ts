/**
 * Location Service
 * Robust location detection with multiple IP APIs, HTML5 geolocation, and smart fallbacks
 */

import { LocationData } from '@/lib/store/locationStore';

interface IPLocationResponse {
  country?: string;
  countryCode?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  country_name?: string;
  country_code?: string;
  city_name?: string;
  region?: string;
  region_name?: string;
  lat?: number;
  lon?: number;
  time_zone?: string;
}

class LocationService {
  private static instance: LocationService;
  private readonly IP_APIS = [
    'http://ip-api.com/json/',
    'https://ipapi.co/json/',
    'https://ipinfo.io/json',
    'https://api.ipgeolocation.io/ipgeo?apiKey=at_least_10_chars_or_demo'
  ];
  private currentAPIIndex = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Check if location permissions are available
   */
  async checkLocationPermission(): Promise<
    'granted' | 'denied' | 'prompt' | 'unavailable'
  > {
    if (!navigator.geolocation) {
      return 'unavailable';
    }

    try {
      const permission = await navigator.permissions.query({
        name: 'geolocation'
      });
      return permission.state;
    } catch (error) {
      console.warn('Permission API not available:', error);
      return 'prompt';
    }
  }

  /**
   * Get user location using multiple methods with fallbacks
   */
  async getUserLocation(): Promise<LocationData> {
    console.log('🔍 Starting location detection...');

    // Rate limiting check
    const now = Date.now();
    if (now - this.lastRequestTime < this.RATE_LIMIT_DELAY) {
      throw new Error(
        'Rate limit exceeded. Please wait a moment before trying again.'
      );
    }
    this.lastRequestTime = now;

    try {
      // First try IP-based location (most reliable)
      const ipLocation = await this.getIPLocation();
      if (ipLocation) {
        console.log('✅ IP location detected:', ipLocation);
        return ipLocation;
      }
    } catch (error) {
      console.warn('IP location failed:', error);
    }

    try {
      // Fallback to HTML5 geolocation
      const geoLocation = await this.getHTML5Location();
      if (geoLocation) {
        console.log('✅ HTML5 location detected:', geoLocation);
        return geoLocation;
      }
    } catch (error) {
      console.warn('HTML5 location failed:', error);
    }

    // If all methods fail, throw error
    throw new Error(
      'Unable to detect location. Please select your country manually.'
    );
  }

  /**
   * Get location from IP using multiple APIs with fallbacks
   */
  private async getIPLocation(): Promise<LocationData | null> {
    for (let i = 0; i < this.IP_APIS.length; i++) {
      try {
        const apiUrl = this.IP_APIS[this.currentAPIIndex];
        console.log(`🌐 Trying IP API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data: IPLocationResponse = await response.json();
        console.log('📍 IP API response:', data);

        const locationData = this.normalizeIPResponse(data);
        if (locationData) {
          return locationData;
        }
      } catch (error) {
        console.warn(`IP API ${this.currentAPIIndex + 1} failed:`, error);
        this.currentAPIIndex = (this.currentAPIIndex + 1) % this.IP_APIS.length;
      }
    }

    return null;
  }

  /**
   * Get location using HTML5 Geolocation API
   */
  private async getHTML5Location(): Promise<LocationData | null> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported');
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Geolocation request timed out'));
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;

            // Reverse geocoding to get country info
            const countryData = await this.reverseGeocode(latitude, longitude);

            resolve({
              country: countryData.country || 'Unknown',
              countryCode: countryData.countryCode || 'US',
              city: countryData.city || 'Unknown',
              latitude: latitude,
              longitude: longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              currency: this.getCurrencyForCountry(
                countryData.countryCode || 'US'
              ),
              paymentMethod: this.getPaymentMethodForCountry(
                countryData.countryCode || 'US'
              ),
              lastUpdated: Date.now()
            });
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            // Fallback with coordinates only
            const { latitude, longitude } = position.coords;
            resolve({
              country: 'Unknown',
              countryCode: 'US',
              city: 'Unknown',
              latitude: latitude,
              longitude: longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              currency: 'USD',
              paymentMethod: 'checkout',
              lastUpdated: Date.now()
            });
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(new Error(`Geolocation failed: ${error.message}`));
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Reverse geocode coordinates to get country info
   */
  private async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<{
    country?: string;
    countryCode?: string;
    city?: string;
  }> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );

      if (response.ok) {
        const data = await response.json();
        return {
          country: data.countryName,
          countryCode: data.countryCode,
          city: data.city || data.locality
        };
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }

    return {};
  }

  /**
   * Normalize different IP API responses to consistent format
   */
  private normalizeIPResponse(data: IPLocationResponse): LocationData | null {
    try {
      const country = data.country || data.country_name;
      const countryCode = data.countryCode || data.country_code;
      const city =
        data.city || data.city_name || data.region || data.region_name;
      const latitude = data.latitude || data.lat;
      const longitude = data.longitude || data.lon;
      const timezone = data.timezone || data.time_zone;

      if (!country || !countryCode) {
        return null;
      }

      return {
        country,
        countryCode: countryCode.toUpperCase(),
        city: city || 'Unknown',
        latitude: latitude || 0,
        longitude: longitude || 0,
        timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: this.getCurrencyForCountry(countryCode),
        paymentMethod: this.getPaymentMethodForCountry(countryCode),
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Failed to normalize IP response:', error);
      return null;
    }
  }

  /**
   * Get currency for country
   */
  getCurrencyForCountry(countryCode: string): 'USD' | 'EGP' {
    return countryCode.toUpperCase() === 'EG' ? 'EGP' : 'USD';
  }

  /**
   * Get payment method for country
   */
  getPaymentMethodForCountry(countryCode: string): 'paymob' | 'checkout' {
    return countryCode.toUpperCase() === 'EG' ? 'paymob' : 'checkout';
  }

  /**
   * Get country flag emoji for country code
   */
  getCountryFlag(countryCode: string): string {
    const flags: { [key: string]: string } = {
      EG: '🇪🇬',
      US: '🇺🇸',
      GB: '🇬🇧',
      CA: '🇨🇦',
      AU: '🇦🇺',
      DE: '🇩🇪',
      FR: '🇫🇷',
      IT: '🇮🇹',
      ES: '🇪🇸',
      NL: '🇳🇱',
      BR: '🇧🇷',
      IN: '🇮🇳',
      JP: '🇯🇵',
      CN: '🇨🇳',
      KR: '🇰🇷',
      RU: '🇷🇺',
      MX: '🇲🇽',
      AR: '🇦🇷',
      CL: '🇨🇱',
      CO: '🇨🇴',
      PE: '🇵🇪',
      VE: '🇻🇪',
      UY: '🇺🇾',
      PY: '🇵🇾',
      EC: '🇪🇨',
      BO: '🇧🇴',
      GY: '🇬🇾',
      SR: '🇸🇷',
      FK: '🇫🇰'
    };

    return flags[countryCode.toUpperCase()] || '🌍';
  }

  /**
   * Format location string for display
   */
  formatLocationString(location: LocationData): string {
    const parts = [location.city, location.country].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Check if location data is valid and not expired
   */
  isLocationValid(location: LocationData | null): boolean {
    if (!location) return false;

    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    return now - location.lastUpdated < maxAge;
  }

  /**
   * Get default location (fallback)
   */
  getDefaultLocation(): LocationData {
    return {
      country: 'United States',
      countryCode: 'US',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
      currency: 'USD',
      paymentMethod: 'checkout',
      lastUpdated: Date.now()
    };
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();
