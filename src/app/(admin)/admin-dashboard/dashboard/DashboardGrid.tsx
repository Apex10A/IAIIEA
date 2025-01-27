import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Plus,
  Utensils,
  Newspaper,
  Settings,
  Upload,
  Megaphone
} from 'lucide-react';

const iconMap = {
  Calendar: Calendar,
  Clock: Clock,
  Plus: Plus,
  Utensils: Utensils,
  Newspaper: Newspaper,
  Settings: Settings,
  Upload: Upload,
  Megaphone: Megaphone

};

interface DashboardItemProps {
  title: string;
  icon: keyof typeof iconMap;
  description: string;
  route?: string;
  onClick?: () => void;
}

const AdminDashboardGrid: React.FC<{ items: DashboardItemProps[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <div 
            key={item.title}
            onClick={item.onClick}
            className="bg-white shadow-md rounded-lg p-6
            hover:shadow-xl transition-all duration-300
            flex flex-col items-start space-y-4 cursor-pointer"
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <Icon className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-600">{item.title}</h3>
              <p className="text-gray-500">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDashboardGrid;