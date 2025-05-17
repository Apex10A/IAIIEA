'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/assets/auth/images/IAIIEA Logo I.png';
import { Menu, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';

type DashboardHeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  showMobileMenuButton?: boolean; // New prop to control mobile menu button visibility
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isSidebarOpen, 
  toggleSidebar,
  showMobileMenuButton = true // Default to true for backward compatibility
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    }
  });
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

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
        duration: 0.15
      }
    }
  };

  // If no session, return null or a loading state
  if (!session?.user) return null;

  return (
    <>
      {/* Header */}
      <header className={`
        fixed w-full z-50 transition-all duration-300
        ${isScrolled ? 'bg-[#0E1A3D]/95 backdrop-blur-sm py-2 shadow-lg' : 'bg-[#0E1A3D] py-3'}
      `}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Menu button and Logo */}
            <div className="flex items-center">
              {/* Mobile Menu Button - Only shown when showMobileMenuButton is true */}
              {showMobileMenuButton && (
                <button 
                  className="p-2 text-white rounded-md md:hidden hover:bg-[#1A2C5B]/50 transition-colors"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                  <Menu size={24} />
                </button>
              )}

              {/* Logo */}
              <Link 
                href="/" 
                className={`${showMobileMenuButton ? 'ml-2' : 'ml-0'} md:ml-0 flex-shrink-0`}
                onClick={closeDropdown}
              >
                <Image 
                  src={Logo} 
                  alt="Logo" 
                  priority 
                  className="w-[100px] md:w-[130px] h-auto"
                  width={130}
                  height={40}
                />
              </Link>
            </div>

            {/* Right section - Profile dropdown */}
            <div className="relative ml-4 flex items-center">
              <div 
                onClick={toggleDropdown}
                className={`
                  flex items-center gap-2 cursor-pointer p-1 rounded-full
                  ${isDropdownOpen ? 'bg-[#1A2C5B]' : 'hover:bg-[#1A2C5B]/50'}
                  transition-colors duration-200
                `}
              >
                <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-white/20">
                  <AvatarImage
                    src={session.user?.image || '/default-avatar.png'}
                    alt={session.user?.name || 'User'}
                  />
                  <AvatarFallback className="bg-yellow-200 uppercase text-[#0E1A3D] font-bold">
                    {session.user?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex items-center">
                  <span className="text-white text-sm font-medium mr-1">
                    {session.user?.name}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Clickaway backdrop */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={closeDropdown}
                    />
                    
                    {/* Dropdown menu */}
                    <motion.div 
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`
                        absolute right-0 top-10 mt-2 w-56 bg-white rounded-lg shadow-xl
                        overflow-hidden z-50 border border-gray-100
                      `}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      
                      <Link 
                        href="/members-dashboard/settings" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={closeDropdown}
                      >
                        <Settings size={16} className="mr-3 text-gray-500" />
                        Account Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-3 text-red-500" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer - Adjust height based on scroll state */}
      <div className={`h-16 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`} />
    </>
  );
};

export default DashboardHeader;