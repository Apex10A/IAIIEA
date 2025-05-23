import NextAuth, { NextAuthOptions, User, Session, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Environment variables for API URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Extend the built-in Session type
declare module "next-auth" {
  interface Session {
    user: {
      userType?: string;
      token?: string;
      userData?: UserData;
    } & DefaultSession["user"]
  }

  interface User {
    userType?: string;
    token?: string;
    userData?: UserData;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
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
  status?: string;
}

interface AdminLoginResponse {
  data: {
    id: string;
    token: string;
    name: string;
    email: string;
  };
  error?: string;
  message?: string;
  status?: string;
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
          throw new Error("Missing credentials");
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

          const data: MemberLoginResponse = await response.json();

          if (!response.ok || data.status === 'error') {
            throw new Error(data.error || data.message || "Authentication failed");
          }

          if (!data.data?.token || !data.data?.user_data) {
            throw new Error("Invalid response data");
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
          throw error;
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
          throw new Error("Missing credentials");
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

          const data: AdminLoginResponse = await response.json();

          if (!response.ok || data.status === 'error') {
            throw new Error(data.error || data.message || "Authentication failed");
          }

          if (!data.data?.token) {
            throw new Error("Invalid response data");
          }

          return {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            userType: 'ADMIN',
            token: data.data.token
          };
        } catch (error) {
          console.error("Admin Authentication error:", error);
          throw error;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          ...token,
          userType: user.userType,
          token: user.token,
          userData: user.userData
        };
      }
      return token;
    },
    
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          userType: token.userType,
          token: token.token,
          userData: token.userData
        }
      };
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === 'development',

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };