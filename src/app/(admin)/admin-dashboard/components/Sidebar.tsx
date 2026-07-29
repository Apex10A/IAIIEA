'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
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
  ChevronDown,
  ChevronLeft,
  X,
  UtensilsCrossed,
  Radio,
  Video,
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
      { name: 'Meetings', path: '/admin-dashboard/meetings', icon: Video },
    ],
  },
  {
    title: 'Membership',
    items: [
      { name: 'Directory', path: '/admin-dashboard/membership/directory', icon: Users },
      { name: 'Resources', path: '/admin-dashboard/membership/members-resources', icon: FileText },
    ],
  },
  {
    title: 'Conferences',
    items: [
      { name: 'All Conferences', path: '/admin-dashboard/conferences', icon: Calendar },
      {
        name: 'Conference Participants',
        path: '/admin-dashboard/conferences/participants',
        icon: Users,
      },
      {
        name: 'Schedule',
        path: '/admin-dashboard/conferences/conference-schedule',
        icon: Calendar,
      },
      {
        name: 'Daily Meals',
        path: '/admin-dashboard/conferences/daily-meals',
        icon: UtensilsCrossed,
      },
    ],
  },
  {
    title: 'Training',
    items: [
      { name: 'Seminars', path: '/admin-dashboard/training', icon: FileText },
      {
        name: 'Seminar Participants',
        path: '/admin-dashboard/training/participants',
        icon: Users,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Announcements', path: '/admin-dashboard/announcement', icon: Bell },
      { name: 'Broadcast', path: '/admin-dashboard/broadcast', icon: Radio },
      { name: 'News', path: '/admin-dashboard/news', icon: Newspaper },
      { name: 'Speakers', path: '/admin-dashboard/speakers', icon: Mic },
      { name: 'Gallery', path: '/admin-dashboard/gallery', icon: Image },
      { name: 'Forum', path: '/admin-dashboard/forum', icon: MessageSquare },
    ],
  },
];

export function isNavItemActive(currentPath: string, itemPath: string): boolean {
  if (itemPath === '/admin-dashboard') {
    return currentPath === itemPath;
  }

  if (itemPath === '/admin-dashboard/conferences') {
    return currentPath === itemPath;
  }

  if (itemPath === '/admin-dashboard/training') {
    return currentPath === itemPath;
  }

  if (itemPath === '/admin-dashboard/membership/directory') {
    return (
      currentPath === itemPath ||
      (/^\/admin-dashboard\/membership\/[^/]+$/.test(currentPath) &&
        currentPath !== '/admin-dashboard/membership/members-resources')
    );
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

function getActiveGroupTitle(currentPath: string): string | null {
  for (const group of navigationGroups) {
    if (group.items.some((item) => isNavItemActive(currentPath, item.path))) {
      return group.title;
    }
  }
  return null;
}

const NavItemComponent = memo(
  ({
    item,
    isActive,
    onClose,
    collapsed = false,
  }: {
    item: NavItem;
    isActive: boolean;
    onClose: () => void;
    collapsed?: boolean;
  }) => (
    <Link
      href={item.path}
      onClick={onClose}
      title={collapsed ? item.name : undefined}
      className={`flex items-center gap-3 rounded-lg text-sm transition-colors ${
        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
      } ${
        isActive
          ? 'bg-[#0E1A3D] text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-[#0E1A3D]'
      }`}
    >
      <item.icon className="w-4 h-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="truncate">{item.name}</span>
          {item.badge ? (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </Link>
  )
);

NavItemComponent.displayName = 'NavItemComponent';

const SidebarNav = memo(
  ({
    currentPath,
    onClose,
    expandedGroups,
    toggleGroup,
    collapsed = false,
  }: {
    currentPath: string;
    onClose: () => void;
    expandedGroups: Set<string>;
    toggleGroup: (title: string) => void;
    collapsed?: boolean;
  }) => {
    if (collapsed) {
      return (
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navigationGroups.flatMap((group) =>
            group.items.map((item) => (
              <NavItemComponent
                key={item.path}
                item={item}
                isActive={isNavItemActive(currentPath, item.path)}
                onClose={onClose}
                collapsed
              />
            ))
          )}
        </nav>
      );
    }

    return (
      <nav className="flex-1 overflow-y-auto p-4">
        {navigationGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <button
              type="button"
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
                    isActive={isNavItemActive(currentPath, item.path)}
                    onClose={onClose}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }
);

SidebarNav.displayName = 'SidebarNav';

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPath,
  onCollapse,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(['Overview'])
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const activeGroup = getActiveGroupTitle(currentPath);
    if (!activeGroup) return;

    setExpandedGroups((prev) => {
      if (prev.has(activeGroup)) return prev;
      return new Set([...prev, activeGroup]);
    });
  }, [currentPath]);

  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups((prev) => {
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
    setIsCollapsed((prev) => {
      const next = !prev;
      onCollapse?.(next);
      return next;
    });
  }, [onCollapse]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl lg:hidden transform transition-transform duration-200 ease-in-out">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0E1A3D]">Admin Panel</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <SidebarNav
              currentPath={currentPath}
              onClose={onClose}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
            />
          </div>
        </div>
      )}

      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-80'
        }`}
      >
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2
              className={`text-xl font-bold text-[#0E1A3D] whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? 'sr-only' : 'opacity-100'
              }`}
            >
              Admin Panel
            </h2>
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          <SidebarNav
            currentPath={currentPath}
            onClose={() => {}}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            collapsed={isCollapsed}
          />
        </div>
      </div>

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
