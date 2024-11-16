import React from 'react';
import Image from 'next/image';

const ConferenceCards = () => {
  const conferences = [
    {
      year: '2024',
      title: 'Conference 2024',
      description: 'Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence',
      date: 'Mon, Nov 2 - Fri, Nov 8',
      image: '/Meeting.png',
      status: 'Completed',
      bgColor: 'bg-blue-50'
    },
    {
      year: '2023',
      title: 'Conference 2023',
      description: 'Innovation in Educational Technology: Bridging the Digital Divide',
      date: 'Mon, Oct 15 - Fri, Oct 21',
      image: '/Meeting.png',
      status: 'Completed',
      bgColor: 'bg-amber-50'
    },
    {
      year: '2022',
      title: 'Conference  2022',
      description: 'Future of Education: Remote Learning and Digital Transformation',
      date: 'Mon, Sep 5 - Fri, Sep 11',
      image: '/Meeting.png',
      status: 'Completed',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {conferences.map((conference, index) => (
          <div 
            key={index}
            className={`${conference.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
          >
            <div className="relative">
              <div className="absolute z-20 bottom-5 left-5">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
                    conference.status === 'Completed'
                      ? 'bg-[#f2e9c3] text-[#0B142F] hover:bg-[#e9dba3]'
                      : 'bg-[#203A87] text-white hover:bg-[#152a61]'
                  }`}
                >
                  {conference.status}
                </button>
              </div>
              <Image
                src={conference.image}
                alt={`Conference ${conference.year}`}
                width={600}
                height={400}
                className="w-full h-[250px] object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-[#0B142F] text-2xl lg:text-3xl font-semibold">
                  {conference.title}
                </h1>
                <span className="text-[#203A87] font-bold text-lg">
                  {conference.year}
                </span>
              </div>
              <p className="text-[#0B142F] text-base lg:text-lg font-medium mb-4 line-clamp-2">
                {conference.description}
              </p>
              <p className="text-gray-600 text-sm lg:text-base font-medium mb-6">
                {conference.date}
              </p>
              <div className="flex items-center space-x-4">
                <button className="bg-[#203A87] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#152a61] transition-colors duration-300 flex-grow sm:flex-grow-0">
                  Read More
                </button>
                <button className="border-2 border-[#203A87] px-4 py-2 rounded-lg text-[#203A87] font-medium hover:bg-[#203A87] hover:text-white transition-colors duration-300">
                  Register
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConferenceCards;