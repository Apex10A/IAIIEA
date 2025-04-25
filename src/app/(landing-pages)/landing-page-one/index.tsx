'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CarouselLandingPage from "./CarouselLandingPage"
import Carousel from "@/modules/ui/carousel"
import { EmblaOptionsType } from 'embla-carousel'
import RealConference from "@/modules/ui/RealConference";
import RealSeminar from "@/modules/ui/RealSeminar";
import { motion } from 'framer-motion';
import Sponsors from './sponsors'
import { FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaSchool, FaUsers, FaArrowRight, FaBookOpen } from 'react-icons/fa';

interface Book {
  id: number
  name: string
  overview: string
  description: string
  image: string
  journalLink: string
}

const LandingPage: React.FC = () => {
  const OPTIONS: EmblaOptionsType = {}
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const publications = [
    {
      id: 1,
      title: "JOURNAL OF INNOVATIONS IN EDUCATIONAL ASSESSMENT (JIEA)",
      volume: "VOL.1, NO.1, May, 2019",
      image: "/book.png", // Replace with your actual image path
      link: "https://journal.iaiiea.org/jiea/login?source=%2Fjiea%2Fissue%2Fview%2F1"
    }
    // Add more publications here if needed
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <CarouselLandingPage/>

      {/* About Section - Modified with "Our Journey" */}
      <section className="py-20 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B142F] mb-6 leading-tight">
                The International Association for Innovations in Educational Assessment (IAIIEA)
              </h1>
              
              {/* Our Journey Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#0B142F] mb-4">Our Journey So Far</h2>
                <p className="text-lg text-[#0B142F]/80 mb-4">
                  The International Association for Innovations in Educational Assessment (IAIIEA) was established on 9th October, 2018. That was when the Association was registered with the Federal Republic of Nigeria via the Corporate Affairs Commission (CAC) Abuja, Nigeria.
                </p>
                <p className="text-lg text-[#0B142F]/80 mb-6">
                  The Association came into limelight on 24th November, 2018 when the maiden conference was held in Abuja, the capital city of Nigeria, West Africa. It was indeed an academic conference. The conference took place at the Public Service Institute of Nigeria along Kubwa Express Road, Abuja.
                </p>
                <Link href="/about" className="inline-flex items-center px-6 py-3 bg-[#D5B93C] text-white font-medium rounded-lg hover:bg-[#C4A93C] transition-colors">
                  Read More <FaArrowRight className="ml-2" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-[#D5B93C] mt-1">
                    <FaGraduationCap size={24} />
                  </div>
                  <p className="text-lg text-[#0B142F]/80">
                    Developing innovations in educational assessment at all levels
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-[#D5B93C] mt-1">
                    <FaUsers size={24} />
                  </div>
                  <p className="text-lg text-[#0B142F]/80">
                    Promoting educational assessment innovations for national and international cohesion
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-[#D5B93C] mt-1">
                    <FaChalkboardTeacher size={24} />
                  </div>
                  <p className="text-lg text-[#0B142F]/80">
                    Providing intensive capacity building for researchers, students, teachers, and other educational stakeholders
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src='/AboutOne.jpg'
                  alt='IAIIEA Team Members'
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A3D] to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">Our Dedicated Team</h3>
                  <p>Committed to advancing educational assessment worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Pillars */}
      <section className="py-16 bg-[#F8F9FC]">
        <div className="container mx-auto px-4 md:px-8 lg:px-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-[#D5B93C] mb-4">
                <FaGraduationCap size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#0B142F] mb-3">Our Mission</h3>
              <p className="text-[#0B142F]/80">
                To advance innovative system that enhances quality assessment in terms of intellectual competence and the zeal to add value to our world.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-[#D5B93C] mb-4">
                <FaUsers size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#0B142F] mb-3">Our Vision</h3>
              <p className="text-[#0B142F]/80">
                IAIIEA has its vision to be a pace-setter and a world-class association for innovative educational assessment.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-[#D5B93C] mb-4">
                <FaChalkboardTeacher size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#0B142F] mb-3">Our Motto</h3>
              <p className="text-[#0B142F]/80">
                Innovation for excellence
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

       {/* Publications Section */}
       <section className="py-20 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B142F] mb-4">Our Publications</h2>
            <p className="text-xl text-[#0B142F]/80 max-w-3xl mx-auto">
              Explore our academic contributions to educational assessment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub) => (
              <motion.div
                key={pub.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={pub.image}
                    alt={pub.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <FaBookOpen className="text-[#D5B93C] mr-2" size={24} />
                    <h3 className="text-xl font-bold text-[#0B142F]">PUBLICATIONS</h3>
                  </div>
                  <h4 className="text-lg font-semibold text-[#0B142F] mb-2">{pub.title}</h4>
                  <p className="text-[#0B142F]/80 mb-4">{pub.volume}</p>
                  <Link 
                    href={pub.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[#D5B93C] text-white rounded-lg hover:bg-[#C4A93C] transition-colors"
                  >
                    View Publication <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-4 md:px-8 lg:px-14 bg-[#E9EBF3]">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            {/* <h2 className="text-4xl md:text-5xl font-bold text-[#0B142F] mb-4">Our Events</h2>
            <p className="text-xl text-[#0B142F]/80 max-w-3xl mx-auto">
              Join our premier events designed to advance educational assessment practices worldwide
            </p> */}
          </motion.div>

          <div className="">
            <RealConference/>
            <RealSeminar/>
            {/* <Sponsors/> */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage