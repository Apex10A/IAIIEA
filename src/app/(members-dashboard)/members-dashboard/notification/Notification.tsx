
// Page.tsx
'use client';
import React, { useState } from 'react';
import ButtonProp from './button';
import ImageAdd from '@/modules/ui/ImageAdd';
import ExpandableSection from './Expandable'; // Import the new component

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<'Announcement' | 'Job Opportunity'>('Announcement');

  const [expandedSections, setExpandedSections] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
  });

  const toggleExpansion = (section: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className='max-w-[70%] mx-10 my-10'>
     <div className='bg-gray-200 px-5 py-3 mb-6 mt-10'>
        <h1 className='text-2xl'>Announcement</h1>
      </div>
      <div>
        
        <ButtonProp options={['Announcement', 'job opportunity']} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
        {selectedSection === 'Announcement' ? (
          <>
            <div className='pt-8 flex items-center justify-center gap-10'>
              <div className='border-t border-[#CACAC9] absolute w-[40%]'></div>
              <div className='pb-2'>
                <p className='pb-7 italic'>July 23, 2024</p>
              </div>
              <div className='border-t border-[#CACAC9] absolute w-[40%]'></div>
            </div>

            <ExpandableSection
              title="Link to funding opportunities"
              section="section1"
              expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
            </ExpandableSection>

            <ExpandableSection
              title="Webinar has started"
              section="section2"
              expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div className='mt-5 flex items-center justify-between pr-10 mb-3'>
                <p className='font-[500] text-[18px]'>Conference 2024</p>
                <p className='font-[500] text-[18px]'>Posted: 4:00pm </p>
              </div>
              <div>
                <p className='font-[600] text-[20px]'>
                  Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence
                </p>
              </div>
              <div className='flex flex-col my-4'>
                <p className='font-[500] text-[20px] mb-3'>1478 people on the call</p>
                <button className='bg-[#203a87] font-semibold text-white px-5 py-3 rounded-[30px] text-[17px] max-w-[30%]'>Join in</button>
              </div>
            </ExpandableSection>

            <ExpandableSection
              title="Change of venue & time"
              section="section3"
              expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div className='mt-5 mb-3 flex justify-between'>
                <p className='font-[600] text-[20px] max-w-xl'>
                  We apologize for the inconveniences caused, the new venue can be found on the flyer below.
                </p>
                <p>posted: 1:20pm</p>
              </div>
              <ImageAdd />
            </ExpandableSection>
            <ExpandableSection
             title='Register for 2024 conference'
             section='section4'
             expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div>
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
              </div>
    
            </ExpandableSection>

            <ExpandableSection
             title='Application for journal publication'
             section='section5'
             expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div>
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
              </div>
    
            </ExpandableSection>

            <ExpandableSection
             title='Access to education webinar'
             section='section6'
             expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div>
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
              </div>
    
            </ExpandableSection>
          </>
        ) : (
          <div>
            <ExpandableSection
             title='Funding opportunity'
             section=''
             expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div>
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
              </div>
    
            </ExpandableSection>
            <ExpandableSection
             title='Grant opportunity'
             section=''
             expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div>
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
              </div>
    
            </ExpandableSection>

            <ExpandableSection
             title='Content creator needed'
             section=''
             expandedSections={expandedSections}
              toggleExpansion={toggleExpansion}
            >
              <div>
              <p className='font-[600] text-[20px]'>Here are more details about the text...</p>
              </div>
    
            </ExpandableSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

