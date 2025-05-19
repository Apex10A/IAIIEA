'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import "@/app/index.css"

// Import your icons...
import DashboardIcon from '@/assets/sidebarIcons/DashboardIcon';
import CalendarIcon from '@/assets/sidebarIcons/CalendarIcon';
import ConferenceScheduleIcon from '@/assets/sidebarIcons/ScheduleIcon';
import ConferencePortalIcon from '@/assets/sidebarIcons/ConferencePortalIcon';
import PaymentIcon from '@/assets/sidebarIcons/PaymentIcon';
import MealsIcon from '@/assets/sidebarIcons/MealsIcon';
import NewsIcon from '@/assets/sidebarIcons/NewsIcon';
import AnnouncementIcon from '@/assets/sidebarIcons/AnnouncementIcon';
import SpeakersIcon from '@/assets/sidebarIcons/SpeakersIcon';
import GalleryIcon from '@/assets/sidebarIcons/GalleryIcon';
import BroadcastIcon from '@/assets/sidebarIcons/BroadcastIcon';
import ResourcesIcon from '@/assets/sidebarIcons/ResourcesIcon';
import ForumIcon from '@/assets/sidebarIcons/ForumIcon';
import MembersIcon from '@/assets/sidebarIcons/MembersDirectoryIcon';

type SidebarProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
  hasPaid?: boolean;
};

type NavItem = {
  name: string;
  path: string;
  icon: React.FC<{ isActive: boolean }>;
  subItems?: {
    name: string;
    path: string;
    icon: React.FC<{ isActive: boolean }>;
  }[];
};

const portalItems: NavItem[] = [
  { 
    name: 'Dashboard', 
    path: '/admin-dashboard',
    icon: DashboardIcon,
  },
  { 
    name: 'Payment', 
    path: '/admin-dashboard/payment',
    icon: PaymentIcon,
  },
  {
    name: 'Annual calendar', 
    path: '/admin-dashboard/calendar',
    icon: CalendarIcon,
  },
   {
    name: 'Forum', 
    path: '/admin-dashboard/forum',
    icon: ForumIcon,
  },
  {
      name: 'Announcement', 
      path: '/admin-dashboard/announcement',
      icon: AnnouncementIcon,

    },
   {
    name: 'Daily Meals', 
    path: '/admin-dashboard/daily-meals',
    icon: MealsIcon,
  },

    {
    name: 'Speakers List', 
    icon: SpeakersIcon,
     path: '/admin-dashboard/speakers',
  },
   {
      name: 'News', 
      icon: NewsIcon,
      path: '/admin-dashboard/news',
    },
      { 
        name: 'Membership Portal', 
        icon: MembersIcon,
        path: '/admin-dashboard/membership',
        subItems: [
          { name: 'Directory', path: '/admin-dashboard/membership/directory', icon: MembersIcon },
          { name: 'Members Resources', path: '/admin-dashboard/membership/members-resources', icon: ResourcesIcon },
        ]
      },
  {
    name: 'Conference Portal', 
    path: '/admin-dashboard/conference',
    icon: ConferencePortalIcon,
    subItems: [
      { 
        name: 'Participants', 
        path: '/admin-dashboard/conferences/participants',
        icon: MembersIcon 
      },
      { 
        name: 'Conferences', 
        path: '/admin-dashboard/conferences',
        icon: ResourcesIcon 
      },
      { 
        name: 'Messages', 
        path: '/admin-dashboard/conferences/messages',
        icon: MembersIcon 
      },
        {
    name: 'Conference Schedule', 
    path: '/admin-dashboard/conference/conference-schedule',
    icon: ConferenceScheduleIcon,
  },
      { 
        name: 'Gallery', 
        path: '/admin-dashboard/gallery',
        icon: ResourcesIcon 
      },
      // ... other sub items
    ]
  },
   {
    name: 'Training Portal', 
    path: '/admin-dashboard/training',
    icon: ConferencePortalIcon,
    subItems: [
      { 
        name: 'Seminar Participants', 
        path: '/admin-dashboard/training/seminar-participants',
        icon: MembersIcon 
      },
      { 
        name: 'Seminars', 
        path: '/admin-dashboard/training/seminars',
        icon: ResourcesIcon 
      },
      { 
        name: 'Broadcast', 
        path: '/admin-dashboard/training/broadcast',
        icon: MembersIcon 
      },
      { 
        name: 'Gallery', 
        path: '/admin-dashboard/training/gallery',
        icon: ResourcesIcon 
      },
      // ... other sub items
    ]
  },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, hasPaid = false }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const NavItemComponent: React.FC<{
    item: NavItem;
    level?: number;
  }> = ({ item, level = 0 }) => {
    const isActive = currentPath === item.path || 
                    (item.subItems?.some(subItem => currentPath === subItem.path));
    const isExpanded = expandedItems.has(item.name);
    const IconComponent = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div className="w-full">
        <motion.div
          className={`
            w-full flex items-center justify-between p-3 rounded-lg
            transition-all duration-200 ease-in-out
            ${isActive ? 'bg-white/10 dark:bg-gray-700 text-white' : 
              'text-gray-300 dark:text-gray-400 hover:bg-white/5 dark:hover:bg-gray-700/50'}
            ${level > 0 ? 'ml-4' : ''}
            cursor-pointer
            border-l-4 ${isActive ? 'border-blue-500' : 'border-transparent'}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (hasSubItems) {
              toggleItem(item.name);
            } else {
              onNavigate(item.path);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-6 h-6 flex items-center justify-center
              ${isActive ? 'text-blue-400' : 'text-gray-400'}
            `}>
              <IconComponent isActive={!!isActive} />
            </div>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          {hasSubItems && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {isExpanded && hasSubItems && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.1 }
                }
              }}
              exit={{ 
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.15, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.1 }
                }
              }}
              className="overflow-hidden pl-2"
            >
              {item.subItems?.map((subItem) => (
                <NavItemComponent
                  key={subItem.path}
                  item={subItem}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full fixed mt-16 w-64 bg-[#0e1a3d] dark:bg-gray-900 shadow-xl flex flex-col overflow-y-auto custom-scrollbar"
    >
      <div className="flex flex-col gap-1 p-4 pt-5">
        {portalItems.map((item) => (
          <NavItemComponent key={item.path} item={item} />
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;