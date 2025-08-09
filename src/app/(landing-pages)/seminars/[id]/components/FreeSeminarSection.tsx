"use client";
import { Check } from "lucide-react";
import { SeminarDetails } from "../types";
import { hasPaidPlans } from "../utils";

interface FreeSeminarSectionProps {
  seminar: SeminarDetails;
}

export const FreeSeminarSection = ({ seminar }: FreeSeminarSectionProps) => {
  if (seminar?.is_free !== "free") {
    return null;
  }

  return (
    <section className="my-12">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
          {hasPaidPlans(seminar?.payments) ? "Free Access Available" : "Free Seminar"}
        </h2>
        <div className="bg-gradient-to-br from-green-500/20 to-[#D5B93C]/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-5xl font-bold text-green-400 mb-4">100% FREE</div>
          <div className="text-white/90 mb-6 space-y-2">
            <p className="text-lg font-medium">This seminar includes free access to:</p>
            <div className="grid md:grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>All seminar sessions</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>Digital materials</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>Certificate of attendance</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-5 h-5 text-green-400" />
                <span>Access to recordings</span>
              </div>
            </div>
          </div>
          
          {hasPaidPlans(seminar?.payments) && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 text-sm font-medium">
                💡 Optional paid upgrades available below for additional perks
              </p>
            </div>
          )}

          <div className="bg-green-500/20 text-green-300 font-bold py-3 px-4 rounded-md text-center flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>Free Access - No Payment Required!</span>
          </div>
        </div>
      </div>
    </section>
  );
};