"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Users, 
  Mic, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Clock,
  FileText,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatCard {
  id: number;
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: 'positive' | 'negative';
  description: string;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatCard[]>([
    { 
      id: 1, 
      name: 'Total Members', 
      value: '0', 
      icon: Users, 
      change: '+0%', 
      changeType: 'positive',
      description: 'Registered members'
    },
    { 
      id: 2, 
      name: 'Total Speakers', 
      value: '0', 
      icon: Mic, 
      change: '+0%', 
      changeType: 'positive',
      description: 'Active speakers'
    },
    { 
      id: 3, 
      name: 'Total Conferences', 
      value: '0', 
      icon: Calendar, 
      change: '+0%', 
      changeType: 'positive',
      description: 'Upcoming conferences'
    },
    { 
      id: 4, 
      name: 'Total Seminars', 
      value: '0', 
      icon: BookOpen, 
      change: '+0%', 
      changeType: 'positive',
      description: 'Training seminars'
    },
    { 
      id: 5, 
      name: 'Conference Participants', 
      value: '0', 
      icon: Users, 
      change: '+0%', 
      changeType: 'positive',
      description: 'Conference attendees'
    },
    { 
      id: 6, 
      name: 'Seminar Participants', 
      value: '0', 
      icon: Users, 
      change: '+0%', 
      changeType: 'positive',
      description: 'Seminar attendees'
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, membersRes, conferencesRes, seminarsRes, confParticipantsRes, seminarParticipantsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/speaker`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/conference_member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/seminar_member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          })
        ]);

        const [speakersData, membersData, conferencesData, seminarsData, confParticipantsData, seminarParticipantsData] = await Promise.all([
          speakersRes.json(),
          membersRes.json(),
          conferencesRes.json(),
          seminarsRes.json(),
          confParticipantsRes.json(),
          seminarParticipantsRes.json()
        ]);

        setStats([
          { 
            id: 1, 
            name: 'Total Members', 
            value: membersData.data?.length.toString() || '0', 
            icon: Users, 
            change: '+12%', 
            changeType: 'positive',
            description: 'Registered members'
          },
          { 
            id: 2, 
            name: 'Total Speakers', 
            value: speakersData.data?.length.toString() || '0', 
            icon: Mic, 
            change: '+8%', 
            changeType: 'positive',
            description: 'Active speakers'
          },
          { 
            id: 3, 
            name: 'Total Conferences', 
            value: conferencesData.data?.length.toString() || '0', 
            icon: Calendar, 
            change: '+15%', 
            changeType: 'positive',
            description: 'Upcoming conferences'
          },
          { 
            id: 4, 
            name: 'Total Seminars', 
            value: seminarsData.data?.length.toString() || '0', 
            icon: BookOpen, 
            change: '+5%', 
            changeType: 'positive',
            description: 'Training seminars'
          },
          { 
            id: 5, 
            name: 'Conference Participants', 
            value: confParticipantsData.data?.length.toString() || '0', 
            icon: Users, 
            change: '+20%', 
            changeType: 'positive',
            description: 'Conference attendees'
          },
          { 
            id: 6, 
            name: 'Seminar Participants', 
            value: seminarParticipantsData.data?.length.toString() || '0', 
            icon: Users, 
            change: '+10%', 
            changeType: 'positive',
            description: 'Seminar attendees'
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchData();
    }
  }, [session]);

  const StatCard = ({ stat }: { stat: StatCard }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {stat.name}
        </CardTitle>
        <stat.icon className="h-4 w-4 text-[#0E1A3D]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#0E1A3D]">
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            stat.value
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stat.description}
        </p>
        <div className="flex items-center mt-2">
          <TrendingUp className={`h-3 w-3 ${
            stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          }`} />
          <span className={`text-xs ml-1 ${
            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change} from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href }: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#0E1A3D]/10 rounded-lg group-hover:bg-[#0E1A3D]/20 transition-colors">
            <Icon className="h-6 w-6 text-[#0E1A3D]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#0E1A3D]">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1A3D]">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session?.user?.userData?.name || 'Admin'} 👋
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.id * 0.1 }}
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[#0E1A3D] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add Member"
            description="Register a new member"
            icon={Users}
            href="/admin-dashboard/membership/directory"
          />
          <QuickActionCard
            title="Create Conference"
            description="Schedule a new conference"
            icon={Calendar}
            href="/admin-dashboard/conferences"
          />
          <QuickActionCard
            title="Post Announcement"
            description="Send an announcement"
            icon={Bell}
            href="/admin-dashboard/announcement"
          />
          <QuickActionCard
            title="Upload Resources"
            description="Add new resources"
            icon={FileText}
            href="/admin-dashboard/membership/members-resources"
          />
          <QuickActionCard
            title="Manage Schedule"
            description="Update conference schedule"
            icon={Clock}
            href="/admin-dashboard/conferences/conference-schedule"
          />
          <QuickActionCard
            title="View Payments"
            description="Check payment status"
            icon={TrendingUp}
            href="/admin-dashboard/payment"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-[#0E1A3D] mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New member registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Conference schedule updated</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New announcement posted</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 