'use client'
import React from 'react';

const seminarOptions = [
  {
    title: 'Basic Access',
    priceDollar: '$29.99',
    priceNaira: 'N30,000',
    includes: 'Conference materials, networking, some meals',
    background: 'bg-[#F9F5E2]',
  },
  {
    title: 'Premium Access',
    priceDollar: '$49.99',
    priceNaira: 'N50,000',
    includes: 'Conference materials, networking, meals, conference workshop, excursion',
    background: 'bg-[#DEE1ED]',
  },
  {
    title: 'VIP Access',
    priceDollar: '$99.99',
    priceNaira: 'N100,000',
    includes: 'Conference materials, VIP seating, full meals, exclusive workshop, private excursion',
    background: 'bg-[#F9F5E2]',
  },
];

const SeminarPage = () => {
  return (
    <div className="min-h-[600px] px-5 py-10 md:px-14">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0B142F] mb-10">
          Seminar Fee
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seminarOptions.map((option, index) => (
            <div
              key={index}
              className={`${option.background} flex flex-col items-center justify-center p-6 md:py-10 md:px-8 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer`}
            >
              <h1 className="text-[22px] md:text-[25px] font-[500] text-[#0B142F] py-5 md:py-7">{option.title}</h1>
              <h1 className="text-[48px] md:text-[56px] font-[500] text-[#0B142F]">{option.priceDollar}</h1>
              <h1 className="text-[32px] md:text-[40px] font-[500] text-[#0B142F]">{option.priceNaira}</h1>
              <p className="text-[16px] md:text-[18px] text-[#0B142F] text-center max-w-sm py-4 md:py-5 opacity-70">
                <span className="font-[600]">Includes: </span>
                {option.includes}
              </p>
              <div className="pt-4 md:pt-5">
                <button className="bg-transparent border-2 border-[#203a87] px-6 md:px-8 py-2 font-semibold text-[#203a87]">
                  Upgrade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeminarPage;
