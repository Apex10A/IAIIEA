"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Book } from "lucide-react";

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

interface CarouselProps {
  items: string[];
  showArrows?: boolean;
}

export const Carousel = ({ items, showArrows = true }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-center">
        {showArrows && items?.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        <div className="flex justify-center items-center gap-4 my-4 overflow-hidden w-full">
          {items.length > 0 ? (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-[#D5B93C]/20 to-[#0E1A3D]/20 flex items-center justify-center">
              {(() => {
                const currentItem = items[currentIndex];
                const hasValidImage = isValidImageUrl(currentItem);
                
                if (hasValidImage) {
                  return (
                    <img
                      src={currentItem}
                      alt={`Item ${currentIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.carousel-fallback');
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
                className="carousel-fallback flex items-center justify-center w-full h-full text-white/50" 
                style={{ 
                  display: isValidImageUrl(items[currentIndex]) ? 'none' : 'flex'
                }}
              >
                <Book className="w-16 h-16" />
              </div>
            </div>
          ) : (
            <div className="text-white opacity-70 py-12">
              No items available
            </div>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-[#D5B93C] w-4" : "bg-white/30"
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};