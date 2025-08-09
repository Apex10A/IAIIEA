"use client";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface Speaker {
  name: string | number;
  title: string | number;
  portfolio: string;
  picture: string;
}

interface SpeakersSectionProps {
  speakers: Speaker[];
}

// Helper function to validate image URLs
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return false;
  
  // Check if URL ends with just a slash (directory)
  if (trimmedUrl.endsWith('/')) return false;
  
  // Check if URL has a file extension
  const hasFileExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmedUrl);
  if (!hasFileExtension) return false;
  
  // Check if it's a proper URL
  try {
    new URL(trimmedUrl);
    return true;
  } catch {
    return false;
  }
};

export const SpeakersSection = ({ speakers }: SpeakersSectionProps) => {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Speakers
      </h2>

      {speakers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {speakers?.map((speaker, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors"
            >
              <CardContent className="p-0">
                <div className="relative h-48 w-full bg-gradient-to-br from-[#D5B93C]/20 to-[#0E1A3D]/20 flex items-center justify-center">
                  {(() => {
                    const pictureUrl = speaker?.picture;
                    const hasValidImage = isValidImageUrl(pictureUrl);
                    
                    if (hasValidImage) {
                      return (
                        <img
                          src={pictureUrl}
                          alt={String(speaker?.name)}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Image failed to load:', pictureUrl);
                            // Hide the image and show the fallback
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.speaker-fallback');
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
                  <div 
                    className="speaker-fallback flex items-center justify-center w-full h-full"
                    style={{ 
                      display: isValidImageUrl(speaker?.picture) ? 'none' : 'flex'
                    }}
                  >
                    <User className="w-16 h-16 text-[#D5B93C]/50" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{String(speaker?.name || 'Speaker')}</h3>
                  <p className="text-[#D5B93C] text-sm mb-2">
                    {String(speaker?.title || '')}
                  </p>
                  <p className="text-white/70 text-sm">
                    {speaker?.portfolio}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-white/70">
          Speaker information will be available soon.
        </div>
      )}
    </section>
  );
};