declare module 'next-auth' {
  interface Session {
    googleData?: {
      googleId: string;
      first_name: string;
      last_name: string;
      email: string;
      avatar?: string;
    };
  }

  interface User {
    googleData?: {
      googleId: string;
      first_name: string;
      last_name: string;
      email: string;
      avatar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    googleData?: {
      googleId: string;
      first_name: string;
      last_name: string;
      email: string;
      avatar?: string;
    };
  }
}
