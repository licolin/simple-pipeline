import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { Client } from 'pg';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

async function getUser(email: string): Promise<User | undefined> {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();
  try {
    const { rows } = await client.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  } finally {
    await client.end();
  }
}

export const { handlers,auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

        // console.log("nextAuth action!");
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          console.log("user info is : " + user);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});