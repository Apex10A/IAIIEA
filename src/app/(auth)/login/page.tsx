'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [defaultInpType, setDefaultInpType] = useState<"text" | "password">("password")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const { signIn, isLoaded: clerkLoaded } = useSignIn()
    const router = useRouter()
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!clerkLoaded) return
      
      setError("")
      setIsLoading(true)
  
      try {
        // First authenticate with your backend
        const backendResponse = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            uid: identifier,
            password: password,
          }),
        })
  
        const backendData = await backendResponse.json()
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Backend response:', backendData)
        }
  
        if (!backendResponse.ok) {
          throw new Error(backendData.error || backendData.message || 'Login failed')
        }

        // After successful backend authentication, try Clerk authentication
        // Make sure we're using the email from the backend response for Clerk
        const emailToUse = backendData.data.user_data.email

        try {
          const clerkResult = await signIn.create({
            identifier: emailToUse, // Always use email for Clerk
            password,
            strategy: "password"
          })

          if (clerkResult.status === "complete") {
            // Store the backend token
            if (backendData.data.token) {
              localStorage.setItem('access_token', backendData.data.token)
            }
            
            // Store user data if needed
            localStorage.setItem('user_data', JSON.stringify(backendData.data.user_data))
            
            router.push("/dashboard")
          } else if (clerkResult.status === "needs_first_factor") {
            // Handle additional authentication steps if needed
            console.log("Additional authentication required")
            setError("Additional authentication required")
          } else {
            throw new Error("Failed to complete authentication")
          }
        } catch (clerkError: any) {
          console.error("Clerk auth error:", clerkError)
          // If the user doesn't exist in Clerk, we should handle that
          if (clerkError.errors?.[0]?.message.includes("Identifier")) {
            setError("Please sign up first to create your account")
            return
          }
          throw clerkError
        }
      } catch (err: any) {
        console.error("Error in login flow:", err)
        setError(err.message || "Failed to login. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleGoogleSignIn = async () => {
      try {
        await signIn?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard"
        })
      } catch (error: any) {
        console.error("Google sign in error:", error)
        setError(error.message || "Failed to initialize Google Sign In")
      }
    }
  
    return (
     <div className=" min-h-screen background pt-28 mx-auto flex flex-col items-center ">
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
          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="p-3 text-xs text-gray-500 bg-gray-50 rounded-md">
              <pre>{JSON.stringify({ error, url: API_URL }, null, 2)}</pre>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md flex flex-col">
              <span>{error}</span>
              {error.includes("sign up") && (
                <Link href="/sign-up" className="text-blue-500 hover:underline mt-1">
                  Click here to create an account
                </Link>
              )}
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="w-full">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
              Continue with Google
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-[1px] w-2/3 bg-[#555F74] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"></div>
            <span className="text-sm text-[#555F74] w-max px-5 bg-white z-10 relative">
              Or Sign in with
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <div className="space-y-2">
                <label className="font-medium text-[#1A1A1A] text-sm">
                  Email Address or Membership ID
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
                    placeholder="*******"
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isLoading}
                  />
                  <span className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer">
                    {defaultInpType === 'text' ? (
                      <Eye
                        color="#000"
                        size={20}
                        onClick={() => setDefaultInpType('password')}
                      />
                    ) : (
                      <EyeOff
                        color="#000"
                        size={20}
                        onClick={() => setDefaultInpType('text')}
                      />
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
                disabled={!identifier || !password || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-x-2">
                    <span className="animate-pulse">LOGGIN IN...</span>
                    <div className="size-4 animate-spin sm:size-5" />
                  </span>
                ) : (
                  <span>LOGIN</span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-2 text-center text-xs text-[#646261]">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-brand-primary text-xs font-semibold"
            >
              Sign up
            </Link>
          </div>

          <Link
            href={'/'}
            className="mt-2 text-center text-sm text-[#667085] flex flex-row items-center justify-center gap-2 font-medium"
          >
            <ChevronLeft size={15} />
            <span>Back to Home</span>
          </Link>
        </CardContent>
      </Card>
     </div>
    )
}