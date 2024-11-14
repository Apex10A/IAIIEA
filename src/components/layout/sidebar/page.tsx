"use client"; 

import React, { useState, useEffect } from 'react';
import { Lock, ChevronsLeft, ChevronsRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { AiOutlineUser } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import HomeIcon from "../../../assets/landingpage/svg/HomeIcon";
import NotificationIcon from "../../../assets/landingpage/svg/NotificationIcon";
import BagIcon from "../../../assets/landingpage/svg/BagIcon";
import CalendarIcon from "../../../assets/landingpage/svg/CalendarIcon";
import "../../../app/index.css";

// Define menu items with their restriction status
// type MenuItem = {
//   name: string;
//   icon: React.ComponentType;
//   restricted: boolean;
// };

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon },
  // { name: 'Payment', icon: BagIcon },
  { name: 'Announcement', icon: NotificationIcon },
  { name: 'Conference Portal', icon: BagIcon },
  // { name: 'Seminars/webinars', icon: CalendarIcon },
  { name: 'Members directory', icon: BagIcon },
  { name: 'IAIIEA resources', icon: BagIcon },
  { name: 'Gallery', icon: BagIcon },
  { name: 'Forum', icon: BagIcon },
  { name: 'Settings', icon: BagIcon },
];

const Sidebar = ({ 
  setActiveComponent, 
  hasPaid = false
}: { 
  setActiveComponent: (component: string) => void,
  hasPaid?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeComponent, setActive] = useState('Dashboard');
  const [sidebarMode, setSidebarMode] = useState<'default' | 'mini' | 'closed' | 'mobile'>('default');
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Handle responsive design
  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Update window width on resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      // Adjust sidebar mode based on screen size
      if (newWidth < 640) {
        setSidebarMode('mobile');
        setIsOpen(false);
      } else if (newWidth < 1024) {
        setSidebarMode('mini');
        setIsOpen(false);
      } else {
        setSidebarMode('default');
        setIsOpen(true);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    switch (sidebarMode) {
      case 'default':
        setSidebarMode('mini');
        setIsOpen(false);
        break;
      case 'mini':
        setSidebarMode('closed');
        break;
      case 'closed':
        setSidebarMode('default');
        setIsOpen(true);
        break;
      case 'mobile':
        setSidebarMode('closed');
        break;
    }
  };

  const handleComponentClick = (component: string) => {
    setActive(component);
    setActiveComponent(component);
  
    // Close mobile sidebar after selection
    if (sidebarMode === 'mobile') {
      setSidebarMode('closed');
    }
  };

  const getButtonClassName = (component: string) => {
    const isActive = activeComponent === component;
    
    return `
      text-[15px] md:text-[18px] font-[500] flex items-center justify-between 
      py-2 px-2 md:px-3 rounded-md cursor-pointer md:mx-3 text-black
      ${isActive 
        ? 'bg-gray-200 text-[#0E1A3D] ' 
        : 'text-white hover:bg-[#0E1A3D] hover:text-[#cfc8c8]'}
      ${sidebarMode === 'mobile' ? 'text-[16px]' : ''}
    `;
  };

  // Sidebar width and visibility based on mode
  const getSidebarWidth = () => {
    switch (sidebarMode) {
      case 'default': return 'w-72';
      case 'mini': return 'w-20';
      case 'mobile': return 'w-64';
      case 'closed': return 'w-0';
    }
  };

  // Mobile overlay for sidebar
  const getMobileSidebarClasses = () => {
    return `
      fixed top-0 left-0 h-full z-50 
      bg-white shadow-lg 
      transition-transform duration-300 
      ${sidebarMode === 'mobile' ? 'translate-x-0' : '-translate-x-full'}
    `;
  };

  return (
    <>
      {/* Mobile/Small Screen Sidebar Trigger */}
      {(sidebarMode === 'mobile' || sidebarMode === 'closed') && (
        <div 
          className="fixed top-4 left-4 z-40 
          md:hidden block"
        >
          <Menu 
            className="text-black cursor-pointer" 
            onClick={() => setSidebarMode('mobile')} 
          />
        </div>
      )}

      {/* Sidebar */}
      <motion.div 
        initial={{ width: '23rem' }}
        animate={{ 
          width: sidebarMode === 'default' ? '23rem' : 
                 sidebarMode === 'mini' ? '5rem' : 
                 sidebarMode === 'mobile' ? '18rem' : 0 
        }}
        transition={{ duration: 0.3 }}
        className={`
          ${getSidebarWidth()} 
          ${sidebarMode === 'mobile' ? getMobileSidebarClasses() : ''}
          border border-[#CACAC9] bg-[#0e1a3d]
          h-screen top-24 p-5 pt-8 
          relative duration-300 
          flex items-center justify-center 
          overflow-y-auto md:overflow-hidden
          ${sidebarMode !== 'mobile' ? 'max-md:hidden' : ''}
        `}
      >
        {/* Mobile Close Button */}
        {sidebarMode === 'mobile' && (
          <div className='absolute top-4 right-4 z-50'>
            <X 
              className="text-black cursor-pointer" 
              onClick={() => setSidebarMode('closed')} 
            />
          </div>
        )}

        {/* Sidebar Toggle Button for non-mobile views */}
        {sidebarMode !== 'mobile' && (
          <div className='absolute top-4 right-4 z-50'>
            {sidebarMode === 'default' && (
              <ChevronsLeft 
                className="text-black cursor-pointer" 
                onClick={toggleSidebar} 
              />
            )}
            {sidebarMode === 'mini' && (
              <Menu 
                className="text-black cursor-pointer" 
                onClick={toggleSidebar} 
              />
            )}
            {sidebarMode === 'closed' && (
              <ChevronsRight 
                className="text-black cursor-pointer" 
                onClick={toggleSidebar} 
              />
            )}
          </div>
        )}

        <AnimatePresence>
          {sidebarMode !== 'closed' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col justify-between items-center h-full mt-5 md:mt-10 w-full'
            >
              <div className='w-full'>
                <ul>
                  <div className='leading-[40px] flex flex-col gap-3 md:gap-5'>
                  {menuItems.map((item) => {
  const IconComponent = item.icon;
  
  return (
    <motion.li
      key={item.name}
      whileHover={{ scale: sidebarMode === 'mini' ? 1.1 : 1 }}
      className={`
        ${getButtonClassName(item.name)}
        ${sidebarMode === 'mini' ? 'flex justify-center items-center' : ''}
      `}
      onClick={() => handleComponentClick(item.name)}
    >
      <div className={`
        flex items-center gap-x-4
        ${sidebarMode === 'mini' ? 'w-full justify-center' : ''}
      `}>
        {sidebarMode === 'mini' ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0E1A3D]">
            <IconComponent />
          </div>
        ) : (
          <IconComponent />
        )}
        {(sidebarMode === 'default' || sidebarMode === 'mobile') && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {item.name}
          </motion.span>
        )}
      </div>
    </motion.li>
  );
})}
                  </div>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Sidebar;