'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [defaultInpType, setDefaultInpType] = useState<"text" | "password">("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone number validation
  const isValidPhoneNumber = (phone: string) => {
    return /^\d{10,15}$/.test(phone.replace(/[-()\s]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/conference/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password: phoneNumber.replace(/[-()\s]/g, '') // Remove any formatting from phone number
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      // Store token in localStorage (or cookie in production)
      localStorage.setItem("access_token", data.data.token);
      localStorage.setItem("user_data", JSON.stringify(data.data.user_data));

      router.push("/members-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full p-2 border rounded-md"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium text-[#1A1A1A] text-sm">
                  Phone Number
                </label>
                <div className="relative w-full">
                  <input
                    type={defaultInpType}
                    value={phoneNumber}
                    onChange={(e) => {
                      // Only allow numbers and common phone number formatting characters
                      const value = e.target.value.replace(/[^\d-()\s]/g, '');
                      setPhoneNumber(value);
                    }}
                    placeholder="Enter your phone number"
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
                    Forgot Phone Number?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-4 rounded-md bg-[#203A87] text-white"
                disabled={!email || !phoneNumber || isLoading}
              >
                {isLoading ? "LOGGING IN..." : "LOGIN"}
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
      </Card>
    </div>
  );
}