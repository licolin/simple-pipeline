import type {NextAuthConfig } from 'next-auth';


// import NextAuthOptions from 'next-auth';


export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async session({ session, token }) {
      // if (token?.accessToken) {
      //   session.accessToken = token.accessToken
      // }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log("auth "+auth);
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  session: {
    maxAge: 12 * 60 * 60, // Session will be valid for 24 hours (86400 seconds)
    updateAge: 6 * 60 * 60, // Session will be updated if 12 hours have passed (43200 seconds)
  },
} satisfies NextAuthConfig;
