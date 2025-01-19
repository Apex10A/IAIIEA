"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

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
        return;
      }

      // Successful login
      router.push("/admin-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen background pt-28 mx-auto flex flex-col items-center">
      <Card className="md:w-[700px] md:px-32 sm:px-20 py-5 flex flex-col items-center justify-center min-h-max w-full rounded-none shadow-none">
        <CardHeader className="w-full">
          <div className="flex flex-col gap-8 items-center w-full">
            <Image src="/LogoNew.svg" alt="logo" width={200} height={70} />
            <div className="flex flex-col text-center gap-[8px]">
              <h1 className="text-black font-bold text-2xl md:text-4xl">
                Admin Login
              </h1>
              <p className="text-[#393938] leading-[24px] max-w-[611px]">
                Welcome back, please enter your details
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="gap-5 grid w-full">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <div className="space-y-2">
                <label className="font-medium text-[#1A1A1A] text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 border rounded-md"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium text-[#1A1A1A] text-sm">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isLoading}
                  />
                  <span
                    className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff color="#000" size={20} />
                    ) : (
                      <Eye color="#000" size={20} />
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <Link
                    href="/reset-password"
                    className="text-xs text-brand-primary font-bold"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-4 rounded-md bg-[#203A87] text-white"
                disabled={!email || !password || isLoading}
              >
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </Button>
            </div>
          </form>

          <div className="mt-2 text-center text-xs text-[#646261]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-brand-primary text-xs font-semibold"
            >
              Sign up
            </Link>
          </div>

          <Link
            href="/"
            className="mt-2 text-center text-sm text-[#667085] flex flex-row items-center justify-center gap-2 font-medium"
          >
            <ChevronLeft size={15} />
            <span>Back to Home</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
