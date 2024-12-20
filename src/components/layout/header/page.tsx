"use client";
import React, { useState, useEffect, useRef } from "react";
import Logo from "@/assets/auth/images/IAIIEA Logo I.png";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiChevronUp, FiX, FiUser, FiLogOut } from "react-icons/fi";
import "../../../app/globals.css";
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for user data in localStorage when component mounts
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setUserData(null);
    router.push("/");
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
      { title: "How to join", description: "Discover how to become a valued member", link: "/registerTwo", image: "/Head.png" },
      { title: "Login", description: "Access exclusive educational events and resources", link: "/login", image: "/HeadTwo.png" }
    ],
    programmes: [
      { title: "Conference", description: "Meet industry experts in live interactive sessions", link: "/conference-Registration", image: "/Head.png" },
      { title: "Seminar/webinar", description: "Join the online trainings and group sessions", link: "/seminar-landing-page", image: "/HeadTwo.png" }
    ],
    media: [
      { title: "Gallery", description: "Access all of IAIIEA photos", link: "/gallery/media", image: "/Head.png" },
      { title: "News", description: "Find out happenings in the educational industry", link: "/gallery/news", image: "/HeadTwo.png" }
    ]
  };

  const renderUserMenu = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
        <p className="text-xs text-gray-500">{userData?.email}</p>
      </div>
      <Link
        href="/members-dashboard"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Profile Settings
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  );

  const renderDropdownMenu = (type: keyof typeof dropdownContent) => {
    return (
      <div className="absolute mt-2 flex min-w-[500px] gap-5 justify-center items-center bg-white shadow-lg rounded-[10px] px-3 py-3">
        {dropdownContent[type].map((item, index) => (
          <div key={index} className="px-6 py-2 rounded-[10px] hover:bg-slate-300">
            <div>
              <Link href={item.link} className="block text-[18px] pb-2 font-600 text-[#0B142F]">
                {item.title}
                <div>
                  <p className="text-[15px] text-[#0B142F]">{item.description}</p>
                </div>
              </Link>
            </div>
            <div className="mt-2">
              <Image src={item.image} alt="" width={100} height={100} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMobileMenu = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
      <div className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-[#0E1A3D] z-50 overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">Menu</h2>
          <button onClick={toggleMobileMenu} className="text-white">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-col p-5 space-y-4">
          {/* Mobile menu items */}
          <Link
            href="/"
            className={`text-gray-300 py-2 ${pathname === "/" ? "text-yellow-500" : ""}`}
            onClick={toggleMobileMenu}
          >
            Home
          </Link>

          {Object.entries(dropdownContent).map(([key, items]) => (
            <div key={key}>
              <button
                onClick={() => handleDropdownClick(key)}
                className={`flex items-center justify-between w-full text-gray-300 py-2 ${
                  activeDropdown === key ? "text-yellow-500" : ""
                }`}
              >
                <span className="capitalize">{key}</span>
                {activeDropdown === key ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {activeDropdown === key && (
                <div className="pl-4 mt-2 space-y-2">
                  {items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="block text-gray-300 py-2"
                      onClick={toggleMobileMenu}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/blog"
            className={`text-gray-300 py-2 ${pathname === "/blog" ? "text-yellow-500" : ""}`}
            onClick={toggleMobileMenu}
          >
            About
          </Link>

          <div className="mt-4">
            {userData ? (
              <div className="space-y-2">
                <div className="text-gray-300 border-t pt-4">
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm">{userData.email}</p>
                </div>
                <Link href="/members-dashboard" className="block text-gray-300 py-2">
                  Dashboard
                </Link>
                <Link href="/profile" className="block text-gray-300 py-2">
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 py-2 flex items-center gap-2"
                >
                  <FiLogOut size={18} />
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={toggleMobileMenu}>
                <button className="w-full bg-transparent border-2 border-[#D5B93C] px-8 py-2 font-semibold text-[#D5B93C]">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <nav ref={dropdownRef}>
      <div className="fixed w-full md:px-14 px-5 mx-auto py-5 z-50 bg-[#0E1A3D]">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center md:w-auto">
              <Image src={Logo} alt="Logo" width={150} height={70} />
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center gap-5">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className={`text-gray-300 text-base px-3 py-2 font-poppins ${
                  pathname === "/" ? "text-yellow-500 border-b-2 border-yellow-500" : ""
                }`}
              >
                Home
              </Link>

              {Object.entries(dropdownContent).map(([key, _]) => (
                <div key={key} className="relative">
                  <button
                    className={`flex items-center text-gray-300 px-3 py-2 gap-2 text-base font-poppins ${
                      activeDropdown === key || pathname.includes(`/${key}`)
                        ? "text-yellow-500 border-b-2 border-yellow-500"
                        : ""
                    }`}
                    onClick={() => handleDropdownClick(key)}
                  >
                    <span className="capitalize">{key}</span>
                    {activeDropdown === key ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {activeDropdown === key && renderDropdownMenu(key as keyof typeof dropdownContent)}
                </div>
              ))}

              <Link
                href="/blog"
                className={`text-gray-300 px-3 py-2 text-base font-poppins ${
                  pathname === "/blog" ? "text-yellow-500 border-b-2 border-yellow-500" : ""
                }`}
              >
                About
              </Link>
            </div>

            <div className="relative" ref={userMenuRef}>
              {userData ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D5B93C] flex items-center justify-center">
                    <FiUser size={20} />
                  </div>
                  <span>{userData.name}</span>
                  {isUserMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              ) : (
                <Link href="/login">
                  <button className="bg-transparent border-2 border-[#D5B93C] px-8 py-2 font-semibold text-[#D5B93C]">
                    Login
                  </button>
                </Link>
              )}
              {isUserMenuOpen && userData && renderUserMenu()}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && renderMobileMenu()}
    </nav>
  );
};

export default Header;