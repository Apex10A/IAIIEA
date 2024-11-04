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
    if (isPlaying) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [emblaApi, isPlaying, autoPlayInterval]);

  return (
    <section className="embla relative w-full overflow-hidden min-h-screen">
      <div className="embla__viewport w-full" ref={emblaRef}>
        <div className="embla__container flex w-full">
          {/* First Slide */}
          <div className="embla__slide min-w-full">
            <div className="relative min-h-screen w-full bg-[rgb(14,26,61)] px-4 md:px-8 lg:px-14 py-20">
              <div className="lg:flex items-center justify-between h-full">
                {/* Text Content */}
                <div className="lg:w-1/2 space-y-6 lg:space-y-8 lg:py-44 py-10">
                  <h1 className="text-4xl sm:text-5xl lg:text-[80px] text-center lg:text-left font-semibold text-white leading-tight lg:leading-[1.2]">
                    <span className="text-[#D5B93C]">Innovating</span> assessment practices to better support education.
                  </h1>
                  <Link href="/members-Registration">
                    <button className="bg-[#D5B93C] hover:bg-[#c4aa36] transition-colors py-3 lg:py-4 px-6 lg:px-8 text-[#203a87] text-base lg:text-xl font-semibold tracking-wider uppercase w-[80%] block sm:w-auto mx-auto lg:mx-0 mt-10 rounded-md shadow-lg hover:shadow-xl">
                      Become a member
                    </button>
                  </Link>
                </div>

                {/* Image Stack */}
                <div className="relative lg:w-1/2 mt-10 lg:mt-0">
                  <div className="hidden lg:block absolute right-0 top-[-200px] transform hover:scale-105 transition-transform">
                    <div className="border-2 border-[#D5B93C] shadow-xl">
                      <Image 
                        src="/DSA3.JPG" 
                        alt="Assessment Practice" 
                        width={550} 
                        height={550}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="hidden lg:block absolute right-12 top-[-50px] transform hover:scale-105 transition-transform">
                    <div className="border-2 border-[#D5B93C] shadow-xl">
                      <Image 
                        src="/DSA2.JPG" 
                        alt="Education Support" 
                        width={550} 
                        height={550}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="relative lg:absolute lg:right-28 transform lg:top-[-150px] hover:scale-105 transition-transform">
                    <div className="border-2 border-[#D5B93C] shadow-xl max-w-[90%] mx-auto">
                      <Image 
                        src="/DSA.JPG" 
                        alt="Innovation" 
                        width={650} 
                        height={650}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Slide */}
          <div className="embla__slide min-w-full">
            <div className="relative min-h-screen w-full bg-[rgb(14,26,61)] px-4 md:px-8 lg:px-14 py-20">
              <div className="lg:flex items-center justify-between h-full">
                {/* Text Content */}
                <div className="lg:w-1/2 space-y-6 lg:py-44 py-10">
                  <h2 className="text-xl sm:text-2xl lg:text-[23px] font-medium text-[#D5B93C] leading-wider">
                    Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence
                  </h2>
                  <h1 className="text-4xl sm:text-5xl lg:text-[80px] font-semibold text-white leading-tight">
                    Conference 2024
                  </h1>
                  <div className="space-y-4">
                    <p className="text-base lg:text-xl text-white/70">
                      UBEC Digital Resource Centre, Opposite Next Gen (Cash and Carry) Supermarket, Mabushi, Jahi District, Abuja. Nigeria. West Africa.
                    </p>
                    <p className="text-base lg:text-xl text-white/70">
                      Mon, Nov 2 - Fri, Nov 8
                    </p>
                  </div>
                  <Link href="/conference-Registration">
                    <button className="bg-[#D5B93C] hover:bg-[#c4aa36] transition-colors py-3 lg:py-4 px-6 lg:px-8 text-[#203a87] text-base lg:text-xl font-semibold tracking-wider uppercase w-full sm:w-auto rounded-md shadow-lg hover:shadow-xl mt-10">
                      Register for conference
                    </button>
                  </Link>
                </div>

                {/* Image Stack */}
                <div className='relative lg:w-1/2 mt-10 lg:mt-0'>
                <div className="hidden lg:block absolute right-0 top-[-200px] transform hover:scale-105 transition-transform">
                  <div className="border-2 border-[#D5B93C] shadow-xl max-w-[90%] mx-auto">
                    <Image 
                      src="/Back.png" 
                      alt="Conference" 
                      width={650} 
                      height={650}
                      className="object-cover shadow-xl"
                    />
                  </div>
                </div>
                <div className="relative lg:absolute lg:right-48 transform lg:top-[-50px] hover:scale-105 transition-transform">
                  <div className="border-2 border-[#D5B93C] shadow-xl max-w-[90%] mx-auto">
                    <Image 
                      src="/people.jpg" 
                      alt="Conference" 
                      width={650} 
                      height={650}
                      className="object-cover shadow-xl"
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
        <div className="embla__dots flex gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot w-3 h-3 rounded-full bg-white/50 transition-colors ${
                index === selectedIndex ? 'bg-white' : ''
              }`}
            />
          ))}
        </div>

        {/* Navigation and Play/Pause */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-md text-white hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause size={20} /> Pause
              </>
            ) : (
              <>
                <Play size={20} /> Play
              </>
            )}
          </button>
          <div className="flex gap-2 items-start justify-start">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-md text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-md text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;