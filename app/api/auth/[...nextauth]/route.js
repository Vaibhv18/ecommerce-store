// NextAuth API Route 
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../../lib/db";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          );

          if (users.length === 0) {
            throw new Error("No user found");
          }

          const user = users[0];
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error("Wrong password");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: Boolean(user.isAdmin)
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = Boolean(user.isAdmin);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here-make-it-long-and-random"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
