"use client"
import React from 'react'
import Image from 'next/image'
import CarouselLandingPage from "./CarouselLandingPage"
import Carousel from "@/modules/ui/carousel"
import { EmblaOptionsType } from 'embla-carousel'
import RealConference from "@/modules/ui/RealConference";
import RealSeminar from "@/modules/ui/RealSeminar";
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaSchool, FaUsers } from 'react-icons/fa';

interface Book {
  id: number
  name: string
  overview: string
  description: string
  image: string
  journalLink: string
}

const LandingPage: React.FC = () => {
  const BooksData: Book[] = [
    {
      id: 1,
      name: "Educational Innovations",
      overview: "Journal of Innovations in Educational Assessment (JIEA)",
      description: "Vol. 1, No. 1, May, 2019",
      image: "/VolOne.png",
      journalLink: "https://example.com/journal1"
    },
    // ... other book data
  ]

  const OPTIONS: EmblaOptionsType = {}
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <CarouselLandingPage/>

      {/* About Section */}
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
              <p className="text-lg md:text-xl text-[#0B142F]/80 mb-6">
                We are an Association for innovative assessment with the mission of promoting the Science and practice of innovations in educational assessment.
              </p>
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
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B142F] mb-4">Our Events</h2>
            <p className="text-xl text-[#0B142F]/80 max-w-3xl mx-auto">
              Join our premier events designed to advance educational assessment practices worldwide
            </p>
          </motion.div>

          <div className="space-y-16">
            <RealConference/>
            <RealSeminar/>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-20 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B142F] mb-4">Who We Serve</h2>
            <p className="text-xl text-[#0B142F]/80 max-w-3xl mx-auto">
              We provide resources and training for all educational stakeholders
            </p>
          </motion.div>

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
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {[
              { icon: <FaUserGraduate size={40} />, title: "Students", description: "Enhancing learning outcomes" },
              { icon: <FaChalkboardTeacher size={40} />, title: "Teachers", description: "Improving assessment techniques" },
              { icon: <FaGraduationCap size={40} />, title: "Researchers", description: "Advancing assessment science" },
              { icon: <FaSchool size={40} />, title: "Institutions", description: "Implementing best practices" },
              { icon: <FaUsers size={40} />, title: "Government", description: "Informing policy decisions" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-[#F8F9FC] p-6 rounded-lg text-center hover:bg-[#E9EBF3] transition-colors"
              >
                <div className="text-[#D5B93C] mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0B142F] mb-2">{item.title}</h3>
                <p className="text-[#0B142F]/80">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage