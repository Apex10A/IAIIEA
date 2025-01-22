'use client'
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Chevron icons for interactivity

const Index = () => {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore(!showMore);
  };

  return (
    <div className='py-10 md:px-14 px-5'>
      <div className='max-w-[1200px] mx-auto'>
        {/* Sub-theme section */}
        <div className='bg-zinc-100 px-10 py-8 rounded-lg shadow-lg'>
          <div className='flex flex-col items-center justify-center'>
            <section className='mb-8'>
              <h1 className='text-[48px] font-bold text-[#0B142F] pb-5 text-center'>
                Sub-theme:
              </h1>
              <ul className='leading-10 list-disc pl-5'>
                {[
                  'Leveraging Artificial Intelligence in Online Learning Environments',
                  'Exploring the Convergence of Big Data, Machine, and Deep Learning',
                  'Utilizing Artificial Intelligence in Data Analysis for Research and Enhanced Learning',
                  'Innovative Learner-Centered Teaching Methods',
                  'Digitalization of Assessment Management',
                  'EdTech Trends and its Role in Sustainable Global Economic Growth',
                  'Cultivating 21st Century Educational Leadership Skills',
                  'Any other related sub-topics',
                ].map((item, index) => (
                  <li key={index} className='text-[20px] font-[400] text-[#0B142F]'>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Show More / Less Button */}
          <div className='text-center flex items-center justify-center'>
            <button
              onClick={handleToggle}
              className="bg-gradient-to-r from-[#D5B93C] to-[#B89A2E] py-4 px-8 text-[#203a87] text-[18px] font-[600] tracking-widest mt-3 uppercase mx-auto lg:mx-0 flex items-center gap-3 hover:bg-gradient-to-r hover:from-[#B89A2E] hover:to-[#9A7C21] transition-all duration-300"
            >
              {showMore ? 'Show Less' : 'Show More'}
              {showMore ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        {/* Conditionally render more content */}
        {showMore && (
          <div className='mt-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <section className='bg-white p-6 shadow-md rounded-lg'>
                <h2 className='text-[30px] font-bold text-[#0B142F] pb-4'>
                  Important Dates
                </h2>
                <ul className='leading-10 list-disc pl-5'>
                  {[
                    'Submission of abstracts begins June 01, 2024',
                    'Conference registration begins June 01, 2024',
                    'Deadline for submission of abstracts September 15, 2024',
                    'Deadline of submission of full papers October 15, 2024',
                    'Deadline for normal registration October 15, 2024',
                    'Late registration begins October 16, 2024',
                    'Late registration ends November 05, 2024',
                  ].map((item, index) => (
                    <li key={index} className='text-[18px] font-[400] text-[#0B142F]'>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Workshop Section */}
              <section className='bg-white p-6 shadow-md rounded-lg'>
                <h2 className='text-[30px] font-bold text-[#0B142F] pb-4'>
                  Workshop
                </h2>
                <ul className='leading-10 list-disc pl-5'>
                  {[
                    'Tips for Digitised Educational Assessment',
                    'Application of Artificial Intelligence in Teaching, Learning and Assessment',
                    'Application of Artificial Intelligence in Research',
                  ].map((item, index) => (
                    <li key={index} className='text-[18px] font-[400] text-[#0B142F]'>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Call for Paper Section */}
            <section className='bg-[#E9EBF3] min-h-[400px] flex flex-col items-center justify-center text-center p-10 rounded-lg mt-8 shadow-md'>
              <h1 className='text-[48px] font-bold text-[#0B142F] pb-5'>
                Call for Paper Flyer
              </h1>
              <p className='text-[20px] font-[400] text-[#0B142F] max-w-[60%]'>
                We invite submissions for IAIIEA conference 2024. We seek innovative research and insights on topics aligning with the conference theme. Please submit your abstract by [deadline] to iaiiea2024@iaiiea.org. The paper should address issues outlined in the sub-themes.
              </p>
              <button className='mt-5 text-[20px] font-[400] bg-gradient-to-r from-[#203A87] to-[#1A2F66] text-white px-6 py-3 rounded-full hover:from-[#1A2F66] hover:to-[#16305A] transition-all duration-300'>
                Download Flyer
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
