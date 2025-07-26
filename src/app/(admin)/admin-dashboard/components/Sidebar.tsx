'use client';

import React, { useState, useCallback, memo } from 'react';
import Link from 'next/link';
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

// Memoized navigation item component
const NavItemComponent = memo(({ item, isActive, onClose }: { 
  item: NavItem; 
  isActive: boolean; 
  onClose: () => void;
}) => (
  <Link
    href={item.path}
    onClick={onClose}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
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
));

NavItemComponent.displayName = 'NavItemComponent';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPath, onNavigate, onCollapse }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Overview'])); // Default open
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

  const toggleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse?.(newCollapsedState);
  }, [isCollapsed, onCollapse]);

  const isActive = useCallback((path: string) => currentPath === path, [currentPath]);

  return (
    <>
      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl lg:hidden transform transition-transform duration-200 ease-in-out">
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
                  
                  {expandedGroups.has(group.title) && (
                    <div className="pl-4 space-y-1">
                      {group.items.map((item) => (
                        <NavItemComponent
                          key={item.path}
                          item={item}
                          isActive={isActive(item.path)}
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-80'
        }`}
        style={{ width: isCollapsed ? 64 : 320 }}
      >
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 
              className={`text-xl font-bold text-[#0E1A3D] whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}
            >
              Admin Panel
            </h2>
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navigationGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`flex items-center justify-between w-full p-3 text-left text-sm font-semibold text-gray-600 hover:text-[#0E1A3D] transition-colors ${
                    isCollapsed ? 'opacity-0' : ''
                  }`}
                >
                  {group.title}
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      expandedGroups.has(group.title) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedGroups.has(group.title) && (
                  <div className="pl-4 space-y-1">
                    {group.items.map((item) => (
                      <NavItemComponent
                        key={item.path}
                        item={item}
                        isActive={isActive(item.path)}
                        onClose={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/admin-dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D] transition-colors ${
                isCollapsed ? 'opacity-0' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default memo(Sidebar); 