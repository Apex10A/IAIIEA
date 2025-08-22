"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X as XIcon, 
  ChevronRight, 
  ChevronDown,
  ChevronLeft,
  Home,
  CreditCard,
  Users,
  MessageSquare,
  FileText,
  Bell,
  User,
  LogOut,
  Sliders
} from 'lucide-react';

// Types
type SubNavItem = {
  id: string;
  name: string;
  requiredPortal: string | null;
  icon?: React.FC<{ active?: boolean; size?: number; className?: string }>;
};

type NavItem = {
  id: string;
  name: string;
  icon: React.FC<{ active?: boolean; size?: number }>;
  requiredPortal: string | null;
  subItems: SubNavItem[];
};

type SidebarProps = {
  setActiveComponent: (component: string) => void;
  hasPaid?: boolean;
  defaultDark?: boolean;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
};

// Custom Icons Components
const DashboardIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({ active, size = 20, className }) => (
  <Home size={size} className={`${className} ${active ? "text-indigo-400" : "text-gray-400"}`} />
);

const PaymentIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({ active, size = 20, className }) => (
  <CreditCard size={size} className={`${className} ${active ? "text-indigo-400" : "text-gray-400"}`} />
);

const ForumIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({ active, size = 20, className }) => (
  <MessageSquare size={size} className={`${className} ${active ? "text-indigo-400" : "text-gray-400"}`} />
);

const MembersIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({ active, size = 20, className }) => (
  <Users size={size} className={`${className} ${active ? "text-indigo-400" : "text-gray-400"}`} />
);

const ResourcesIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({ active, size = 20, className }) => (
  <FileText size={size} className={`${className} ${active ? "text-indigo-400" : "text-gray-400"}`} />
);

const AnnouncementIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({ active, size = 20, className }) => (
  <Bell size={size} className={`${className} ${active ? "text-indigo-400" : "text-gray-400"}`} />
);

// Navigation Items
const navigationItems: NavItem[] = [
  { 
    id: "dashboard",
    name: 'Dashboard', 
    icon: DashboardIcon,
    requiredPortal: null,
    subItems: []
  },
  { 
    id: "payment",
    name: 'Payment', 
    icon: PaymentIcon,
    requiredPortal: null,
    subItems: []
  },
  { 
    id: "forum",
    name: 'Forum',
    icon: ForumIcon,
    requiredPortal: 'membership',
    subItems: []
  },
  { 
    id: "membership",
    name: 'Membership Portal', 
    icon: MembersIcon,
    requiredPortal: 'membership',
    subItems: [
      { id: "directory", name: 'Directory', requiredPortal: 'membership', icon: MembersIcon },
      { id: "resources", name: 'IAIIEA Resources', requiredPortal: 'membership', icon: ResourcesIcon },
      { id: "announcements", name: 'Announcement', requiredPortal: 'membership', icon: AnnouncementIcon },
      { id: "certifications", name: 'Certification', requiredPortal: 'membership', icon: AnnouncementIcon }
    ]
  },
  { 
    id: "conference",
    name: 'Conference Portal', 
    icon: MembersIcon,
    requiredPortal: 'conference',
    subItems: [
      { id: "participants", name: 'Participants', requiredPortal: 'conference', icon: MembersIcon },
      { id: "conferences", name: 'Conferences', requiredPortal: 'conference', icon: ResourcesIcon },
      { id: "conf-announcements", name: 'Conference Announcements', requiredPortal: 'conference', icon: AnnouncementIcon },
      //  { id: "conf-certifications", name: 'Certification', requiredPortal: 'conference', icon: ResourcesIcon },Conference Announcements
    ]
  },
  { 
    id: "training",
    name: 'Training Portal', 
    icon: MembersIcon,
    requiredPortal: 'seminar',
    subItems: [
      { id: "seminar-participants", name: 'Seminar Participants', requiredPortal: 'seminar', icon: MembersIcon },
      { id: "seminar-resources", name: 'Seminars', requiredPortal: 'seminar', icon: ResourcesIcon },
      { id: "seminar-announcements", name: 'Seminar Announcements', requiredPortal: 'seminar', icon: AnnouncementIcon },
      //  { id: "seminar-certifications", name: 'Certification', requiredPortal: 'seminar', icon: AnnouncementIcon },
    ]
  },
  { 
    id: "settings",
    name: 'Settings', 
    icon: DashboardIcon,
    requiredPortal: null,
    subItems: []
  },
];

