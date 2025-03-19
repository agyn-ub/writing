import { NextAuthOptions } from 'next-auth';
import { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { pool } from '@/db/pool';
import { handleUserSession } from './session-handler';

export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }) {
      if (account && user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const customSession = session as CustomSession;
      
      // Validate token has required ID
      if (!token.id) {
        console.error('Invalid token: missing ID');
        throw new Error('Authentication token is invalid');
      }

      if (customSession.user) {
        try {
          // Verify the token ID still corresponds to a valid user in the database
          const user = await pool.query(
            'SELECT id, email FROM users WHERE id = $1',
            [token.id]
          );

          if (!user.rows.length) {
            console.error(`User not found for token ID: ${token.id}`);
            throw new Error('User no longer exists');
          }

          // Assign verified user ID to session
          customSession.user.id = user.rows[0].id;
          
          // Optionally ensure email matches to detect any inconsistencies
          if (customSession.user.email !== user.rows[0].email) {
            console.warn('Session email mismatch detected', {
              sessionEmail: customSession.user.email,
              dbEmail: user.rows[0].email
            });
          }
        } catch (error) {
          console.error('Error validating user session:', error);
          throw new Error('Failed to validate user session');
        }
      }

      return customSession;
    },
    async signIn({ user, account, profile }) {
      if (!user.id || !user.email) return false;
      
      console.log('Sign in attempt:', { 
        id: user.id, 
        email: user.email,
        provider: account?.provider 
      });
      
      try {
        // Use handleUserSession to ensure the user exists in the database
        const verifiedUser = await handleUserSession(user);
        if (!verifiedUser) {
          console.error('Failed to verify/create user during sign in');
          return false;
        }
        
        console.log('User successfully verified/created in database:', {
          id: verifiedUser.id,
          email: verifiedUser.email
        });
        
        return true;
      } catch (error) {
        console.error('Error during sign in user verification:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
}; 