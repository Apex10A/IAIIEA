"use client";

import React, { useState, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "@/app/index.css";

// Import your icons
import DashboardIcon from '@/assets/sidebarIcons/DashboardIcon';
import PaymentIcon from '@/assets/sidebarIcons/PaymentIcon';
import AnnouncementIcon from '@/assets/sidebarIcons/AnnouncementIcon';
import ResourcesIcon from '@/assets/sidebarIcons/ResourcesIcon';
import ForumIcon from '@/assets/sidebarIcons/ForumIcon';
import MembersIcon from '@/assets/sidebarIcons/MembersDirectoryIcon';

type SidebarProps = {
  setActiveComponent: (component: string) => void;
  hasPaid?: boolean;
};

type NavItem = {
  name: string;
  icon: React.FC<{ isActive: boolean }>;
  requiredPortal: string | null;
  subItems: {
    name: string;
    requiredPortal: string | null;
    icon: React.FC<{ isActive: boolean }>;
  }[];
};

const portalItems: NavItem[] = [
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
      { name: 'Resources', requiredPortal: 'membership', icon: ResourcesIcon },
      { name: 'Forum', requiredPortal: 'membership', icon: ForumIcon },
      { name: 'Announcement', requiredPortal: 'membership', icon: AnnouncementIcon },
      { name: 'Events', requiredPortal: 'membership', icon: AnnouncementIcon }
    ]
  },
  { 
    name: 'Conference Portal', 
    icon: MembersIcon,
    requiredPortal: 'conference',
    subItems: [
      { name: 'Participants', requiredPortal: 'conference', icon: MembersIcon },
      { name: 'Resources', requiredPortal: 'conference', icon: ResourcesIcon },
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
  }
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, hasPaid = false }) => {
  const [activeComponent, setActive] = useState('Dashboard');
  const [sidebarMode, setSidebarMode] = useState<'default' | 'mini' | 'closed' | 'mobile'>('default');
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [openPortals, setOpenPortals] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      if (newWidth < 640) {
        setSidebarMode('mobile');
      } else if (newWidth < 1024) {
        setSidebarMode('mini');
      } else {
        setSidebarMode('default');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    switch (sidebarMode) {
      case 'default':
        setSidebarMode('mini');
        break;
      case 'mini':
        setSidebarMode('closed');
        break;
      case 'closed':
        setSidebarMode('default');
        break;
      case 'mobile':
        setSidebarMode('closed');
        break;
    }
  };

  const togglePortal = (portalName: string) => {
    setOpenPortals(prev => ({
      ...prev,
      [portalName]: !prev[portalName]
    }));
  };

  const handleComponentClick = (component: string) => {
    setActive(component);
    setActiveComponent(component);
    
    if (sidebarMode === 'mobile') {
      setSidebarMode('closed');
    }
  };

  const getButtonClassName = (component: string, isSubItem: boolean = false) => {
    const isActive = activeComponent === component;
    
    return `
      font-[500] flex items-center
      ${isSubItem 
        ? 'text-[16px] py-1 px-6 text-zinc-400' 
        : 'text-[14px] md:text-[18px] py-2 text-white'}
      px-3 rounded-md cursor-pointer mx-3 
      ${isActive 
        ? 'bg-white/10' 
        : 'hover:bg-white/5'}
      ${sidebarMode === 'mobile' ? 'text-[16px]' : ''}
    `;
  };

  const getSidebarWidth = () => {
    switch (sidebarMode) {
      case 'default': return 'w-72';
      case 'mini': return 'w-20';
      case 'mobile': return 'w-64';
      case 'closed': return 'w-0';
    }
  };

  const getMobileSidebarClasses = () => {
    return `
      fixed top-0 left-0 h-full z-50 bg-[#0e1a3d] shadow-lg 
      transition-transform duration-300 
      ${sidebarMode === 'mobile' ? 'translate-x-0' : '-translate-x-full'}
    `;
  };

  return (
    <>
      {(sidebarMode === 'mobile' || sidebarMode === 'closed') && (
        <div className="fixed top-4 left-4 z-40 md:hidden block">
          <Menu 
            className="text-black cursor-pointer" 
            onClick={() => setSidebarMode('mobile')} 
          />
        </div>
      )}

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
          bg-[#0e1a3d]
          h-full p-5 pt-20  
          relative duration-300 
          ${sidebarMode !== 'mobile' ? 'max-md:hidden' : ''}
        `}
      >
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
              className='flex flex-col justify-between items-center h-full mt-10 w-full'
            >
              <div className='w-full'>
                <ul className='leading-[40px] flex flex-col gap-5'>
                  {portalItems.map((item) => {
                    const IconComponent = item.icon;
                    const hasSubItems = item.subItems.length > 0;
                    const isPortalOpen = openPortals[item.name];
                    const isItemActive = activeComponent === item.name;

                    return (
                      <div key={item.name}>
                        <motion.li
                          className={`
                            ${getButtonClassName(item.name)}
                            ${sidebarMode === 'mini' ? 'justify-center' : ''}
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
                                <span>{item.name}</span>
                              )}
                            </div>

                            {hasSubItems && (sidebarMode === 'default' || sidebarMode === 'mobile') && (
                              <div>
                                {isPortalOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              </div>
                            )}
                          </div>
                        </motion.li>

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
                                  onClick={() => handleComponentClick(subItem.name)}
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