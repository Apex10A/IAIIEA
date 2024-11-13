'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@/assets/auth/images/IAIIEA Logo I.png';
import { Menu, Search, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';

interface User {
  f_name?: string;
  l_name?: string;
  image_url?: string;
  email?: string;
  role?: 'admin' | 'user';
}

const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulating fetching user data from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login'); // Redirect to login if no user data
    }
  }, [router]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <>
      {/* Header */}
      <div className="fixed w-full bg-[#0E1A3D] z-40 py-3">
        <div className="max-w-[1440px] lg:max-w-full mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between  px-auto md:px-14">
            {/* Logo */}
            <Link href="/" className="block w-[120px] md:w-[160px]">
              <Image src={Logo} alt="Logo" priority className="w-full h-auto" />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <input 
                type="search" 
                placeholder="Search for movies, music, shows" 
                className="w-full bg-white rounded-3xl px-10 py-3 outline-none"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-3" />
            </div>

            {/* Mobile Menu Button */}
           <div className='flex gap-5'>
           <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={toggleDropdown}
                className="flex items-center gap-2 cursor-pointer"
              >
                {user && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage
                        src={user.image_url || '/default-avatar.png'}
                        alt={user.f_name || 'User'}
                      />
                      <AvatarFallback className="bg-yellow-200 uppercase text-[#0E1A3D] font-bold">
                        {user.f_name?.charAt(0) || user.email?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-white">
                      {user.f_name} {user.l_name}
                    </span>
                  </div>
                )}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                  <Link href="/members-dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={18} className="inline-block mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user_data');
                      router.push('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    <LogOut size={18} className="inline-block mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
           </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0E1A3D] border-t border-gray-700">
            <div className="px-4 py-3">
              <Link href="/dashboard/settings" className="flex items-center gap-2 text-white w-full py-2">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('user_data');
                  router.push('/login');
                }}
                className="flex items-center gap-2 text-red-400 w-full py-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default DashboardHeader;
