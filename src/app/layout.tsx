import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Suspense } from "react";
import { Lexend, Poppins } from 'next/font/google';
import "./globals.css";
import Providers from './providers'
import { ToastProvider } from '@/components/providers/toast-provider';
import { ThemeProvider } from "@/components/theme-provider";
import { OnlineStatusProvider } from "@/context/OnlineStatusContext";

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "IAIIEA Organization",
  description: "Innovating assessment practices to better support education",
};

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lexend.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OnlineStatusProvider>
            <Suspense fallback={<Loading />}>
              <Providers>
                {children}
                <ToastProvider />
              </Providers>
            </Suspense>
          </OnlineStatusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}