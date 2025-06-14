"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import DashboardIcon from '@/assets/sidebarIcons/DashboardIcon';
import BroadcastModal from "@/app/(admin)/admin-dashboard/dashboard/BroadcastModal";
import DailySchedule from "@/app/(admin)/admin-dashboard/dashboard/DailyShedule";
import Calendar from '@/app/(admin)/admin-dashboard/dashboard/calendar';
import DailyMeals from '@/app/(admin)/admin-dashboard/dashboard/DailyMeals';
import News from '@/app/(admin)/admin-dashboard/dashboard/News';
import Speakers from '@/app/(admin)/admin-dashboard/dashboard/speakers';
import ConferenceSchedule from "@/app/(admin)/admin-dashboard/dashboard/DailyShedule";
import Conferences from "@/app/(admin)/admin-dashboard/dashboard/conferences";
import Seminars from "@/app/(admin)/admin-dashboard/dashboard/seminars";
import { FiCalendar, FiClock, FiBook, FiSettings, FiUsers, FiMic, FiBookOpen } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState([
    { id: 1, name: 'Total Members', value: '0', icon: FiUsers, change: '+0%', changeType: 'positive' },
    { id: 2, name: 'Total Speakers', value: '0', icon: FiMic, change: '+0%', changeType: 'positive' },
    { id: 3, name: 'Total Conferences', value: '0', icon: FiCalendar, change: '+0%', changeType: 'positive' },
    { id: 4, name: 'Total Seminars', value: '0', icon: FiBookOpen, change: '+0%', changeType: 'positive' },
    { id: 5, name: 'Conference Participants', value: '0', icon: FiUsers, change: '+0%', changeType: 'positive' },
    { id: 6, name: 'Seminar Participants', value: '0', icon: FiUsers, change: '+0%', changeType: 'positive' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [speakersRes, membersRes, conferencesRes, seminarsRes, confParticipantsRes, seminarParticipantsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/speaker`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/conference_member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/seminar_member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          })
        ]);

        const [speakersData, membersData, conferencesData, seminarsData, confParticipantsData, seminarParticipantsData] = await Promise.all([
          speakersRes.json(),
          membersRes.json(),
          conferencesRes.json(),
          seminarsRes.json(),
          confParticipantsRes.json(),
          seminarParticipantsRes.json()
        ]);

        // Update stats with actual counts
        setStats([
          { 
            id: 1, 
            name: 'Total Members', 
            value: membersData.data?.length.toString() || '0', 
            icon: FiUsers, 
            change: '+0%', 
            changeType: 'positive' 
          },
          { 
            id: 2, 
            name: 'Total Speakers', 
            value: speakersData.data?.length.toString() || '0', 
            icon: FiMic, 
            change: '+0%', 
            changeType: 'positive' 
          },
          { 
            id: 3, 
            name: 'Total Conferences', 
            value: conferencesData.data?.length.toString() || '0', 
            icon: FiCalendar, 
            change: '+0%', 
            changeType: 'positive' 
          },
          { 
            id: 4, 
            name: 'Total Seminars', 
            value: seminarsData.data?.length.toString() || '0', 
            icon: FiBookOpen, 
            change: '+0%', 
            changeType: 'positive' 
          },
          { 
            id: 5, 
            name: 'Conference Participants', 
            value: confParticipantsData.data?.length.toString() || '0', 
            icon: FiUsers, 
            change: '+0%', 
            changeType: 'positive' 
          },
          { 
            id: 6, 
            name: 'Seminar Participants', 
            value: seminarParticipantsData.data?.length.toString() || '0', 
            icon: FiUsers, 
            change: '+0%', 
            changeType: 'positive' 
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchData();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0E1A3D] rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A3D] to-[#203A87] opacity-90"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <DashboardIcon className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-sm md:text-base text-gray-300 mt-2">
            Welcome back, {session?.user?.userData?.name || 'Admin'} 👋
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 -mt-4 sm:-mt-8 md:-mt-12 relative z-20"
      >
        {stats.slice(0, 4).map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
                  {loading ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-[#0E1A3D]" />
              </div>
            </div>
            <div className="mt-3 md:mt-4">
              <p className={`text-xs md:text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Stats Cards for Participants */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 relative z-20"
      >
        {stats.slice(4, 6).map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
                  {loading ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-[#0E1A3D]" />
              </div>
            </div>
            <div className="mt-3 md:mt-4">
              <p className={`text-xs md:text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="space-y-4 md:space-y-6">
        {/* Conferences and Seminars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Conferences</h2>
                <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                  <FiCalendar className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0E1A3D]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Conferences />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Seminars</h2>
                <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                  <FiBookOpen className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0E1A3D]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Seminars />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Calendar and Speakers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Calendar</h2>
                <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                  <FiCalendar className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0E1A3D]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Calendar />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Speakers</h2>
                <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                  <FiMic className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0E1A3D]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Speakers />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Conference Schedule and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Conference Schedule</h2>
                <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                  <FiClock className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0E1A3D]" />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[400px] md:max-h-[500px] lg:max-h-[600px]">
                <ConferenceSchedule />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">News Management</h2>
                <div className="p-2 md:p-3 rounded-lg bg-[#0E1A3D]/10">
                  <FiBook className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-[#0E1A3D]" />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[400px] md:max-h-[500px] lg:max-h-[600px]">
                <News />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Broadcast Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md"
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Broadcast Message</h2>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  Send a message to all users, members, and speakers
                </p>
              </div>
              <div>
                <BroadcastModal />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 