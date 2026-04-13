'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaUsers, FaCalendarAlt, FaAward } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

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

interface HeroSectionProps {
  incomingEvents: Event[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ incomingEvents }) => {
  return (
    <section className="relative min-h-screen w-full bg-[#0B142F] overflow-hidden flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/people.jpg"
          alt="Audience background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B142F] via-[#0B142F]/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-14 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content - Constant */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium tracking-wide">
                2024 Annual Conference Coming Soon
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
                Advancing <br />
                Excellence in <br />
                <span className="text-blue-400">Professional Practice</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                Join a community of distinguished professionals dedicated to innovation, 
                collaboration, and continuous growth. Access world-class resources, 
                events, and networking opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all group"
              >
                Become a Member <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 bg-white text-[#0B142F] font-bold rounded-lg hover:bg-gray-100 transition-all"
              >
                About us
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/50">
                  <FaUsers />
                  <span className="text-xs uppercase tracking-wider font-bold">Members</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">2,500+</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/50">
                  <FaCalendarAlt />
                  <span className="text-xs uppercase tracking-wider font-bold">Annual Events</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/50">
                  <FaAward />
                  <span className="text-xs uppercase tracking-wider font-bold">Years of Excellence</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">15+</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Sliding Events */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-xl">Featured Event</h3>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#D5B93C]"></div>
                   <div className="w-2 h-2 rounded-full bg-white/20"></div>
                   <div className="w-2 h-2 rounded-full bg-white/20"></div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video mb-8">
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  className="h-full w-full"
                >
                  {incomingEvents.length > 0 ? (
                    incomingEvents.map((event) => (
                      <SwiperSlide key={event.id}>
                        <div className="relative h-full w-full group">
                          <Image
                            src={event.flyer || '/AboutTwo.jpg'}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h4 className="text-white text-xl md:text-2xl font-bold mb-2">{event.title}</h4>
                            <p className="text-white/80 text-sm line-clamp-2">{event.theme}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <div className="relative h-full w-full bg-white/5 flex items-center justify-center">
                        <p className="text-white/50 italic">No upcoming events scheduled</p>
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B142F] bg-[#D5B93C] flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#0B142F] bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold">
                    +99
                  </div>
                </div>
                <Link
                  href="/conference"
                  className="px-6 py-2 bg-white text-[#0B142F] font-bold rounded-lg hover:bg-gray-100 transition-all text-sm"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
