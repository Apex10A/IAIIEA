import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Environment variables for API URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    // Member Login Provider
    CredentialsProvider({
      id: "member-credentials", // Unique ID to distinguish this provider
      name: "Member Login",
      credentials: {
        uid: { label: "Email/Membership ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.uid || !credentials?.password) {
          return null;
        }

        try {
          // Member login endpoint
          const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              uid: credentials.uid,
              password: credentials.password
            }),
          });

          const data = await response.json();

          // Check response
          if (!response.ok) {
            throw new Error(data.error || data.message || "Member Login failed");
          }

          // Return user object
          return {
            id: data.data.user_data.id || data.data.token,
            name: data.data.user_data.name,
            email: data.data.user_data.email,
            userType: 'MEMBER',
            token: data.data.token,
            userData: data.data.user_data
          };
        } catch (error) {
          console.error("Member Authentication error:", error);
          return null;
        }
      }
    }),

    // Admin Login Provider
    CredentialsProvider({
      id: "admin-credentials", // Unique ID to distinguish this provider
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Admin login endpoint
          const response = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });

          const data = await response.json();

          // Check response
          if (!response.ok) {
            throw new Error(data.error || data.message || "Admin Login failed");
          }

          // Return user object
          return {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            userType: 'ADMIN',
            token: data.data.token,
            userData: data.data
          };
        } catch (error) {
          console.error("Admin Authentication error:", error);
          return null;
        }
      }
    })
  ],
  
  // Callbacks for managing token and session
  callbacks: {
    async jwt({ token, user }) {
      // Add additional user info to the token on initial login
      if (user) {
        token.userType = user.userType;
        token.token = user.token;
        token.userData = user.userData;
        token.isAdmin = user.userType === 'ADMIN';
      }
      return token;
    },
    
    async session({ session, token }) {
      // Add additional user info to the session
      session.user.userType = token.userType;
      session.user.token = token.token;
      session.user.userData = token.userData;
      session.user.isAdmin = token.isAdmin || false;
      return session;
    }
  },
  
  // Custom pages for login
  pages: {
    signIn: '/login',
    adminSignIn: '/admin/login'
  },
  
  // JWT session strategy
  session: {
    strategy: 'jwt',
  }
});

export { handler as GET, handler as POST };