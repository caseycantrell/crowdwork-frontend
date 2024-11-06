import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Login failed. Please check your credentials.");
        }

        return data;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // Set a short expiration (e.g., 30 minutes) if you see frequent invalidations
    updateAge: 5 * 60, // Update the session every 5 minutes for development
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || ""; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { id: token.id, email: token.email };
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
});