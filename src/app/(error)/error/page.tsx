"use client";
import { Button } from "@/components/ui/button";
import "@/app/index.css"
import { useRouter } from "next/navigation";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen conference-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-20 h-20 text-red-400" />
        </div>
        
        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Something Went Wrong
        </h1>
        
        {/* Error Details (hidden in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-white/10 p-4 rounded-lg mb-8 text-left">
            <h3 className="text-red-400 font-mono mb-2">Error Details:</h3>
            <code className="text-white/80 text-sm break-all">
              {error.message}
            </code>
            {error.digest && (
              <p className="mt-2 text-white/60 text-sm">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
        
        {/* Description */}
        <p className="text-white/80 text-lg mb-8">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-6 px-8 text-lg"
            onClick={() => router.push("/")}
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Button>
          <Button
            variant="outline"
            className="border-[#D5B93C] text-[#D5B93C] hover:bg-[#D5B93C]/10 font-bold py-6 px-8 text-lg"
            onClick={reset}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}