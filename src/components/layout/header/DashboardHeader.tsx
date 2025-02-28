'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/assets/auth/images/IAIIEA Logo I.png';
import { Menu, Search, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';

type DashboardHeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isSidebarOpen, 
  toggleSidebar 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    }
  });
  const router = useRouter();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle logout with NextAuth
  const handleLogout = async () => {
    await signOut({ 
      redirect: true, 
      callbackUrl: '/login' 
    });
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // If no session, return null or a loading state
  if (!session?.user) return null;

  return (
    <>
      {/* Header */}
      <div className="fixed w-full bg-[#0E1A3D] z-40 py-3">
        <div className="max-w-[1440px] lg:max-w-full mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between px-auto md:px-14">
            {/* Mobile Menu Button */}
            <button 
              className="p-2 text-white rounded-md flex md:hidden hover:bg-[#1A2C5B] transition-colors"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="block w-[100px] md:w-[130px] ml-2">
              <Image src={Logo} alt="Logo" priority className="w-full h-auto" />
            </Link>

            {/* Desktop Search */}
            {/* <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <input 
                type="search" 
                placeholder="Search for movies, music, shows" 
                className="w-full bg-white rounded-3xl px-10 py-3 outline-none"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-3" />
            </div> */}

            {/* Profile Dropdown */}
            <div className="relative">
              <div onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage
                      src={session.user?.image || '/default-avatar.png'}
                      alt={session.user?.name || 'User'}
                    />
                    <AvatarFallback className="bg-yellow-200 uppercase text-[#0E1A3D] font-bold">
                      {session.user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-white">
                    {session.user?.name}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50"
                  >
                    <Link href="/members-dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings size={18} className="inline-block mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    >
                      <LogOut size={18} className="inline-block mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
};

export default DashboardHeader;