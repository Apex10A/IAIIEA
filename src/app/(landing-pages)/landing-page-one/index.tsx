'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaSchool, FaUsers, FaArrowRight, FaBookOpen, FaCalendar } from 'react-icons/fa';
import RealConference from "@/modules/ui/RealConference";
import RealSeminar from "@/modules/ui/RealSeminar";
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
        console.error("Error fetching events:", error);
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

      <section className="relative h-screen w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          className="h-full w-full [&_.swiper-button-next]:!text-white [&_.swiper-button-prev]:!text-white [&_.swiper-pagination]:!bottom-12"
        >
          {incomingEvents.map((event) => (
            <SwiperSlide key={event.id} className="h-full w-full">
              <div className="relative h-full w-full">
                <Image
                  src={event.flyer || (event.type === 'conference' ? '/DSA.JPG' : '/DSA2.JPG')}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-6 md:space-y-8"
                      >
                        <div className="flex items-center justify-center gap-4">
                          <span className="inline-block px-4 py-2 bg-[#D5B93C] text-white text-sm md:text-base font-semibold rounded-full shadow-lg">
                            {event.status}
                          </span>
                          <span className="inline-block px-4 py-2 bg-[#0B142F] text-white text-sm md:text-base font-semibold rounded-full shadow-lg">
                            {event.type === 'conference' ? 'Conference' : 'Seminar'}
                          </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                          {event.title}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
                          {event.theme}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90">
                          <div className="flex items-center gap-3">
                            <FaUsers className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="font-medium text-base md:text-lg">{event.venue}</span>
                          </div>
                          <div className="hidden sm:block text-2xl text-white/50">•</div>
                          <div className="flex items-center gap-3">
                            <FaCalendar className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="font-medium text-base md:text-lg">{event.date}</span>
                          </div>
                        </div>
                        <div className="pt-8 relative z-50">
                          <Link
                            // href={`/${event.type === 'conference' ? 'conference' : 'seminar'}/${event.id}`}
                            href={'/register'}
                            className="relative inline-flex items-center md:mr-4 px-6 md:px-8 py-3 md:py-4 bg-[#D5B93C] text-white text-lg font-semibold rounded-lg hover:bg-[#C4A93C] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                          >
                           How to Join <FaArrowRight className="ml-3 w-5 h-5" />
                          </Link>
                          <Link
                            // href={`/${event.type === 'conference' ? 'conference' : 'seminar'}/${event.id}`}
                            href={'/about'}
                            className="relative inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-transparent border border-[#D5B93C] text-white text-lg font-semibold rounded-lg hover:bg-[#C4A93C] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                          >
                           About IAIIEA <FaArrowRight className="ml-3 w-5 h-5" />
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-40">
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </section>

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

          <div className="space-y-12">
            <div>
              <div className="flex justify-between items-center mb-8">
                {/* <h3 className="text-2xl font-bold text-[#0B142F]">Conferences</h3> */}
                {/* <Link 
                  href="/conferences"
                  className="inline-flex items-center px-4 py-2 bg-[#D5B93C] text-white font-medium rounded-lg hover:bg-[#C4A93C] transition-colors"
                >
                  See All Conferences <FaArrowRight className="ml-2 w-4 h-4" />
                </Link> */}
              </div>
              <RealConference />
            </div>

            <div>
              <div className="flex justify-between items-center mb-8">
                {/* <h3 className="text-2xl font-bold text-[#0B142F]">Seminars</h3> */}
                {/* <Link 
                  href="/seminars"
                  className="inline-flex items-center px-4 py-2 bg-[#D5B93C] text-white font-medium rounded-lg hover:bg-[#C4A93C] transition-colors"
                >
                  See All Seminars <FaArrowRight className="ml-2 w-4 h-4" />
                </Link> */}
              </div>
              <RealSeminar />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
