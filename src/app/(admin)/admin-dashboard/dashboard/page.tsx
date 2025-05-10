"use client";

import { useState } from "react";
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
import { FiCalendar, FiClock, FiBook, FiSettings,  FiUsers, FiMic, FiBookOpen } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  
  // Stats data
  const stats = [
    { id: 1, name: 'Total Members', value: '49', icon: FiUsers, change: '+4.5%', changeType: 'positive' },
    { id: 2, name: 'Total Speakers', value: '19', icon: FiMic, change: '+2.1%', changeType: 'positive' },
    { id: 3, name: 'Total Conferences', value: '11', icon: FiCalendar, change: '+1.2%', changeType: 'positive' },
    { id: 4, name: 'Total Seminars', value: '7', icon: FiBookOpen, change: '+0.8%', changeType: 'positive' },
  ];

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
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
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

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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