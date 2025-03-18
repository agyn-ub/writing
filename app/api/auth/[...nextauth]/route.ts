import NextAuth, { AuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { JWT } from 'next-auth/jwt';
import { pool } from '@/db/pool';
import { handleUserSession } from '@/app/api/auth/session-handler';

export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const authOptions: AuthOptions = {
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
      if (customSession.user) {
        customSession.user.id = token.id as string;
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
        // This will create the user if they don't exist, or update if needed
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }; 