/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

const BASE_URL = 'https://booking-courses-gilt.vercel.app/api/v1/auth';

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: 'Male' | 'Female';
  date_of_birth: string;
  password: string;
  country: {
    en: string;
    ar: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyLoginRequest {
  email: string;
  otp: string;
}

export interface ApiResponse<T = any> {
  status: string;
  code: number;
  message: string;
  data?: T;
  access_token?: string;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
  current_job_title: string;
  company_organization_name: string;
  industry_field_of_work: string;
  years_of_experience: number;
  highest_education_level: string;
  field_of_study: string;
  graduation_year: number;
  university_institution_name: string;
  location: {
    country: string;
    city: string;
    address: string;
  };
  role: string;
}

class AuthAPI {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON response from server');
          }
        } else {
          // Empty response body
          data = { message: 'No response data' };
        }
      } else {
        // Non-JSON response
        const text = await response.text();
        data = { message: text || 'No response data' };
      }

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async signup(data: SignupRequest): Promise<ApiResponse> {
    return this.makeRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verifyEmail(
    data: VerifyEmailRequest
  ): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest('/verify-email', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse> {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verifyLogin(
    data: VerifyLoginRequest
  ): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest('/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.makeRequest('/logout', {
      method: 'GET'
    });
  }

  async resendSignupOTP(email: string): Promise<ApiResponse> {
    return this.makeRequest('/resend-signup-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resendLoginOTP(email: string): Promise<ApiResponse> {
    return this.makeRequest('/resend-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
}

export const authAPI = new AuthAPI();
