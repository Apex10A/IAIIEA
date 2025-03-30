'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "@/app/index.css";
import { LoadingSpinner } from '@/components/loading-spinner'
import Link from "next/link";
import { showToast } from "@/utils/toast";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { FiLock, FiMail } from "react-icons/fi";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [defaultInpType, setDefaultInpType] = useState<"text" | "password">("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn('member-credentials', {
        redirect: false,
        uid: identifier,
        password: password
      });

      if (result?.error) {
        setError(result.error);
        showToast.error('Incorrect email or password');
        setIsLoading(false);
        return;
      }
      showToast.success('Login successful!, Redirecting to dashboard...');

      // Successful login
      router.push("/members-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      showToast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1A3D] to-[#203A87] flex items-center justify-center p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white rounded-xl shadow-2xl overflow-hidden border-none">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="logo" 
                  width={150} 
                  height={60} 
                  className="object-contain"
                />
              </motion.div>
              
              <div className="text-center space-y-2">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-bold text-[#0B142F]"
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600"
                >
                  Please enter your credentials to login
                </motion.p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {/* {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </motion.div>
            )} */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Membership ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or ID"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#203A87] focus:border-[#203A87] outline-none transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={defaultInpType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#203A87] focus:border-[#203A87] outline-none transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setDefaultInpType(
                        defaultInpType === "text" ? "password" : "text"
                      )
                    }
                  >
                    {defaultInpType === "text" ? (
                      <Eye className="text-gray-500 hover:text-gray-700" size={20} />
                    ) : (
                      <EyeOff className="text-gray-500 hover:text-gray-700" size={20} />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-[#203A87] hover:text-[#152a61] font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 mt-2 rounded-lg bg-[#203A87] hover:bg-[#152a61] text-white font-medium transition-colors shadow-md"
                  disabled={!identifier || !password || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner className="size-5 animate-spin-fast" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-sm text-gray-600"
            >
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-[#203A87] hover:text-[#152a61] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center"
            >
              <Link 
                href="/" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back to Home
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}