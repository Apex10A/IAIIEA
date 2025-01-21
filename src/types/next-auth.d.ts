import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userType?: string;
      token?: string;
      userData?: {
        f_name: string;
        l_name: string;
        token?: string;
        m_name: string;
        name: string;
        phone: string;
        email: string;
        registration: string;
        membership_due_date: string;
      };
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType?: string;
    token?: string;
    userData?: {
      f_name: string;
      token?: string;
      l_name: string;
      m_name: string;
      name: string;
      phone: string;
      email: string;
      registration: string;
      membership_due_date: string;
    };
  }
}
