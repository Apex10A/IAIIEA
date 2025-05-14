"use client";
import React, { useState, useEffect, useRef } from "react";
import Logo from "@/assets/auth/images/IAIIEA Logo I.png";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiChevronUp, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import "../../../app/globals.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsUserMenuOpen(false);
  };

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target as Node) &&
      userMenuRef.current && 
      !userMenuRef.current.contains(event.target as Node)
    ) {
      closeAllDropdowns();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    closeAllDropdowns();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownContent = {
    members: [
      { 
        title: "How to join", 
        description: "Discover how to become a valued member", 
        link: "/register", 
        image: "/Head.png",
        icon: <FiUser className="text-[#D5B93C] mr-2" />
      },
      { 
        title: "Login", 
        description: "Access exclusive educational events and resources", 
        link: "/login", 
        image: "/HeadTwo.png",
        icon: <FiSettings className="text-[#D5B93C] mr-2" />
      }
    ],
    programmes: [
      { 
        title: "Conference", 
        description: "Meet industry experts in live interactive sessions", 
        link: "/conference?id=17", 
        image: "/Head.png",
        icon: <svg className="w-5 h-5 text-[#D5B93C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      },
      { 
        title: "Seminar/Training", 
        description: "Join the online trainings and group sessions", 
        link: "/seminars", 
        image: "/HeadTwo.png",
        icon: <svg className="w-5 h-5 text-[#D5B93C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      }
    ],
    media: [
      { 
        title: "Gallery", 
        description: "Access all of IAIIEA photos", 
        link: "/gallery/media", 
        image: "/Head.png",
        icon: <svg className="w-5 h-5 text-[#D5B93C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      },
      { 
        title: "News", 
        description: "Find out happenings in the educational industry", 
        link: "/gallery/news", 
        image: "/HeadTwo.png",
        icon: <svg className="w-5 h-5 text-[#D5B93C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      }
    ]
  };

  const renderUserMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
      </div>
      <Link
        href="/profile"
        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <FiSettings className="mr-3 text-gray-400" />
        Update Profile
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        <FiLogOut className="mr-3 text-gray-400" />
        Logout
      </button>
    </motion.div>
  );

  const renderDropdownMenu = (type: keyof typeof dropdownContent) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-[600px] bg-white shadow-xl rounded-xl overflow-hidden z-50 border border-gray-100"
      >
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          {dropdownContent[type].map((item, index) => (
            <Link 
              key={index} 
              href={item.link}
              className="group p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D5B93C] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  width={250}
                  height={150}
                  className="w-full h-auto object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderUserSection = () => {
    if (session) {
      return (
        <div className="flex items-center gap-4">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 text-white hover:text-[#D5B93C] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#D5B93C] flex items-center justify-center overflow-hidden">
                {session.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="User profile" 
                    width={40} 
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <FiUser size={20} className="text-[#0E1A3D]" />
                )}
              </div>
              <span className="font-medium hidden lg:inline">{session.user?.name?.split(' ')[0]}</span>
              {isUserMenuOpen ? (
                <FiChevronUp className="text-[#D5B93C] hidden lg:inline" />
              ) : (
                <FiChevronDown className="text-[#D5B93C] hidden lg:inline" />
              )}
            </button>
            <AnimatePresence>
              {isUserMenuOpen && renderUserMenu()}
            </AnimatePresence>
          </div>
          
          <Link href="/members-dashboard">
            <button className="hidden md:flex items-center bg-transparent border-2 border-[#D5B93C] px-6 py-2 font-semibold text-[#D5B93C] hover:bg-[#D5B93C] hover:text-[#0E1A3D] transition-colors duration-200 rounded-lg">
              Dashboard
            </button>
          </Link>
        </div>
      );
    }

    return (
      <button 
        onClick={() => signIn()}
        className="hidden md:flex items-center bg-transparent border-2 border-[#D5B93C] px-6 py-2 font-semibold text-[#D5B93C] hover:bg-[#D5B93C] hover:text-[#0E1A3D] transition-colors duration-200 rounded-lg"
      >
        Login
      </button>
    );
  };

  const renderMobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={toggleMobileMenu}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-80 bg-[#0E1A3D] z-50 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <Link href="/" onClick={toggleMobileMenu}>
                <Image src={Logo} alt="Logo" width={70} height={50} />
              </Link>
              <button 
                onClick={toggleMobileMenu} 
                className="text-gray-300 hover:text-[#D5B93C] transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col p-6 space-y-1">
              <Link
                href="/"
                className={`px-4 py-3 rounded-lg ${pathname === "/" ? "bg-[#1a2a5a] text-[#D5B93C]" : "text-gray-300 hover:bg-[#1a2a5a]"}`}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>

              {Object.entries(dropdownContent).map(([key, items]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => handleDropdownClick(key)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${
                      activeDropdown === key ? "bg-[#1a2a5a] text-[#D5B93C]" : "text-gray-300 hover:bg-[#1a2a5a]"
                    }`}
                  >
                    <span className="capitalize">{key}</span>
                    {activeDropdown === key ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-6"
                      >
                        <div className="py-2 space-y-1">
                          {items.map((item, index) => (
                            <Link
                              key={index}
                              href={item.link}
                              className="block px-4 py-3 text-gray-300 hover:text-[#D5B93C] rounded-lg hover:bg-[#1a2a5a]"
                              onClick={toggleMobileMenu}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                href="/about"
                className={`px-4 py-3 rounded-lg ${pathname === "/blog" ? "bg-[#1a2a5a] text-[#D5B93C]" : "text-gray-300 hover:bg-[#1a2a5a]"}`}
                onClick={toggleMobileMenu}
              >
                About
              </Link>

              <div className="pt-6 mt-4 border-t border-gray-700">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-[#D5B93C] flex items-center justify-center overflow-hidden">
                        {session.user?.image ? (
                          <Image 
                            src={session.user.image} 
                            alt="User profile" 
                            width={40} 
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <FiUser size={20} className="text-[#0E1A3D]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 text-gray-300 hover:text-[#D5B93C] rounded-lg hover:bg-[#1a2a5a]"
                      onClick={toggleMobileMenu}
                    >
                      Update Profile
                    </Link>
                    <Link 
                      href="/members-dashboard" 
                      className="block px-4 py-3 text-gray-300 hover:text-[#D5B93C] rounded-lg hover:bg-[#1a2a5a]"
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-[#1a2a5a] rounded-lg flex items-center gap-3"
                    >
                      <FiLogOut size={18} />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={toggleMobileMenu}>
                    <button className="w-full bg-[#D5B93C] hover:bg-[#c4aa36] text-[#0E1A3D] font-semibold py-3 px-6 rounded-lg transition-colors">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <nav ref={dropdownRef} className="fixed w-full z-50 bg-[#0E1A3D] shadow-md">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src={Logo} alt="Logo" width={100} height={70} className="" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/" 
                  ? "text-[#D5B93C] border-b-2 border-[#D5B93C]" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>

            {Object.entries(dropdownContent).map(([key, _]) => (
              <div key={key} className="relative">
                <button
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                    activeDropdown === key || pathname.includes(`/${key}`)
                      ? "text-[#D5B93C] border-b-2 border-[#D5B93C]" 
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => handleDropdownClick(key)}
                >
                  <span className="capitalize">{key}</span>
                  <FiChevronDown className={`ml-1 transition-transform ${
                    activeDropdown === key ? "transform rotate-180 text-[#D5B93C]" : ""
                  }`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === key && renderDropdownMenu(key as keyof typeof dropdownContent)}
                </AnimatePresence>
              </div>
            ))}

            <Link
              href="/about"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/blog" 
                  ? "text-[#D5B93C] border-b-2 border-[#D5B93C]" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {renderUserSection()}
            
            <button
              className="lg:hidden text-white p-2 hover:text-[#D5B93C] transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {renderMobileMenu()}
    </nav>
  );
};

export default Header;