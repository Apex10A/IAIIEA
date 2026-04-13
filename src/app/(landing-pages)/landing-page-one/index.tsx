'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaSchool, FaUsers, FaArrowRight, FaBookOpen, FaCalendar } from 'react-icons/fa';
import RealConference from "@/modules/ui/RealConference";
import RealSeminar from "@/modules/ui/RealSeminar";
import HeroSection from './HeroSection';
import EventsSection from './EventsSection';
import Sponsors from './sponsors'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface Event {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  flyer: string;
  type?: 'conference' | 'seminar';
}

interface EventDetails {
  id: number;
  is_registered: boolean;
  gallery: string[];
  speakers: Array<{
    name: string;
    title?: string;
    portfolio?: string;
    picture?: string;
  }>;
}

const journeyMilestones = [
  {
    year: '2018',
    title: 'Maiden edition of the association’s annual conference',
    description: 'Theme: "Trends in Educational Assessment"',
    image: '/AboutOne.jpg',
  },
  {
    year: '2019',
    title: 'First international conference held',
    description: 'Created a platform for dialogue on innovations in assessment.',
    image: '/AboutTwo.jpg',
  },
  {
    year: '2020',
    title: 'Introduction of webinar and virtual participation at conferences',
    description: 'Theme: "Redesigning Educational Assessment for the 21st Century"',
    image: '/2020/2020Pic.png',
  },
  {
    year: '2021',
    title: 'Introduced both virtual and onsite participation at the annual conference',
    description: 'Theme: "Assessment for the New Normal Times"',
    image: '/2021.png',
  },
  {
    year: '2022',
    title: 'Expanded reach beyond Africa to Asia and other continents',
    description: 'Strengthened global collaborations and partnerships.',
    image: '/2022.png',
  },
  {
    year: '2023',
    title: 'Launched the book on Big Data at Anchor University, Lagos',
    description: 'Organised a teachers’ conference to share insights and best practices.',
    image: '/2023.png',
  },
  {
    year: '2024',
    title: 'Collaborated with UBEC for the annual conference',
    description: 'Theme: "Transforming Learning and Assessment Through Application of Big Data and Artificial Intelligence"',
    image: '/2024.png',
  },
  {
    year: '2025',
    title: 'Organised workshops in three geopolitical zones of Nigeria',
    description: 'Annual conference theme: "Assessment in the Age of Artificial Intelligence"',
    image: '/Meeting.png',
  },
];

const impactHighlights = [
  'Provided professional development opportunities for educators and innovators',
  'Fostered collaboration between academia, industry, and policy makers',
  'Inspired a new generation of researchers and students to embrace innovation in education',
];

