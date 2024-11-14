"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import ToggleButton from "@/app/(members-dashboard)/members-dashboard/payment/ToggleButton";
import BorderlessTable from './BorderlessTable';
import Conference from "@/modules/ui/conference";
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import Document from './Download';
import VideoConference from "./videoConference"

// TypeScript interfaces
interface FoodOption {
  image: string;
  title: string;
  alt: string;
}

interface BreadcrumbProps {
  paths: string[];
}

// Component types
type SectionType = 'Conference Portal' | 'Conference Directory' | 'Conference Resources';

// Reusable components
const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => (
  <p className="text-base md:text-xl text-black">
    {paths.map((path, index) => (
      <span key={index}>
        {index > 0 && ' > '}
        <span className={index === paths.length - 1 ? 'font-semibold' : ''}>
          {path}
        </span>
      </span>
    ))}
  </p>
);

const FoodCard: React.FC<FoodOption> = ({ image, title, alt }) => (
  <div className="border rounded-lg overflow-hidden w-full md:w-[350px]">
    <div className="relative w-full h-48 md:h-[250px]">
      <Image 
        src={image} 
        alt={alt} 
        fill 
        className="object-cover"
      />
    </div>
    <div className="flex flex-col items-center p-4">
      <p className="text-xl md:text-2xl text-[#0B142F] font-medium py-2 text-center">{title}</p>
      <button className="border px-5 py-3 font-semibold hover:bg-gray-50 transition-colors text-[#0B142F] text-[16px] md:text-[19px]">
        Select
      </button>
    </div>
  </div>
);

const Page: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Conference Portal');

  const renderResources = () => (
    <div className="space-y-6 py-10">
     <div className='bg-gray-200 px-5 py-3 mb-6'>
        <h1 className='text-2xl'>Conference Portal {'>'} Conference Resources</h1>
      </div>
      {/* <Breadcrumb paths={['Home', 'Conference Portal', 'Conference Resources']} /> */}
      <div className="mt-10">
        <VideoConference/>
        <Document />
      </div>
    </div>
  );

  const renderConferencePortal = () => (
    <div className="space-y-8 bg-[#F9FAFF]">
           <div className='bg-gray-200 px-5 py-3 mb-6 mt-10'>
        <h1 className='text-2xl'>Conference Portal</h1>
      </div>
      {/* Conference Information */}
      <div className="flex flex-col md:flex-row md:items-center justify-between my-6 md:my-10 space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl text-[#0B142F] font-medium">2024 CONFERENCE</h1>
        <div className="text-base md:text-xl text-[#0B142F]">
          100+ people registered
          <Link href="/" className="underline font-medium ml-2">
            access participant directory
          </Link>
        </div>
      </div>

      {/* Conference Header */}
      <div className="py-2 md:py-4">
        <h1 className="text-2xl md:text-4xl text-[#0B142F] font-semibold leading-tight">
          Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence
        </h1>
      </div>

      <hr />

      {/* Conference Date and Location */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image src="/Calendar (1).svg" alt="Calendar" width={25} height={25} />
          <p className="text-base md:text-lg text-[#0B142F] opacity-80">
            Mon, Nov 2 - Fri, Nov 8 2024
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Image src="/MapPin.svg" alt="Location" width={25} height={25} />
          <p className="text-base md:text-lg text-[#0B142F] opacity-80 max-w-2xl">
            UBEC Digital Resource Centre, Opposite Next Gen (Cash and Carry) Supermarket, Mabushi, Jahi District, Abuja. Nigeria. West Africa.
          </p>
        </div>
      </div>

      <hr />

      {/* Resources Section */}
      <div className="space-y-6">
        <h1 className="text-2xl md:text-4xl text-[#0B142F] font-semibold leading-tight">
          Resources
        </h1>
        <div className="flex flex-col text-[#0B142F] md:flex-row md:items-center justify-between gap-4">
          <p className="text-lg md:text-xl text-[#0B142F]">
            View
            <Link href="/" className="underline font-semibold ml-2 text-[#0B142F]">
              conference preceding
            </Link>
          </p>
          <button 
            onClick={() => setSelectedSection('Conference Resources')}
            className="bg-[#203a87] text-white px-6 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-[#162a61] transition-colors w-[70%] md:w-auto"
          >
            Resources
          </button>
        </div>
      </div>

      <hr />

      {/* Schedule Section */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-4xl text-[#0B142F] font-semibold leading-tight">
          Daily conference schedule
        </h1>
        <p className="text-base md:text-lg text-[#0B142F] opacity-80">
          Day 1: Monday 4th November 2024
        </p>
        <BorderlessTable />
      </div>

      <hr />

      {/* Meal Ticketing */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl text-[#0B142F] font-semibold leading-tight">
            Meal ticketing
          </h1>
          <p className="text-base md:text-lg text-[#0B142F]">
            This is the list of food currently available for the day. Select any food of your choice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FoodCard 
            image="/Jollof.png"
            title="Nigerian Jollof"
            alt="Jollof Rice"
          />
          <FoodCard 
            image="/Egusi.png"
            title="Egusi Soup"
            alt="Egusi Soup"
          />
        </div>
      </div>

      {/* Virtual Event Access */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-4xl text-[#0B142F] font-bold opacity-80">
          Join event for virtual attendees
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-[#0B142F]">
          <p className="text-base md:text-lg">You can access the live event from here</p>
         <Link href='https://us06web.zoom.us/j/84732263237?pwd=dS4rtkyZnhRdAhvpOOrU5SjFbTbIWH.1'>
         <button className="bg-[#203a87] text-white px-6 py-3 rounded-full text-base md:text-lg font-semibold hover:bg-[#162a61] transition-colors w-full md:w-auto">
            Join in
          </button>
         </Link>
        </div>
      </div>

      {/* Certification */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-4xl text-[#0B142F] font-bold opacity-80">
          Certification
        </h2>
        <div className="text-base md:text-lg space-x-2">
          <span className='text-[#0B142F]'>Complete the</span>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSehH3uyk-sucMxTaGr_fOASUuU6UrtGX-kqsODNlO9XmAoJQQ/viewform?usp=sharing" className="underline text-[#0B142F]">
            conference evaluation form
          </Link>
          <span>to</span>
          <Link href="/dashboard/conference-evaluation" className="text-[#0B142F]">
            access certificate
          </Link>
        </div>
      </div>

      {/* Conference Component */}
      <Conference />
    </div>
  );

  return (
    <div className="container mx-auto px-4 md:px-6">
      <ButtonProp 
        options={['Conference Portal', 'Conference Directory']} 
        selectedSection={selectedSection} 
        setSelectedSection={setSelectedSection as (section: string) => void} 
      />
      
      {selectedSection === 'Conference Portal' && renderConferencePortal()}
      {selectedSection === 'Conference Resources' && renderResources()}
      {selectedSection === 'Conference Directory' && (
        <div className="py-5 px-5">
          <h1 className="text-3xl md:text-5xl opacity-20 font-semibold">
            Coming soon!!!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Page;