"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const SponsorsPage = () => {
  // Sponsor data with different tiers
  const sponsors = {
    platinum: [
      { id: 1, name: 'TechEdu', logo: '/sponsors/techedu.png', url: 'https://techedu.com' },
      { id: 2, name: 'LearnSphere', logo: '/sponsors/learnsphere.png', url: 'https://learnsphere.org' }
    ],
    gold: [
      { id: 3, name: 'EduInnovate', logo: '/sponsors/eduinnovate.png', url: 'https://eduinnovate.com' },
      { id: 4, name: 'FutureLearn', logo: '/sponsors/futurelearn.png', url: 'https://futurelearn.io' },
      { id: 5, name: 'SmartAssess', logo: '/sponsors/smartassess.png', url: 'https://smartassess.com' }
    ],
    silver: [
      { id: 6, name: 'EduTools', logo: '/sponsors/edutools.png', url: 'https://edutools.com' },
      { id: 7, name: 'AssessmentPro', logo: '/sponsors/assessmentpro.png', url: 'https://assessmentpro.com' },
      { id: 8, name: 'LearnRight', logo: '/sponsors/learnright.png', url: 'https://learnright.com' },
      { id: 9, name: 'EduMetrics', logo: '/sponsors/edumetrics.png', url: 'https://edumetrics.com' }
    ],
    partners: [
      { id: 10, name: 'GlobalEd', logo: '/sponsors/globaled.png', url: 'https://globaled.org' },
      { id: 11, name: 'TeachForward', logo: '/sponsors/teachforward.png', url: 'https://teachforward.com' },
      { id: 12, name: 'EduConnect', logo: '/sponsors/educonnect.png', url: 'https://educonnect.world' }
    ]
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#0B142F] mb-4">
          Our Valued Sponsors
        </h1>
        <p className="text-xl text-[#0B142F]/80 max-w-3xl mx-auto">
          We gratefully acknowledge the support of our sponsors who make our events and initiatives possible.
        </p>
      </motion.div>

      {/* Platinum Sponsors */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={container}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="text-center mb-10">
          <motion.h2 variants={fadeIn} className="text-3xl font-bold text-[#0B142F] mb-2">
            Platinum Sponsors
          </motion.h2>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-[#D5B93C] mx-auto"></motion.div>
        </div>
        
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {sponsors.platinum.map((sponsor) => (
            <motion.div 
              key={sponsor.id}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-32 mb-6">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <a 
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#203A87] hover:text-[#152a61] font-medium mt-4"
                >
                  Visit website <FiArrowRight className="ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Gold Sponsors */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={container}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="text-center mb-10">
          <motion.h2 variants={fadeIn} className="text-3xl font-bold text-[#0B142F] mb-2">
            Gold Sponsors
          </motion.h2>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-[#D5B93C] mx-auto"></motion.div>
        </div>
        
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {sponsors.gold.map((sponsor) => (
            <motion.div 
              key={sponsor.id}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-24 mb-4">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <a 
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#203A87] hover:text-[#152a61] font-medium text-sm mt-2"
                >
                  Visit website <FiArrowRight className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Silver Sponsors */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={container}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="text-center mb-10">
          <motion.h2 variants={fadeIn} className="text-3xl font-bold text-[#0B142F] mb-2">
            Silver Sponsors
          </motion.h2>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-[#D5B93C] mx-auto"></motion.div>
        </div>
        
        <motion.div 
          variants={container}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {sponsors.silver.map((sponsor) => (
            <motion.div 
              key={sponsor.id}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-16 mb-2">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <a 
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#203A87] hover:text-[#152a61] font-medium text-xs mt-1"
                >
                  Visit <FiArrowRight className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Partners */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={container}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="text-center mb-10">
          <motion.h2 variants={fadeIn} className="text-3xl font-bold text-[#0B142F] mb-2">
            Partners
          </motion.h2>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-[#D5B93C] mx-auto"></motion.div>
        </div>
        
        <motion.div 
          variants={container}
          className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto"
        >
          {sponsors.partners.map((sponsor) => (
            <motion.div 
              key={sponsor.id}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-14">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Become a Sponsor CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        viewport={{ once: true }}
        className="bg-[#0E1A3D] rounded-2xl p-8 md:p-12 text-center max-w-6xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Interested in becoming a sponsor?
        </h2>
        <p className="text-white/80 mb-6 max-w-3xl mx-auto">
          Join our prestigious group of sponsors and gain visibility among education professionals and institutions worldwide.
        </p>
        <button className="bg-[#D5B93C] hover:bg-[#c4aa36] text-[#0B142F] font-bold py-3 px-8 rounded-lg transition-colors duration-300">
          Contact Us
        </button>
      </motion.section>
    </div>
  );
};

export default SponsorsPage;