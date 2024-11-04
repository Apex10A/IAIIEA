import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

const conferences = [
  {
    title: 'Conference 2021',
    description: 'A conference about tech innovations and trends.',
    date: 'March 2021',
    imageUrl: '/Meeting.png',
  },
  {
    title: 'Conference 2022',
    description: 'Exploring the future of AI and machine learning.',
    date: 'April 2022',
    imageUrl: '/Meeting.png',
  },
  {
    title: 'Conference 2023',
    description: 'Blockchain and Web3 technologies for a better future.',
    date: 'May 2023',
    imageUrl: '/Meeting.png',
  },
  {
    title: 'Conference 2024',
    description: 'Revolutionizing cloud infrastructure and cybersecurity.',
    date: 'June 2024',
    imageUrl: '/Meeting.png',
  },
];

const ConferenceCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % conferences.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? conferences.length - 1 : prevIndex - 1
    );
  };

  const getPreviousIndex = (index: number) =>
    index === 0 ? conferences.length - 1 : index - 1;

  const getNextIndex = (index: number) => (index + 1) % conferences.length;

  return (
    <div className="pt-10 pb-20 bg-[#E9EBF3] px-4 md:px-8">
      <div className="pb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-[#0B142F]">
          Read about our previous conferences
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
        {/* Previous Conference Card */}
        <div
          className="transform transition-all duration-500 opacity-50 scale-75 bg-[#DEE1ED] rounded-[30px] shadow-lg border w-full md:w-1/3 hidden md:block"
        >
          <div className="relative">
            <Image
              src={conferences[getPreviousIndex(activeIndex)].imageUrl}
              alt={conferences[getPreviousIndex(activeIndex)].title}
              width={600}
              height={400}
              className="rounded-t-[30px] w-full object-cover"
            />
            <button className="absolute bottom-5 left-5 bg-[#f2e9c3] px-3 py-2 rounded-md font-[600] text-[18px]">
              Completed
            </button>
          </div>
          <div className="px-4 py-5 text-center">
            <h2 className="text-lg md:text-4xl font-bold text-[#0B142F]">
              {conferences[getPreviousIndex(activeIndex)].title}
            </h2>
            <p className="text-[#0B142F] text-sm md:text-lg">
              {conferences[getPreviousIndex(activeIndex)].description}
            </p>
            <p className="text-[#0B142F] text-lg mt-2">
              {conferences[getPreviousIndex(activeIndex)].date}
            </p>
          </div>
        </div>

        {/* Active Conference Card */}
        <div className="w-full md:w-1/3 relative z-20 bg-white rounded-[30px] shadow-lg">
          <div className="relative">
            <Image
              src={conferences[activeIndex].imageUrl}
              alt={conferences[activeIndex].title}
              width={600}
              height={400}
              className="rounded-t-[30px] w-full object-cover"
            />
            <button className="absolute bottom-5 left-5 bg-[#f2e9c3] px-3 py-2 rounded-md font-[600] text-[18px]">
              Completed
            </button>
          </div>
          <div className="px-4 md:px-7 pt-5 pb-8 text-center">
            <h1 className="text-xl md:text-4xl font-bold text-[#0B142F]">
              {conferences[activeIndex].title}
            </h1>
            <p className="text-[#0B142F] text-md md:text-lg font-medium py-2">
              {conferences[activeIndex].description}
            </p>
            <p className="text-[#0B142F] text-md md:text-lg font-light">
              {conferences[activeIndex].date}
            </p>
            <button className="bg-[#203a87] py-2 px-4 md:py-3 md:px-8 text-white text-sm md:text-[18px] font-semibold tracking-wide mt-3 rounded-md uppercase">
              Read
            </button>
          </div>
        </div>

        {/* Next Conference Card */}
        <div
          className="transform transition-all duration-500 opacity-50 scale-75 bg-[#DEE1ED] rounded-[30px] shadow-lg border w-full md:w-1/3 hidden md:block"
        >
          <div className="relative">
            <Image
              src={conferences[getNextIndex(activeIndex)].imageUrl}
              alt={conferences[getNextIndex(activeIndex)].title}
              width={600}
              height={400}
              className="rounded-t-[30px] w-full object-cover"
            />
            <button className="absolute bottom-5 left-5 bg-[#f2e9c3] px-3 py-2 rounded-md font-[600] text-[18px]">
              Completed
            </button>
          </div>
          <div className="px-4 py-5 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0B142F]">
              {conferences[getNextIndex(activeIndex)].title}
            </h2>
            <p className="text-[#0B142F] text-md md:text-base">
              {conferences[getNextIndex(activeIndex)].description}
            </p>
            <p className="text-[#0B142F] text-md mt-2">
              {conferences[getNextIndex(activeIndex)].date}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center mt-8 gap-6">
        <button
          onClick={handlePrev}
          className="text-[#0B142F] hover:text-[#fbbf24] text-2xl p-3 border border-[#0B142F] rounded-full"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className="text-[#0B142F] hover:text-[#fbbf24] text-2xl p-3 border border-[#0B142F] rounded-full"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ConferenceCarousel;
