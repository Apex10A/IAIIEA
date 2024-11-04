"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/auth/images/IAIIEA Logo I.png';
import SearchIcon from '../../../assets/landingpage/svg/VectorFour';
// import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';
import { Settings, LogOut, Menu, Search } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// interface User {
//   f_name?: string;
//   l_name?: string;
//   image_url?: string;
//   email?: string;
//   role?: 'admin' | 'user';
// }
// { user }: { user: User }
const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="fixed w-full bg-[#0E1A3D] z-40 py-3">
        {/* Main Header Content */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block w-[120px] md:w-auto">
                <Image src={Logo} alt="Logo" priority className="w-full h-auto" />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-3">
                <SearchIcon />
              </div>
              <input 
                type="search" 
                placeholder="Search for movies, music, shows" 
                className="w-full bg-white rounded-3xl px-10 py-3 outline-none"
              />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>

            {/* Profile Dropdown */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage
                      src={user?.image_url}
                      alt={user?.f_name || 'User'}
                    />
                    <AvatarFallback className="bg-yellow-200 uppercase text-[#0E1A3D] font-bold">
                      {user?.f_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user?.f_name} {user?.l_name}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="p-0">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user?.image_url}
                          alt={user?.f_name || 'User'}
                        />
                        <AvatarFallback className="bg-yellow-200 py-2 px-2 uppercase text-[#0E1A3D] font-bold">
                          <p className='text-2xl'>{user?.f_name?.charAt(0) || user?.email?.charAt(0) || '?'}</p>
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {user?.f_name} {user?.l_name}
                        </h4>
                        <span className="text-sm text-gray-500 capitalize">
                          {user?.role || 'user'}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    href="/members-dashboard/settings" 
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = '/api/auth/signout';
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>

          {/* Mobile Search - Only visible when search is toggled */}
          {isSearchVisible && (
            <div className="md:hidden mt-4 px-2">
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3">
                  <SearchIcon />
                </div>
                <input 
                  type="search" 
                  placeholder="Search for movies, music, shows" 
                  className="w-full bg-white rounded-3xl px-10 py-2.5 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0E1A3D] border-t border-gray-700">
            <div className="px-4 py-3">
              <button 
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="flex items-center gap-2 text-white w-full py-2"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
              <Link 
                href="/dashboard/settings"
                className="flex items-center gap-2 text-white w-full py-2"
              >
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <button 
                onClick={() => {
                  window.location.href = '/api/auth/signout';
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

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default DashboardHeader;