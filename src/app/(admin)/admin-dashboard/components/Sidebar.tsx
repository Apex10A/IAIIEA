'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Bell, 
  Mic, 
  Newspaper, 
  Image, 
  FileText, 
  Settings,
  ChevronDown,
  ChevronLeft,
  X,
  Menu
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onCollapse?: (collapsed: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
      { name: 'Payments', path: '/admin-dashboard/payment', icon: CreditCard },
      { name: 'Calendar', path: '/admin-dashboard/calendar', icon: Calendar },
    ]
  },
  {
    title: 'Membership',
    items: [
      { name: 'Directory', path: '/admin-dashboard/membership/directory', icon: Users },
      { name: 'Resources', path: '/admin-dashboard/membership/members-resources', icon: FileText },
    ]
  },
  {
    title: 'Conferences',
    items: [
      { name: 'All Conferences', path: '/admin-dashboard/conferences', icon: Calendar },
      { name: 'Participants', path: '/admin-dashboard/conferences/participants', icon: Users },
      { name: 'Schedule', path: '/admin-dashboard/conferences/conference-schedule', icon: Calendar },
      { name: 'Daily Meals', path: '/admin-dashboard/conferences/daily-meals', icon: CreditCard },
    ]
  },
  {
    title: 'Training',
    items: [
      { name: 'Seminars', path: '/admin-dashboard/training', icon: FileText },
      { name: 'Participants', path: '/admin-dashboard/training/participants', icon: Users },
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Announcements', path: '/admin-dashboard/announcement', icon: Bell },
      { name: 'News', path: '/admin-dashboard/news', icon: Newspaper },
      { name: 'Speakers', path: '/admin-dashboard/speakers', icon: Mic },
      { name: 'Gallery', path: '/admin-dashboard/gallery', icon: Image },
      { name: 'Forum', path: '/admin-dashboard/forum', icon: MessageSquare },
    ]
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPath, onNavigate, onCollapse }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse?.(newCollapsedState);
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0E1A3D]">Admin Panel</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                {navigationGroups.map((group) => (
                  <div key={group.title} className="mb-6">
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full p-3 text-left text-sm font-semibold text-gray-600 hover:text-[#0E1A3D] transition-colors"
                    >
                      {group.title}
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          expandedGroups.has(group.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expandedGroups.has(group.title) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 space-y-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isActive(item.path)
                                    ? 'bg-[#0E1A3D] text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D]'
                                }`}
                              >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                                {item.badge && (
                                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div 
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-80'
        }`}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 320 }}
      >
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.h2 
                  key="title"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold text-[#0E1A3D] whitespace-nowrap"
                >
                  Admin Panel
                </motion.h2>
              )}
            </AnimatePresence>
            
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navigationGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.button
                      key="group-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full p-3 text-left text-sm font-semibold text-gray-600 hover:text-[#0E1A3D] transition-colors"
                    >
                      {group.title}
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          expandedGroups.has(group.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {(!isCollapsed && expandedGroups.has(group.title)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(item.path)
                                ? 'bg-[#0E1A3D] text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D]'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <AnimatePresence mode="wait">
                              {!isCollapsed && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="whitespace-nowrap"
                                >
                                  {item.name}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {item.badge && !isCollapsed && (
                              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed view - show only icons */}
                {isCollapsed && (
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center justify-center p-3 rounded-lg text-sm transition-colors ${
                          isActive(item.path)
                            ? 'bg-[#0E1A3D] text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D]'
                        }`}
                        title={item.name}
                      >
                        <item.icon className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!isCollapsed ? (
              <Link
                href="/admin-dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D] transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            ) : (
              <Link
                href="/admin-dashboard/settings"
                className="flex items-center justify-center p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D] transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar; 