import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Environment variables for API URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Extend the built-in User type
declare module "next-auth" {
  interface User {
    userType?: string;
    token?: string;
    userData?: UserData;
  }
}

// Type definitions
interface UserData {
  f_name: string;
  l_name: string;
  m_name: string;
  name: string;
  phone: string;
  email: string;
  registration: string;
  membership_due_date: string;
}

interface MemberLoginResponse {
  data: {
    token: string;
    user_data: UserData;
  };
  error?: string;
  message?: string;
}

interface AdminLoginResponse {
  data: {
    id: string;
    token: string;
    name: string;
    email: string;
    // Add other admin-specific fields here
  };
  error?: string;
  message?: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    // Member Login Provider
    CredentialsProvider({
      id: "member-credentials",
      name: "Member Login",
      credentials: {
        uid: { label: "Email/Membership ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.uid || !credentials?.password) {
          return null;
        }

        try {
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

          const data = await response.json() as MemberLoginResponse;

          if (!response.ok) {
            throw new Error(data.error || data.message || "Member Login failed");
          }

          return {
            id: data.data.user_data.registration,
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
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
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

          const data = await response.json() as AdminLoginResponse;

          if (!response.ok) {
            throw new Error(data.error || data.message || "Admin Login failed");
          }

          // For admin login, we don't have the same UserData structure
          return {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            userType: 'ADMIN',
            token: data.data.token,
            // Don't include userData for admin
          };
        } catch (error) {
          console.error("Admin Authentication error:", error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType;
        token.token = user.token;
        token.userData = user.userData;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user.userType = token.userType;
      session.user.token = token.token;
      session.user.userData = token.userData;
      return session;
    }
  },
  
  pages: {
    signIn: '/login',
    // adminSignIn: '/admin/login'
  },
  
  session: {
    strategy: 'jwt',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };