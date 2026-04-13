'use client'
import React from 'react'
import "@/app/index.css"
import { motion } from 'framer-motion'
import { FaArrowLeft, FaHistory, FaBullseye, FaBook, FaGlobe, FaCertificate } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

const HistoryPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-[#F9FBFF] min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative py-24 bg-[#0B142F] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D5B93C] rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-14 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center text-white/70 hover:text-[#D5B93C] transition-all font-bold group">
              <FaArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-400 text-xs font-black uppercase tracking-widest">
                Our Story
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                The Legacy of <span className="text-[#D5B93C]">IAIIEA</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed max-w-2xl">
                Tracing our journey from a vision for innovation in 2018 to becoming a global authority in educational assessment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 md:px-8 lg:px-14 -mt-16 relative z-20">
        
        {/* Origin Story Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-gray-100 mb-16 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-full -z-10 -mr-20 -mt-20"></div>
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              
              <h2 className="text-3xl md:text-4xl font-black text-[#0B142F] tracking-tight">How it all began</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                The IAIIEA as it is fondly called is an international Association established based on the quest for innovations in educational assessment. On the <span className="text-[#0B142F] font-bold">9th of October, 2018</span>, was the day it was birthed at the registration ground of the Corporate Affairs Commission (CAC) Abuja, Nigeria under the auspices of the Federal Republic of Nigeria. 
         
              </p>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                  <Image src="/AboutOne.jpg" width={600} height={400} alt="Foundation" className="w-full h-auto object-cover" />
               </div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D5B93C] rounded-3xl -z-10"></div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Goals Card */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1 bg-[#0B142F] rounded-[2.5rem] p-10 text-white flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
 Our Mandate
              </h3>
              <ul className="space-y-6">
                {['Human capacity building', 'Assessment innovations at all levels', 'National and international cohesion'].map((goal, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#D5B93C] font-bold group-hover:bg-[#D5B93C] group-hover:text-[#0B142F] transition-all">
                      {i + 1}
                    </span>
                    <span className="text-lg text-white/80">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 italic text-white/40 text-sm">
              Achieved through conferences, workshops, and publications.
            </div>
          </motion.div>

          {/* Research Highlight Card */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="md:w-1/3">
              <div className="relative group">
                <Image src="/book.png" width={300} height={400} alt="Key Publication" className="rounded-xl shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500" />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl font-black">
                  2018
                </div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-6">
              <h3 className="text-2xl font-bold text-[#0B142F]">The Adorable & Matchless Book</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                Prior to our inauguration, a foundational text, <span className="text-[#0B142F] font-bold">"Innovations in Educational Assessment,"</span> was written in honor of Professor Emeritus Rt. Rev. Prof. Jonathan-Ibeagha. 
                Edited by pioneer president Dr. Ariyo, this book encapsulated 19 scholarly articles by 24 brilliant researchers who defied all odds.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600">24</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Researchers</div>
                </div>
                <div className="w-px h-10 bg-gray-100"></div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600">19</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Articles</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <section className="py-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-[#0B142F] mb-4">Evolution of Themes</h2>
            <div className="w-24 h-1.5 bg-[#D5B93C] mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { year: '2018', title: 'Maiden Edition', theme: 'Trends in Educational Assessment', color: 'bg-blue-600' },
              { year: '2019', title: '2nd Conference', theme: 'Technological Innovations in Educational Assessment', color: 'bg-indigo-600' },
              { year: '2020', title: '3rd Conference', theme: 'Redesigning Educational Assessment for the 21st Century', color: 'bg-[#D5B93C]' },
              { year: '2021', title: '4th Conference', theme: 'Assessment for the New Normal Times', color: 'bg-emerald-600' },
            ].map((event, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className={`${event.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-xl`}>
                  {event.year}
                </div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{event.title}</h4>
                <p className="text-lg font-bold text-[#0B142F] leading-tight group-hover:text-blue-600 transition-colors">
                  {event.theme}
                </p>
                <div className="mt-auto pt-8 flex justify-end">
                   <FaArrowLeft className="rotate-180 text-gray-200 group-hover:text-blue-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Resilient Growth - The Pandemic Era */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
          <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">Global Resilience</div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Undaunted by the stormy seas.</h2>
              <p className="text-xl text-white/70 leading-relaxed font-medium">
                In 2020, the global COVID-19 pandemic could not hinder our mission. We pivoted to virtual brainstorming sessions transmitted live from Nigeria. 
                Researchers from across Africa and beyond joined a 5-day remarkable session, proving our association's strength and adaptability.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
              {[
                { label: 'Academic Journals', count: '6+' },
                { label: 'Academic Books', count: '2+' },
                { label: 'Nations Represented', count: '10+' },
                { label: 'Conference Experts', count: '60+' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition-all text-center">
                  <div className="text-3xl md:text-4xl font-black text-[#D5B93C] mb-1">{stat.count}</div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default HistoryPage;
