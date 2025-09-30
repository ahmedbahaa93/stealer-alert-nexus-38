import GoogleProvider from 'next-auth/providers/google';

// Only validate environment variables at runtime, not during build
const validateEnvVars = () => {
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    const requiredEnvVars = [
      'NEXTAUTH_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      console.error(
        '❌ Missing required environment variables:',
        missingEnvVars
      );
      console.error(
        'Please set these variables in your Vercel dashboard or .env file'
      );
    }
  }
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder-for-build',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-for-build',
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'select_account'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Validate environment at runtime
      validateEnvVars();

      if (account?.provider === 'google') {
        try {
          // Extract Google user data - use profile.sub as the primary Google ID
          const googleUser = {
            googleId: profile?.sub || user.id || '',
            first_name: user.name?.split(' ')[0] || profile?.given_name || '',
            last_name:
              user.name?.split(' ').slice(1).join(' ') ||
              profile?.family_name ||
              '',
            email: user.email || profile?.email || '',
            avatar: user.image || profile?.picture || ''
          };

          if (process.env.NODE_ENV === 'development') {
            console.log('🔐 NextAuth Google Sign-in Data:', {
              profile,
              user,
              extractedData: googleUser
            });
          }

          // Store the Google user data in the user object for the jwt callback
          user.googleData = googleUser;

          return true;
        } catch (error) {
          console.error('❌ Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      try {
        // If this is the first sign in, add the Google data to the token
        if (account?.provider === 'google' && user?.googleData) {
          token.googleData = user.googleData;
        }
        return token;
      } catch (error) {
        console.error('❌ JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }: any) {
      try {
        // Add the Google data to the session
        if (token.googleData) {
          session.googleData = token.googleData;
        }
        return session;
      } catch (error) {
        console.error('❌ Session callback error:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/en/login',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'placeholder-for-build',
  debug: process.env.NODE_ENV === 'development',
  // Enhanced configuration for production
  trustHost: true
};
