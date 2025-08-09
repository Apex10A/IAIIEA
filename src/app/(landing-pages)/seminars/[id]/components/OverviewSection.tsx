"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface OverviewSectionProps {
  subThemes?: string[] | null;
  workshops?: string[] | null;
}

export const OverviewSection = ({ subThemes, workshops }: OverviewSectionProps) => {
  if ((!subThemes || subThemes.length === 0) && (!workshops || workshops.length === 0)) {
    return null;
  }

  return (
    <>
      {subThemes && subThemes.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Overview
          </h2>

          <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
            <CardHeader>
              <CardTitle className="text-[#D5B93C]">Sub-themes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {subThemes.map((theme, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{theme}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {workshops && workshops.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Workshops
          </h2>

          <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
            <CardHeader>
              <CardTitle className="text-[#D5B93C]">Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {workshops.map((workshop, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{workshop}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
};