'use client'
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { landingEventHref } from './eventLinks'

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

const formatEventDate = (dateString: string) => {
  try {
    const [datePart] = dateString.split('To').map((part) => part.trim());
    const date = new Date(datePart);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const HeroSection: React.FC<HeroSectionProps> = ({ incomingEvents }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredEvent = incomingEvents[activeIndex] ?? incomingEvents[0];

  const promoLabel = useMemo(() => {
    if (!featuredEvent) {
      return 'Conferences and seminars from IAIIEA';
    }
    const kind = featuredEvent.type === 'seminar' ? 'Seminar' : 'Conference';
    return `${kind}: ${featuredEvent.title}`;
  }, [featuredEvent]);

  const learnMoreHref = featuredEvent
    ? landingEventHref(featuredEvent.id, featuredEvent.type)
    : '/conference';

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#0B142F] overflow-hidden flex items-center pt-20">
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
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 max-w-full"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0"></div>
              <span className="text-white/80 text-sm font-medium tracking-wide line-clamp-2">
                {promoLabel}
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10"
            >
              {[
                'Professional membership & networking',
                'Annual conferences & training seminars',
                'Innovation for Excellence since 2018',
              ].map((line) => (
                <p key={line} className="text-sm text-white/70 leading-relaxed">
                  {line}
                </p>
              ))}
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 gap-4">
                <h3 className="text-white font-bold text-xl">Featured programmes</h3>
                {incomingEvents.length > 0 && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60 shrink-0">
                    {incomingEvents.length} upcoming
                  </span>
                )}
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
                  onSlideChange={handleSlideChange}
                  className="h-full w-full"
                >
                  {incomingEvents.length > 0 ? (
                    incomingEvents.map((event) => (
                      <SwiperSlide key={event.id}>
                        <Link
                          href={landingEventHref(event.id, event.type)}
                          className="relative block h-full w-full group cursor-pointer"
                        >
                          <Image
                            src={event.flyer || '/AboutTwo.jpg'}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                            <p className="text-[#D5B93C] text-xs font-bold uppercase tracking-widest mb-2">
                              {event.type === 'seminar' ? 'Seminar' : 'Conference'}
                              {event.status ? ` · ${event.status}` : ''}
                            </p>
                            <h4 className="text-white text-xl md:text-2xl font-bold mb-2 group-hover:underline decoration-[#D5B93C] underline-offset-4">
                              {event.title}
                            </h4>
                            <p className="text-white/80 text-sm line-clamp-2">{event.theme}</p>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <div className="relative h-full w-full bg-white/5 flex items-center justify-center">
                        <p className="text-white/50 italic px-6 text-center">
                          No upcoming programmes scheduled right now.
                        </p>
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-white/70">
                  {featuredEvent ? (
                    <>
                      <span className="block font-medium text-white/90">{formatEventDate(featuredEvent.date)}</span>
                      <span className="line-clamp-1">{featuredEvent.venue}</span>
                    </>
                  ) : (
                    <span>Programme dates and venues appear here when events are published.</span>
                  )}
                </div>
                <Link
                  href={learnMoreHref}
                  className="px-6 py-2 bg-white text-[#0B142F] font-bold rounded-lg hover:bg-gray-100 transition-all text-sm text-center shrink-0"
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
