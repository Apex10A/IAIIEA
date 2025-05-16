"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "@/app/index.css";
import Link from "next/link";
import { showToast } from "@/utils/toast";
import Logo from '@/assets/auth/images/IAIIEA Logo I.png';
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("admin-credentials", {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        showToast.error(result.error);
        return;
      }
      
      showToast.success('Login successful!');
      router.push("/admin-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      showToast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl shadow-lg">
        <div className="flex justify-center pt-8">
          <Image 
            src={Logo} 
            alt="logo" 
            width={180} 
            height={60} 
            priority
            className="h-auto"
          />
        </div>

        <CardHeader className="text-center space-y-2 pt-6 pb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Welcome back, please enter your details
          </p>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-8">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 rounded-lg bg-[#203A87] hover:bg-blue-800 text-white font-bold tracking-widest transition-colors "
              disabled={!email || !password || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>LOGGING IN...</span>
                </div>
              ) : (
                "LOGIN"
              )}
            </Button>
          </form>

          <div className="flex justify-center mt-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}