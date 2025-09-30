export interface RequestCallbackRequest {
  fullName: string;
  email: string;
  phone: string;
  department: string;
}

export interface RequestCallbackResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class RequestCallbackAPI {
  private static readonly BASE_URL = 'https://booking-courses-gilt.vercel.app';
  private static readonly ENDPOINT = '/api/v1/callbacks';

  static async submitRequest(
    data: RequestCallbackRequest
  ): Promise<RequestCallbackResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}${this.ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // Handle different error status codes
        if (response.status >= 500) {
          throw new Error('SERVER_ERROR');
        } else if (response.status >= 400) {
          throw new Error('CLIENT_ERROR');
        } else {
          throw new Error('NETWORK_ERROR');
        }
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Request sent successfully',
        data: result
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'SERVER_ERROR') {
          throw new Error('SERVER_ERROR');
        } else if (error.message === 'CLIENT_ERROR') {
          throw new Error('CLIENT_ERROR');
        } else if (
          error.name === 'TypeError' ||
          error.message.includes('fetch')
        ) {
          throw new Error('NETWORK_ERROR');
        }
      }
      throw new Error('GENERAL_ERROR');
    }
  }
}
