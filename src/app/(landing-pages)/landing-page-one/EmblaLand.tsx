import React, { useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import { DotButton, useDotButton } from '@/modules/ui/EmblaCarouselDotButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from '@/modules/ui/EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import './carousel.css';

type PropType = {
  options?: EmblaOptionsType;
  autoPlayInterval?: number;
};

const EmblaCarousel: React.FC<PropType> = ({ options, autoPlayInterval = 5000 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoPlayTimer, setAutoPlayTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const startAutoPlay = () => {
    if (!emblaApi) return;
    
    const timer = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, autoPlayInterval);
    
    setAutoPlayTimer(timer);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      setAutoPlayTimer(null);
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  useEffect(() => {
    if (!emblaApi) return;
    if (isPlaying && !isHovering) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [emblaApi, isPlaying, autoPlayInterval, isHovering]);

  return (
    <section 
      className="embla relative w-full overflow-hidden min-h-screen"
      onMouseEnter={() => {
        setIsHovering(true);
        stopAutoPlay();
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        if (isPlaying) startAutoPlay();
      }}
    >
      <div className="embla__viewport w-full" ref={emblaRef}>
        <div className="embla__container flex w-full">
          {/* First Slide */}
          <div className="embla__slide min-w-full relative">
            <div className="absolute inset-0  bg-[rgb(14,26,61)] z-0"></div>
            <div className="relative min-h-screen w-full px-4 md:px-8 lg:px-14 py-20 flex items-center">
              <div className="container mx-auto lg:flex items-center justify-between h-full gap-8 z-10">
                {/* Text Content */}
                <div className="lg:w-1/2 space-y-6 lg:space-y-8">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[80px] text-center lg:text-left font-bold text-white leading-tight lg:leading-[1.2]">
                    <span className="text-[#D5B93C] font-extrabold">Innovating</span> assessment practices to better support education.
                  </h1>
                  <p className="text-lg lg:text-xl text-white/80 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                    Join us in revolutionizing educational assessment through cutting-edge technology and research.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                    <Link href="/register">
                      <button className="bg-[#D5B93C] hover:bg-[#c4aa36] transition-all duration-300 py-3 lg:py-4 px-6 lg:px-8 text-[#203a87] text-base lg:text-lg font-semibold tracking-wider uppercase rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Become a member
                      </button>
                    </Link>
                    <Link href="#about">
                      <button className="border-2 border-white hover:border-[#D5B93C] text-white hover:text-[#D5B93C] transition-all duration-300 py-3 lg:py-4 px-6 lg:px-8 text-base lg:text-lg font-semibold tracking-wider uppercase rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Image Stack */}
                <div className="relative lg:w-1/2 mt-12 lg:mt-0">
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:z-10">
                      <Image 
                        src="/DSA3.JPG" 
                        alt="Assessment Practice" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 border-2 border-[#D5B93C] pointer-events-none"></div>
                    </div>
                    <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:z-10 mt-8">
                      <Image 
                        src="/DSA2.JPG" 
                        alt="Education Support" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 border-2 border-[#D5B93C] pointer-events-none"></div>
                    </div>
                    <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:z-10 col-span-2">
                      <Image 
                        src="/DSA.JPG" 
                        alt="Innovation" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 border-2 border-[#D5B93C] pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Slide */}
          <div className="embla__slide min-w-full relative">
            <div className="absolute inset-0  bg-[rgb(14,26,61)]  z-0"></div>
            <div className="relative min-h-screen w-full px-4 md:px-8 lg:px-14 py-20 flex items-center">
              <div className="container mx-auto lg:flex items-center justify-between h-full gap-8 z-10">
                {/* Text Content */}
                <div className="lg:w-1/2 space-y-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#D5B93C] leading-wider text-center lg:text-left">
                    Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence
                  </h2>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[80px] font-bold text-white leading-tight text-center lg:text-left">
                    Conference 2024
                  </h1>
                  <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
                    <div className="flex items-center gap-4 text-white/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D5B93C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-lg lg:text-xl">
                        UBEC Digital Resource Centre Kado-Kuchi, Jahi District, Abuja
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-white/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D5B93C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg lg:text-xl">
                        Mon, Nov 2 - Fri, Nov 8, 2024
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                    <Link href="/register">
                      <button className="bg-[#D5B93C] hover:bg-[#c4aa36] transition-all duration-300 py-3 lg:py-4 px-6 lg:px-8 text-[#203a87] text-base lg:text-lg font-semibold tracking-wider uppercase rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Register Now
                      </button>
                    </Link>
                    <Link href="#schedule">
                      <button className="border-2 border-white hover:border-[#D5B93C] text-white hover:text-[#D5B93C] transition-all duration-300 py-3 lg:py-4 px-6 lg:px-8 text-base lg:text-lg font-semibold tracking-wider uppercase rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        View Schedule
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Image Stack */}
                <div className="relative lg:w-1/2 mt-12 lg:mt-0">
                  <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                    <Image 
                      src="/Back.png" 
                      alt="Conference" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 border-2 border-[#D5B93C] pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                      <Image 
                        src="/people.jpg" 
                        alt="Conference Attendees" 
                        width={120}
                        height={80}
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-4">
        {/* Dots */}
        <div className="embla__dots flex gap-3">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex ? 'bg-[#D5B93C] w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation and Play/Pause - Only show on hover */}
        {isHovering && (
          <div className="flex items-center gap-4 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30"
            />
            <button
              onClick={toggleAutoPlay}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EmblaCarousel;