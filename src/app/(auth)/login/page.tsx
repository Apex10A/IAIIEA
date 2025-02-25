'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LoadingSpinner } from '@/components/loading-spinner'
import Link from "next/link";
import { showToast } from "@/utils/toast";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

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
        setIsLoading(false);
        return;
      }
      showToast.success('Login successful!')

      // Successful login
      router.push("/members-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      showToast.error('An unexpected error occured');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="backgroundLogin mx-auto md:px-auto px-5 flex flex-col items-center justify-center w-full min-h-screen">
      <div className="md:w-[700px] bg-[#fff] md:px-32 sm:px-20 flex flex-col items-center justify-center h-full w-full rounded-md shadow-none">
        <CardHeader className="w-full">
          <div className="flex flex-col gap-8 items-center w-full">
            <Image src="/logo.png" alt="logo" width={130} height={50} />
            <div className="flex flex-col text-center gap-[8px]">
              <h1 className="text-black font-bold text-2xl md:text-4xl">
                Log in to your account
              </h1>
              <p className="text-[#393938] leading-[24px] max-w-[611px]">
                Welcome back please enter your details
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
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Membership ID"
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
                    type={defaultInpType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isLoading}
                  />
                  <span
                    className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setDefaultInpType(
                        defaultInpType === "text" ? "password" : "text"
                      )
                    }
                  >
                    {defaultInpType === "text" ? (
                      <Eye color="#000" size={20} />
                    ) : (
                      <EyeOff color="#000" size={20} />
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <Link href="/reset-password" className="text-xs text-brand-primary font-bold">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
  type="submit"
  className="w-full h-12 mt-4 rounded-md bg-[#203A87] text-white"
  disabled={!identifier || !password || isLoading}
>
  {isLoading ? (
    <>
      <span>LOGGING IN...</span>
      <LoadingSpinner className="size-4 animate-spin sm:size-5" />
    </>
  ) : (
    "LOGIN"
  )}
</Button>

            </div>
          </form>

          <div className="mt-2 text-center text-xs text-[#646261]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-primary text-xs font-semibold">
              Sign up
            </Link>
          </div>

          <Link href="/" className="mt-2 text-center text-sm text-[#667085] flex flex-row items-center justify-center gap-2 font-medium">
            <ChevronLeft size={15} />
            <span>Back to Home</span>
          </Link>
        </CardContent>
      </div>
    </div>
  );
}