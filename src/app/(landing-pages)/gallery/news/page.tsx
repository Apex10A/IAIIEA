import React from 'react';
import '@/app/index.css';
import Image from 'next/image';

const Page = () => {
  return (
    <div className='flex flex-col lg:flex-row lg:h-full py-28 px-6 md:px-10 gap-6'>
      {/* Main content */}
      <div className='lg:w-[70%] w-full bg-gray-100 py-6 px-8 md:px-10 rounded-lg'>
        <div className='w-full'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl max-w-2xl font-semibold text-[#0B142F] pb-3'>
            Tinubu, Obasanjo, Jonathan, Afenifere, PANDEF others to storm Imo for Iwuanyanwu&apos;s burial
          </h1>
        </div>
        <div className='flex items-center justify-between text-sm md:text-base'>
          <div>
            <p>News</p>
          </div>
          <div>
            <p>October 9th, 2024</p>
            <p>12:00pm</p>
          </div>
        </div>

        <div className='w-full md:w-[80%] lg:w-[90%] xl:w-[700px] py-4'>
          <Image src='/NewsImage.png' alt='News Image' width={700} height={400} className='rounded-lg' />
        </div>

        <div className='py-6'>
          <p className='text-sm md:text-lg pb-3'>
            President Bola Ahmed Tinubu is set to attend the burial ceremony of the late President General of Ohanaeze Ndigbo Worldwide, Chief Emmanuel Iwuanyanwu, in Imo State. The Chairman of the Local Organizing Committee, Charles Amadi (Chalvon), disclosed this during a press briefing in Owerri, outlining the one-week schedule of activities leading up to the burial on November 1, 2024.
          </p>
          <p className='text-sm md:text-lg pb-3'>
            Amadi confirmed that several former Nigerian presidents, including Olusegun Obasanjo, Goodluck Jonathan, and Abdusalami Abubakar, alongside prominent Northern leaders, Afenifere, Pan Niger Delta Forum (PANDEF), and other national leaders, both from within and outside Nigeria, are expected to attend.
          </p>
          <p className='text-sm md:text-lg pb-3'>
            Assuring the public of a well-organized event, Amadi stated, “There will be adequate security for everyone, traffic will be well controlled, and the movement of people and vehicles across Imo State will be smooth.”
          </p>
          <p className='text-sm md:text-lg pb-3'>
            He detailed the burial activities as follows:
            October 29, 2024: A service of songs will be held in honor of Chief Iwuanyanwu.
          </p>
          <p className='text-sm md:text-lg pb-3'>
            October 30, 2024: The late Chief’s body will arrive at the Imo State Government House, move to Glass House, Ugwu Orji, and then proceed to his residence in New Owerri.
          </p>
          <p className='text-sm md:text-lg pb-3'>
            November 1, 2024: A commendation service will take place at Catol, Owerri, followed by stops at Hardel Bus Stop Orji, Eke-Atta, and Atta Junction. His body will lie in state at his residence in Atta, followed by a funeral service at the Cathedral of St. Matthew, Atta, with interment in his compound.
          </p>
          <p className='text-sm md:text-lg pb-3'>
            November 2, 2024: Condolence and traditional visits will be held at his residence in Atta.
          </p>
        </div>
      </div>

      {/* Sidebar content */}
      <div className='lg:w-[30%] w-full flex flex-col gap-4'>
        <div className='w-full h-full bg-gray-200 p-4 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold mb-4'>Related News or Ads</h2>
          <p className='text-sm md:text-base'>
            This section takes up 30% of the page. You can add related news, advertisements, or other side content here.
          </p>
        </div>
        
        <div className='w-full h-full bg-gray-200 p-4 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold mb-4'>Latest News</h2>
          <p className='text-sm md:text-base'>
          President Bola Ahmed Tinubu is set to attend the burial ceremony of the late President General of Ohanaeze Ndigbo Worldwide, Chief Emmanuel Iwuanyanwu, in Imo State.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
