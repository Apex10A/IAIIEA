import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "@/app/index.css"

// Import your icons
import DashboardIcon from '@/assets/sidebarIcons/DashboardIcon';
import PaymentIcon from '@/assets/sidebarIcons/PaymentIcon';
import AnnouncementIcon from '@/assets/sidebarIcons/AnnouncementIcon';
import GalleryIcon from '@/assets/sidebarIcons/GalleryIcon';
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

// Portal items configuration
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
    name: 'Annual calendar', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: []
  },
  {
    name: 'Conference Schedule', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: []
  },
  {
    name: 'Daily Meals', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: []
  },
  {
    name: 'Forum', 
    icon: ForumIcon,
    requiredPortal: 'seminar',
    subItems: []
  },
  
  {
    name: 'News', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: []
  },
  {
    name: 'Broadcast Message', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: []
  },

  {
    name: 'Speakers List', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: []
  },
  { 
    name: 'Membership Portal', 
    icon: MembersIcon,
    requiredPortal: 'membership',
    subItems: [
      { name: 'Directory', requiredPortal: 'membership', icon: MembersIcon },
      { name: 'Members Resources', requiredPortal: 'membership', icon: ResourcesIcon },
      { name: 'Announcement', requiredPortal: 'membership', icon: AnnouncementIcon },
      // { name: 'Events', requiredPortal: 'membership', icon: AnnouncementIcon }
    ]
  },
  { 
    name: 'Conference Portal', 
    icon: MembersIcon,
    requiredPortal: 'conference',
    subItems: [
      { name: 'Participants', requiredPortal: 'conference', icon: MembersIcon },
      { name: 'Conferences', requiredPortal: 'conference', icon: ResourcesIcon },
      { name: 'Messages', requiredPortal: 'conference', icon: ResourcesIcon },
      { name: 'Gallery', requiredPortal: 'conference', icon: ResourcesIcon },
    ]
  },
  { 
    name: 'Training Portal', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: [
      { name: 'Seminar Participants', requiredPortal: 'seminar', icon: MembersIcon },
      { name: 'Seminars', requiredPortal: 'seminar', icon: ResourcesIcon },
      { name: 'Broadcast', requiredPortal: 'conference', icon: ResourcesIcon },
    ]
  }
 
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, hasPaid = false }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleItemClick = (item: NavItem | NavItem['subItems'][0]) => {
    setActiveItem(item.name);
    setActiveComponent(item.name);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const NavItemComponent: React.FC<{
    item: NavItem;
    level?: number;
  }> = ({ item, level = 0 }) => {
    const isExpanded = expandedItems.has(item.name);
    const isActive = activeItem === item.name;
    const IconComponent = item.icon;
    const hasSubItems = item.subItems.length > 0;

    return (
      <div className="w-full">
        <motion.button
          className={`
            w-full flex items-center justify-between p-1 rounded-lg
            transition-colors duration-200
            ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'}
            ${level > 0 ? 'ml-4' : ''}
          `}
          onClick={() => {
            if (hasSubItems) {
              toggleItem(item.name);
            } else {
              handleItemClick(item);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-8 h-8 flex items-center justify-center
              ${isActive ? 'text-white' : 'text-gray-400'}
            `}>
              <IconComponent isActive={isActive} />
            </div>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          {hasSubItems && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          )}
        </motion.button>

        <AnimatePresence>
          {isExpanded && hasSubItems && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.subItems.map((subItem) => (
                <NavItemComponent
                  key={subItem.name}
                  item={{ ...subItem, subItems: [] }}
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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-gray-800 text-white md:hidden"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

     <div className='flex h-full'>
       {/* Backdrop */}
       <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-[40] md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Container */}
        <AnimatePresence>
          {(isMobileOpen || !isMobile) && (
            <motion.aside
              initial={isMobile ? { x: "-100%" } : { x: 0 }}
              animate={{ x: 0 }}
              exit={isMobile ? { x: "-100%" } : {}}
              transition={{ type: "tween", duration: 0.3 }}
              className={`
                ${isMobile ? 'fixed left-0 top-0' : 'relative'}
                h-full w-77
                bg-[#0e1a3d] shadow-xl
                z-[50]
                flex flex-col
                overflow-hidden
              `}
            >
              {/* Sidebar Content */}
              <div className="flex flex-col gap-2 p-4 pt-20 h-full overflow-y-auto">
                {portalItems.map((item) => (
                  <NavItemComponent key={item.name} item={item} />
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
     </div>

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: '-100%' } : false}
        animate={isMobile ? { x: isMobileOpen ? 0 : '-100%' } : false}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-[#0e1a3d] shadow-xl
          flex flex-col gap-2 p-4 pt-20
          overflow-y-auto
          md:relative md:translate-x-0
        `}
      >
        {portalItems.map((item) => (
          <NavItemComponent key={item.name} item={item} />
        ))}
      </motion.aside>
    </>
  );
};

export default Sidebar;