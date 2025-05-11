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
    <div className="min-h-screen bg-gray-50 px-2 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0E1A3D] rounded-xl shadow-lg p-6 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A3D] to-[#203A87] opacity-90"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <DashboardIcon />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-300 mt-2">
            Welcome back, {session?.user?.userData?.name || 'Admin'} 👋
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-4 sm:-mt-12 relative z-20"
      >
        {stats.slice(0, 4).map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0E1A3D]/10">
                <stat.icon className="h-6 w-6 text-[#0E1A3D]" />
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-xs font-medium ${
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8 relative z-20"
      >
        {stats.slice(4, 6).map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0E1A3D]/10">
                <stat.icon className="h-6 w-6 text-[#0E1A3D]" />
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* Conferences and Seminars */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-md overflow-y-scroll py-5 max-h-[250px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Conferences</h2>
                <div className="p-2 rounded-lg bg-[#0E1A3D]/10">
                  <FiCalendar className="h-5 w-5 text-[#0E1A3D]" />
                </div>
              </div>
              <Conferences />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-y-scroll max-h-[250px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Seminars</h2>
                <div className="p-2 rounded-lg bg-[#0E1A3D]/10">
                  <FiBookOpen className="h-5 w-5 text-[#0E1A3D]" />
                </div>
              </div>
              <Seminars />
            </div>
          </div>
        </motion.div>

        {/* Calendar and Speakers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-md overflow-y-scroll max-h-[250px] ">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
                <div className="p-2 rounded-lg bg-[#0E1A3D]/10">
                  <FiCalendar className="h-5 w-5 text-[#0E1A3D]" />
                </div>
              </div>
              <Calendar />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-y-scroll max-h-[250px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Speakers</h2>
                <div className="p-2 rounded-lg bg-[#0E1A3D]/10">
                  <FiMic className="h-5 w-5 text-[#0E1A3D]" />
                </div>
              </div>
              <Speakers />
            </div>
          </div>
        </motion.div>

        {/* Additional Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-md overflow-y-scroll max-h-[250px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Daily Schedule</h2>
                <div className="p-2 rounded-lg bg-[#0E1A3D]/10">
                  <FiClock className="h-5 w-5 text-[#0E1A3D]" />
                </div>
              </div>
              <ConferenceSchedule />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-y-scroll max-h-[250px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">News Management</h2>
                <div className="p-2 rounded-lg bg-[#0E1A3D]/10">
                  <FiBook className="h-5 w-5 text-[#0E1A3D]" />
                </div>
              </div>
              <News />
            </div>
          </div>
        </motion.div>

        {/* Broadcast Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Broadcast Message</h2>
                <p className="text-gray-500 mt-1">
                  Send a message to all users, members, and speakers
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <BroadcastModal />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}