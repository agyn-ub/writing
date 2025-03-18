import NextAuth, { AuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { JWT } from 'next-auth/jwt';
import { pool } from '@/db/pool';

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
        const client = await pool.connect();
        
        try {
          const existingUserResult = await client.query(`
            SELECT id, email FROM users WHERE email = $1
          `, [user.email]);
          
          if (existingUserResult.rows.length > 0) {
            const existingUser = existingUserResult.rows[0];
            
            if (existingUser.id !== user.id) {
              console.log(`Updating user ID from ${existingUser.id} to ${user.id} for email ${user.email}`);
              
              await client.query('BEGIN');
              
              await client.query(`
                ALTER TABLE essays DISABLE TRIGGER ALL;
              `);
              
              await client.query(`
                UPDATE essays SET user_id = $1 WHERE user_id = $2
              `, [user.id, existingUser.id]);
              
              await client.query(`
                ALTER TABLE essays ENABLE TRIGGER ALL;
              `);
              
              await client.query(`
                UPDATE users SET id = $1 WHERE id = $2
              `, [user.id, existingUser.id]);
              
              await client.query('COMMIT');
              console.log(`User ID updated successfully`);
            }
          }
          
          return true;
        } catch (error) {
          console.error('Error handling user sign in:', error);
          return false;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Database connection error during sign in:', error);
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