const LandingPage: React.FC = () => {
  const [conferences, setConferences] = useState<Event[]>([]);
  const [seminars, setSeminars] = useState<Event[]>([]);
  const [incomingEvents, setIncomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const confResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
        const confData = await confResponse.json();
        let incomingConferences: Event[] = [];
        if (confData.status === "success") {
          incomingConferences = confData.data
            .filter((conf: Event) => conf.status === "Incoming")
            .map((conf: Event) => ({ ...conf, type: 'conference' }));
        }
        const semResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
        const semData = await semResponse.json();
        let incomingSeminars: Event[] = [];
        if (semData.status === "success") {
          incomingSeminars = semData.data
            .filter((sem: Event) => sem.status === "Incoming")
            .map((sem: Event) => ({ ...sem, type: 'seminar' }));
        }
        setIncomingEvents([...incomingConferences, ...incomingSeminars]);
      } catch (error) {
        // console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const publications = [
    {
      id: 1,
      title: "JOURNAL OF INNOVATIONS IN EDUCATIONAL ASSESSMENT (JIEA)",
      volume: "VOL.1, NO.1, May, 2019",
      image: "/book.png",
      link: "https://journal.iaiiea.org/jiea/login?source=%2Fjiea%2Fissue%2Fview%2F1"
    }
  ];

  return (
    <div className="bg-white">
      <HeroSection incomingEvents={incomingEvents} />

      {/* About IAIIEA - Experience & Journey */}
      <section className="py-24 px-4 md:px-8 lg:px-14 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              className="lg:w-1/2 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                Established 2018
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B142F] mb-8 leading-[1.1]">
                Leading Global <span className="text-blue-600 underline decoration-[#D5B93C] decoration-2 underline-offset-4">Innovations</span> in Assessment
              </h2>
 
              <div className="space-y-6 mb-10 text-gray-600 text-lg leading-relaxed">
                <p>
                  The International Association for Innovations in Educational Assessment (IAIIEA) was registered with the Federal Republic of Nigeria via the CAC Abuja on 9th October, 2018.
                </p>
                <p>
                  We came into the limelight on 24th November, 2018, hosting our maiden conference at the Public Service Institute of Nigeria, marking the beginning of a new era in academic excellence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100 group">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <FaSchool size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B142F] mb-1">Global Standard</h4>
                    <p className="text-sm">Developing assessment innovations at all educational levels.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100 group">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#D5B93C] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <FaUsers size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B142F] mb-1">Cohesion</h4>
                    <p className="text-sm">Promoting international unity through educational assessment.</p>
                  </div>
                </div>
              </div>

              <Link href="/about" className="inline-flex items-center px-8 py-4 bg-[#0B142F] text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                Full Story <FaArrowRight className="ml-3" />
              </Link>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.15)]">
                <Image 
                  src='/AboutOne.jpg'
                  alt='IAIIEA Team Members'
                  width={800}
                  height={900}
                  className="w-full h-auto object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B142F] via-transparent to-transparent opacity-60"></div>
              </div>
              
              {/* Floating Experience Badge */}
              <div className="absolute -bottom-10 -left-10 z-20 bg-[#D5B93C] p-8 rounded-[2rem] shadow-2xl hidden md:block animate-bounce-slow">
                <div className="text-center text-[#0B142F]">
                  <div className="text-5xl font-black mb-1">7+</div>
                  <div className="text-sm font-bold uppercase tracking-widest">Years of<br/>Excellence</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-dashed border-gray-200 rounded-[3rem] translate-x-6 translate-y-6 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Motto - Core Values */}
      <section className="py-24 bg-[#0B142F] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 skew-x-12 transform origin-top"></div>
        <div className="container mx-auto px-4 md:px-8 lg:px-14 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              { 
                icon: <FaGraduationCap size={44} />, 
                title: "Our Mission", 
                desc: "To advance innovative systems that enhance quality assessment, fostering intellectual competence and global value.",
                color: "bg-blue-600"
              },
              { 
                icon: <FaUsers size={44} />, 
                title: "Our Vision", 
                desc: "To be the premier, world-class pace-setter for innovative educational assessment across all academic frontiers.",
                color: "bg-[#D5B93C]"
              },
              { 
                icon: <FaChalkboardTeacher size={44} />, 
                title: "Our Motto", 
                desc: "Innovation for Excellence — the core driving force behind every initiative we undertake since our inception.",
                color: "bg-emerald-500"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                className="group relative bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-4"
              >
                <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center text-white mb-8 shadow-2xl transform group-hover:rotate-12 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-white/60 text-lg leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-8 w-12 h-1.5 rounded-full bg-white/10 group-hover:w-full group-hover:bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-4 md:px-8 lg:px-14 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FC] via-white to-[#F8F9FC] z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] z-0 pointer-events-none" 
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        
        {/* Animated Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D5B93C]/10 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700 z-0"></div>

        <div className="container mx-auto relative z-10 space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center space-y-4 mb-20"
          >
            <div className="inline-block px-4 py-1.5 bg-[#D5B93C]/10 text-[#D5B93C] rounded-full text-sm font-bold uppercase tracking-widest mb-2">
              Our Legacy
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#0B142F] tracking-tight">
              Key <span className="text-[#D5B93C]">Milestones</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A timeline of our commitment to transforming educational assessment and fostering global excellence since 2018.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line - Desktop Only */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#D5B93C]/20 via-[#D5B93C] to-[#D5B93C]/20 hidden lg:block rounded-full"></div>
            
            <div className="space-y-20 lg:space-y-32">
              {journeyMilestones.map((milestone, index) => (
                <div key={milestone?.year} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 ${
                      index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content Card */}
                    <div className="w-full lg:w-[46%]">
                      <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#D5B93C]/40 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D5B93C]/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-[#D5B93C]/10 transition-colors"></div>
                        
                        <div className="flex items-center gap-5 mb-8">
                          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D5B93C] to-[#C4A93C] text-white shadow-lg shadow-[#D5B93C]/30 transform group-hover:rotate-6 transition-transform">
                            <FaCalendar size={28} />
                          </div>
                          <span className="text-4xl md:text-5xl font-black text-[#0B142F] tracking-tighter">
                            {milestone?.year}
                          </span>
                        </div>
                        <h4 className="text-2xl md:text-3xl font-extrabold text-[#0B142F] mb-5 leading-tight group-hover:text-[#D5B93C] transition-colors">
                          {milestone?.title}
                        </h4>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                          {milestone?.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Center Dot - Desktop Only */}
                    <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-white border-4 border-[#D5B93C] z-10 items-center justify-center shadow-[0_0_30px_rgba(213,185,60,0.4)] group">
                      <div className="w-4 h-4 rounded-full bg-[#D5B93C] group-hover:scale-150 transition-transform"></div>
                    </div>

                    {/* Image Column */}
                    <div className="w-full lg:w-[46%]">
                      <div className="relative h-72 md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer">
                        <Image
                          src={milestone?.image}
                          alt={`${milestone?.year} milestone`}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B142F] via-[#0B142F]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                        <div className="absolute bottom-10 left-10 right-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                           <div className="text-sm font-black text-[#D5B93C] mb-2 uppercase tracking-[0.2em]">Legacy {milestone?.year}</div>
                           <div className="text-2xl md:text-3xl font-bold leading-tight">{milestone?.title}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-[#F8F9FC] rounded-2xl p-10"
          >
            <h3 className="text-2xl font-bold text-[#0B142F] mb-4">Our Impact</h3>
            <p className="text-base text-[#0B142F]/80">Over the years, we have:</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {impactHighlights.map((impact) => (
                <div key={impact} className="bg-white rounded-xl shadow-md p-6 h-full flex">
                  <p className="text-base text-[#0B142F]/80">{impact}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-24 px-4 md:px-8 lg:px-14 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <div className="text-[#D5B93C] font-bold uppercase tracking-[0.3em] text-sm mb-4">Academic Excellence</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0B142F] tracking-tight">Our <span className="text-blue-600">Publications</span></h2>
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                Explore our peer-reviewed journals and contributions to the global discourse on educational assessment and innovation.
              </p>
            </div>
            <Link href="https://journal.iaiiea.org" target="_blank" className="inline-flex items-center text-blue-600 font-bold group">
              View All Journals <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {publications.map((pub) => (
              <motion.div
                key={pub?.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="group bg-gray-50 rounded-[2.5rem] overflow-hidden hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 border border-transparent hover:border-blue-100"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={pub?.image}
                    alt={pub?.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#0B142F]/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-[#0B142F] shadow-xl">
                      NEW ISSUE
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                      <FaBookOpen size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scientific Journal</span>
                  </div>
                  <h4 className="text-xl font-bold text-[#0B142F] mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {pub?.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-8 font-medium italic">{pub?.volume}</p>
                  <Link 
                    href={pub.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 bg-white border-2 border-gray-100 text-[#0B142F] font-bold rounded-2xl group-hover:bg-[#0B142F] group-hover:text-white group-hover:border-[#0B142F] transition-all duration-300 shadow-sm"
                  >
                    Read Journal <FaArrowRight className="ml-2 text-blue-500 group-hover:text-white" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <EventsSection events={incomingEvents} />
    </div>
  )
}

export default LandingPage
