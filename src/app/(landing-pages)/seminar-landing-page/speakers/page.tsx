import React from 'react';
import Image from 'next/image';

const speakers = [
  {
    name: 'Dr. Jane Smith',
    occupation: 'Professor of Artificial Intelligence',
    institution: 'University of Tech',
    imageUrl: '/icons/Frame 20.png',
  },
  {
    name: 'John Doe',
    occupation: 'Data Scientist',
    institution: 'Global Data Corp',
    imageUrl: '/icons/Frame 20.png',
  },
  {
    name: 'Emily Johnson',
    occupation: 'EdTech Consultant',
    institution: 'EduFuture Solutions',
    imageUrl: '/icons/Frame 20.png',
  },
  {
    name: 'Michael Brown',
    occupation: 'AI Researcher',
    institution: 'Tech Innovations Lab',
    imageUrl: '/icons/Frame 20.png',
  },
  {
    name: 'Sophia Williams',
    occupation: 'Digital Learning Expert',
    institution: 'Online Learning Co.',
    imageUrl: '/icons/Frame 20.png',
  },
  {
    name: 'David Wilson',
    occupation: 'Educational Leader',
    institution: 'Global Education Initiative',
    imageUrl: '/icons/Frame 20.png',
  },
];

const Speakers = () => {
  return (
    <div className='py-20 bg-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold text-center text-[#0B142F] mb-10'>
          Meet Our Speakers
        </h1>

        {/* Cards container */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className='bg-[#FFFDF4] border rounded-[30px] p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300'
            >
              <div className='flex flex-col items-center'>
                {/* Speaker Image */}
                <Image
                  src={speaker.imageUrl}
                  alt={speaker.name}
                  width={150}
                  height={150}
                  className='w-24 sm:w-32 md:w-36 lg:w-40 rounded-full object-cover mb-4'
                />
                
                {/* Speaker Details */}
                <h2 className='text-2xl font-[600] text-[#0B142F] mb-2'>
                  {speaker.name}
                </h2>
                <p className='text-gray-600 mb-1'>
                  {speaker.occupation}
                </p>
                <p className='text-gray-500'>{speaker.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Speakers;