const ModernSidebar: React.FC<SidebarProps> = ({ 
  setActiveComponent, 
  hasPaid = true,
  defaultDark = true,
  isMobileOpen,
  onMobileToggle
}) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(defaultDark);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      // On mobile breakpoint change, reset expanded state
      if (newIsMobile !== isMobile) {
        setIsExpanded(true); // Always start expanded
      }
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onMobileToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileOpen, onMobileToggle]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleItemClick = (item: NavItem | SubNavItem) => {
    // If this is a main item with subitems, toggle expand
    if ('subItems' in item && item.subItems.length > 0) {
      toggleExpandItem(item.id);
      return;
    }
    
    // Otherwise, set as active
    setActiveItem(item.id);
    setActiveComponent(item.name);
    
    // On mobile, close sidebar after selection
    if (isMobile && isMobileOpen) {
      onMobileToggle();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Determine base classes based on theme
  const themeClasses = isDarkMode
    ? {
        sidebar: "bg-[#0E1A3D] text-white shadow-lg",
        item: "text-gray-300 hover:text-[#0E1A3D] hover:bg-white",
        activeItem: "bg-white text-[#0E1A3D]",
        iconItem: "text-[#0E1A3D] hover:text-[#0E1A3D] hover:bg-white",
        activeIconItem: "bg-white text-white",
        overlay: "bg-gray-900/70",
        border: "border-gray-700",
        iconBg: "bg-gray-800"
      }
    : {
        sidebar: "bg-white text-gray-800 shadow-lg",
        item: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        activeItem: "bg-indigo-50 text-indigo-700",
        iconItem: "text-gray-500 hover:text-indigo-600 hover:bg-gray-100",
        activeIconItem: "bg-indigo-50 text-indigo-700",
        overlay: "bg-gray-600/50",
        border: "border-gray-200",
        iconBg: "bg-gray-100"
      };

  // Animation variants
  const sidebarVariants = {
    expanded: { 
      width: isMobile ? "280px" : "272px", 
      transition: { type: "spring", stiffness: 300, damping: 35 }
    },
    collapsed: { 
      width: "72px", 
      transition: { type: "spring", stiffness: 300, damping: 35 }
    },
    mobileOpen: { 
      x: 0, 
      width: "280px",
      transition: { type: "spring", stiffness: 300, damping: 35 }
    },
    mobileClosed: { 
      x: "-100%", 
      width: "280px",
      transition: { type: "spring", stiffness: 300, damping: 35 }
    }
  };

  const subMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.25 } 
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  // Tooltip variants
  const tooltipVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 } 
    }
  };

  // Determine sidebar state for animation
  const sidebarAnimationState = isMobile 
    ? (isMobileOpen ? "mobileOpen" : "mobileClosed") 
    : (isExpanded ? "expanded" : "collapsed");

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className={`fixed inset-0 z-30 ${themeClasses.overlay} backdrop-blur-sm`}
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        animate={sidebarAnimationState}
        variants={sidebarVariants}
        className={`
          fixed top-24 left-0 h-full z-40
          ${themeClasses.sidebar}
          flex flex-col
          transition-colors duration-200
          overflow-hidden
        `}
      >
        {/* Sidebar header */}
        <div className={`p-4 flex items-center justify-between border-b ${themeClasses.border}`}>
          {isExpanded && !isMobile && (
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">IA</span>
              </div> */}
              <h1 className="font-bold text-lg">IAIIEA Portal</h1>
            </div>
          )}
          
          {/* {!isExpanded && !isMobile && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">IA</span>
              </div>
            </div>
          )} */}

          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className={`p-1.5 rounded-md ${themeClasses.item} transition-colors ${!isExpanded ? 'w-full mt-2' : ''}`}
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className={`space-y-1 ${isExpanded || isMobile ? 'px-2' : 'px-1'}`}>
            {navigationItems.map((item) => {
              // Skip items based on payment status
              if (item.requiredPortal && !hasPaid) return null;
              
              const isActive = activeItem === item.id;
              const isItemExpanded = expandedItems[item.id];
              const hasSubItems = item.subItems.length > 0;
              const ItemIcon = item.icon;
              const isHovered = hoveredItem === item.id;

              return (
                <div key={item.id}>
                  <div className="relative">
                    <button
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => !isExpanded && !isMobile && setHoveredItem(item.id)}
                      onMouseLeave={() => !isExpanded && !isMobile && setHoveredItem(null)}
                      className={`
                        w-full flex items-center justify-between p-2.5 rounded-md
                        transition-colors duration-200 group
                        ${isExpanded || isMobile
                          ? (isActive && !hasSubItems ? themeClasses.activeItem : themeClasses.item)
                          : (isActive ? themeClasses.activeIconItem : themeClasses.iconItem)
                        }
                        ${hasSubItems ? 'font-medium' : ''}
                        ${!isExpanded && !isMobile ? 'justify-center' : ''}
                      `}
                    >
                      <div className={`flex items-center ${!isExpanded && !isMobile ? 'justify-center w-full' : ''}`}>
                        <span className={`${isExpanded || isMobile ? 'mr-3' : ''}`}>
                          <ItemIcon active={isActive} />
                        </span>
                        {(isExpanded || isMobile) && (
                          <span className="text-sm">{item.name}</span>
                        )}
                      </div>
                      
                      {hasSubItems && (isExpanded || isMobile) && (
                        <span className="ml-auto transform transition-transform duration-200">
                          {isItemExpanded ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </span>
                      )}
                      
                      {hasSubItems && !isExpanded && !isMobile && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1">
                          <ChevronRight size={14} className="text-gray-400" />
                        </span>
                      )}
                    </button>
                    
                    {/* Tooltip for collapsed sidebar */}
                    {!isExpanded && !isMobile && isHovered && (
                      <AnimatePresence>
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={tooltipVariants}
                          className={`
                            absolute left-16 top-1/2 -translate-y-1/2 z-50
                            py-1 px-2 rounded bg-gray-800 text-white text-sm
                            whitespace-nowrap
                          `}
                        >
                          {item.name}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Sub-items - only visible when parent is expanded */}
                  {hasSubItems && (isExpanded || isMobile) && (
                    <AnimatePresence>
                      {isItemExpanded && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={subMenuVariants}
                          className="overflow-hidden pl-10"
                        >
                          {item.subItems.map((subItem) => {
                            // Skip sub-items based on payment status
                            if (subItem.requiredPortal && !hasPaid) return null;
                            
                            const isSubActive = activeItem === subItem.id;
                            const SubIcon = subItem.icon;

                            return (
                              <button
                                key={subItem.id}
                                onClick={() => handleItemClick(subItem)}
                                className={`
                                  w-full flex items-center p-2 rounded-md my-0.5
                                  text-sm transition-colors duration-200
                                  ${isSubActive ? themeClasses.activeItem : themeClasses.item}
                                `}
                              >
                                <div className="flex items-center">
                                  {SubIcon && <SubIcon active={isSubActive} className="mr-2" />}
                                  <span>{subItem.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                  
                  {/* Flyout menu for collapsed sidebar with submenus */}
                  {hasSubItems && !isExpanded && !isMobile && isHovered && (
                    <AnimatePresence>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={tooltipVariants}
                        className={`
                          absolute left-16 top-0 z-50
                          py-2 px-2 rounded bg-gray-800 text-white text-sm
                          min-w-40
                        `}
                      >
                        <div className="font-medium mb-1 pb-1 border-b border-gray-700">{item.name}</div>
                        <div className="space-y-1">
                          {item.subItems.map((subItem) => {
                            if (subItem.requiredPortal && !hasPaid) return null;
                            const isSubActive = activeItem === subItem.id;
                            
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => handleItemClick(subItem)}
                                className="w-full text-left py-1 px-2 rounded hover:bg-gray-700 text-sm flex items-center"
                              >
                                {subItem.icon && <subItem.icon active={isSubActive} size={16} className="mr-2" />}
                                <span>{subItem.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className={`p-4 border-t ${themeClasses.border}`}>
          {(isExpanded || isMobile) ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${themeClasses.iconBg} flex items-center justify-center`}>
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-md ${themeClasses.item} transition-colors`}
                  aria-label="Toggle theme"
                >
                  <Sliders size={18} />
                </button>
                
                <button 
                  className={`p-2 rounded-md ${themeClasses.item} transition-colors`}
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            // Collapsed footer with only icons
            <div className="flex flex-col items-center space-y-3">
              <div 
                className={`w-10 h-10 rounded-full ${themeClasses.iconBg} flex items-center justify-center`}
                onMouseEnter={() => setHoveredItem('user')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <User size={18} className="text-gray-500" />
                {hoveredItem === 'user' && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={tooltipVariants}
                    className="absolute left-16 z-50 py-1 px-2 rounded bg-gray-800 text-white text-sm whitespace-nowrap"
                  >
                    John Doe (Administrator)
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-md ${themeClasses.item} transition-colors`}
                  aria-label="Toggle theme"
                  onMouseEnter={() => setHoveredItem('theme')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Sliders size={18} />
                  {hoveredItem === 'theme' && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={tooltipVariants}
                      className="absolute left-16 z-50 py-1 px-2 rounded bg-gray-800 text-white text-sm whitespace-nowrap"
                    >
                      Toggle Theme
                    </motion.div>
                  )}
                </button>
                
                <button 
                  className={`p-2 rounded-md ${themeClasses.item} transition-colors`}
                  aria-label="Sign out"
                  onMouseEnter={() => setHoveredItem('logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <LogOut size={18} />
                  {hoveredItem === 'logout' && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={tooltipVariants}
                      className="absolute left-16 z-50 py-1 px-2 rounded bg-gray-800 text-white text-sm whitespace-nowrap"
                    >
                      Logout
                    </motion.div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ModernSidebar;