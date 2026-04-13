'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'

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

interface EventsSectionProps {
  events: Event[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const formatDate = (dateString: string) => {
    try {
      const [datePart] = dateString.split('To').map(part => part.trim());
      const date = new Date(datePart);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-14 bg-[#F9FBFF]">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h4 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm">Upcoming Events</h4>
            <h2 className="text-4xl md:text-5xl font-black text-[#0B142F]">Don't Miss Our Events</h2>
          </div>
          <Link 
            href="/programmes" 
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-[#0B142F] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm group"
          >
            View All Events <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.slice(0, 3).map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full">
                  <Image
                    src={event.flyer || '/AboutTwo.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${
                      event.type === 'conference' 
                        ? 'bg-blue-600/90 text-white' 
                        : 'bg-emerald-500/90 text-white'
                    }`}>
                      {event.type}
                    </span>
                    {event.venue.toLowerCase().includes('virtual') && (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-600/90 text-white backdrop-blur-md">
                        Virtual
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      <span>10:00</span> {/* Mock time if not available */}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B142F] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {event.title}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-500 text-sm mb-6">
                    <FaMapMarkerAlt className="mt-1 text-blue-500 shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block mb-1">From</span>
                      <span className="text-xl font-black text-[#0B142F]">
                        {event.type === 'conference' ? '₦50,000' : '₦15,000'}
                      </span>
                    </div>
                    <Link 
                      href={event.type === 'conference' ? `/conference?id=${event.id}` : `/seminars/${event.id}`}
                      className="inline-flex items-center text-blue-600 font-bold text-sm group/link"
                    >
                      Learn More <FaArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic">No upcoming events found at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default EventsSection
