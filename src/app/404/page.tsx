"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen conference-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Error Code */}
        <div className="text-[#D5B93C] text-9xl font-bold mb-4">404</div>
        
        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-white/80 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to our homepage.
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
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}