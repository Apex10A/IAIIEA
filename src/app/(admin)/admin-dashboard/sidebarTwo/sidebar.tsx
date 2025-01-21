"use client"; 
import React, { useState, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeIcon from "@/assets/landingpage/svg/HomeIcon"
import NotificationIcon from "@/assets/landingpage/svg/NotificationIcon";
import BagIcon from "@/assets/landingpage/svg/BagIcon";

import DashboardIcon from '@/assets/sidebarIcons/DashboardIcon'
import PaymentIcon from '@/assets/sidebarIcons/PaymentIcon'
import AnnouncementIcon from '@/assets/sidebarIcons/AnnouncementIcon'
import GalleryIcon from '@/assets/sidebarIcons/GalleryIcon'
import ConferenceIcon from '@/assets/sidebarIcons/ConferenceIcon'
import SeminarIcon from '@/assets/sidebarIcons/SeminarIcon'
import ResourcesIcon from '@/assets/sidebarIcons/ResourcesIcon'
import ForumIcon from '@/assets/sidebarIcons/ForumIcon'
import MembersIcon from '@/assets/sidebarIcons/MembersDirectoryIcon'

import CalendarIcon from "@/assets/landingpage/svg/CalendarIcon";
import "@/app/index.css";

type SidebarProps = {
  setActiveComponent: (component: string) => void;
  hasPaid?: boolean;
};

// Define main portal items and their sub-items
const portalItems = [
  { 
    name: 'Dashboard', 
    icon: DashboardIcon, 
    requiredPortal: null,
    subItems: []
  },
  { 
    name: 'Payment', 
    icon: PaymentIcon,
    requiredPortal: null,
    subItems: []
  },
  { 
    name: 'Membership Portal', 
    icon: MembersIcon,
    requiredPortal: 'membership',
    subItems: [
      { name: 'Directory', requiredPortal: 'membership', icon: MembersIcon },
      { name: 'resources', requiredPortal: 'membership', icon: ResourcesIcon },
      // { name: 'Gallery', requiredPortal: 'membership', icon: GalleryIcon },
      { name: 'Forum', requiredPortal: 'membership', icon: ForumIcon },
      { name: 'Announcement', requiredPortal: 'membership', icon: AnnouncementIcon },
      { name: 'Events', icon: AnnouncementIcon }
      
    ]
  },
  { 
    name: 'Conference Portal', 
    icon: MembersIcon,
    requiredPortal: 'conference',
    subItems: [
      { name: 'Participants', requiredPortal: 'membership', icon: MembersIcon },
      { name: 'Resources', requiredPortal: 'membership', icon: ResourcesIcon },

      
    ]
  },
  { 
    name: 'Training Portal', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: [
      { name: 'Seminar Participants', requiredPortal: 'seminar', icon: MembersIcon },
      { name: 'Seminar Resources', requiredPortal: 'seminar', icon: ResourcesIcon },

      
    ]
  },
//   { 
//     name: 'Conference Portal', 
//     icon: ConferenceIcon,
//     requiredPortal: 'conference',
//     subItems: []
//   },
//   { 
//     name: 'Seminars / Webinars', 
//     icon: SeminarIcon,
//     requiredPortal: 'webinar',
//     subItems: []
//   },
//   { 
//     name: 'Settings', 
//     icon: BagIcon,
//     requiredPortal: null,
//     subItems: []
//   }
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, hasPaid = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeComponent, setActive] = useState('Dashboard');
  const [sidebarMode, setSidebarMode] = useState<'default' | 'mini' | 'closed' | 'mobile'>('default');
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [openPortals, setOpenPortals] = useState<{[key: string]: boolean}>({
    'Membership Portal': false,
    'Conference Portal': false,
    'Seminars / Webinars': false
  });

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

  const togglePortal = (portalName: string) => {
    setOpenPortals(prev => ({
      ...Object.fromEntries(
        Object.entries(prev).map(([key]) => [key, false])
      ),
      [portalName]: !prev[portalName]
    }));
  };

  const handleComponentClick = (component: string, isSubItem: boolean = false) => {
    setActive(component);
    setActiveComponent(component);
  
    // Close mobile sidebar after selection
    if (sidebarMode === 'mobile') {
      setSidebarMode('closed');
    }
  };

  const getButtonClassName = (component: string, isSubItem: boolean = false) => {
    const isActive = activeComponent === component;
    
    return `
      font-[500] flex items-end justify-center
      ${isSubItem 
        ? 'text-[16px] py-1 px-20 text-zinc-400 flex text-center ' 
        : 'text-[14px] md:text-[18px] py-1 md:py-2 text-black'}
      px-2 md:px-3 rounded-md cursor-pointer md:mx-3 
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
      fixed top-0 left-0 h-full z-50 bg-[#0e1a3d] shadow-lg 
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
          h-full top-24 p-5 pt-8 
          relative duration-300 
          flex items-center justify-center 
          ${sidebarMode !== 'mobile' ? 'max-md:hidden' : ''}
        `}
      >
        {/* Sidebar Toggle Button for non-mobile views */}
        {sidebarMode !== 'mobile' && (
          <div className='absolute top-4 right-4 z-50'>
            {sidebarMode === 'default' && (
              <ChevronsLeft 
                className="text-white cursor-pointer" 
                onClick={toggleSidebar} 
              />
            )}
            {sidebarMode === 'mini' && (
              <Menu 
                className="text-white cursor-pointer" 
                onClick={toggleSidebar} 
              />
            )}
            {sidebarMode === 'closed' && (
              <ChevronsRight 
                className="text-white cursor-pointer" 
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
                  {portalItems.map((item) => {
  const IconComponent = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isPortalOpen = openPortals[item.name];
  const isItemActive = activeComponent === item.name;

  return (
    <div key={item.name}>
      <motion.li
        className={`
          ${getButtonClassName(item.name)}
          ${sidebarMode === 'mini' ? 'flex justify-center items-center' : ''}
        `}
        onClick={() => {
          hasSubItems 
            ? togglePortal(item.name)
            : handleComponentClick(item.name);
        }}
      >
        <div className={`
          flex items-center gap-x-4 w-full
          ${sidebarMode === 'mini' ? 'justify-center' : 'justify-between'}
        `}>
          <div className="flex items-center gap-x-4">
            {sidebarMode === 'mini' ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0E1A3D]">
                <IconComponent isActive={isItemActive} />
              </div>
            ) : (
              <IconComponent isActive={isItemActive} />
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

                              {/* Dropdown icon for portals with sub-items */}
                              {hasSubItems && (sidebarMode === 'default' || sidebarMode === 'mobile') && (
                                <div>
                                  {isPortalOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                              )}
                            </div>
                          </motion.li>

                          {/* Dropdown Sub-Items */}
                          {hasSubItems && isPortalOpen && (sidebarMode === 'default' || sidebarMode === 'mobile') && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {item.subItems.map((subItem) => (
                                  <motion.li
                                    key={subItem.name}
                                    className={getButtonClassName(subItem.name, true)}
                                    onClick={() => handleComponentClick(subItem.name, true)}
                                  >
                                    {subItem.name}
                                  </motion.li>
                                ))}
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </div>
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