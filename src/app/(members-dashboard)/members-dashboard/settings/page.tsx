"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Loader2, User, Mail, Phone, Building2, GraduationCap, MapPin, Home, Globe, Briefcase, Settings } from 'lucide-react';
import { showToast } from '@/utils/toast';

interface UserDetails {
  user_id: string;
  f_name: string;
  m_name: string;
  l_name: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  whatsapp_no: string;
  area_of_specialization: string;
  profession: string;
  postal_addr: string;
  residential_addr: string;
  type: string;
  role: string;
}

export default function AccountSettings() {
  const { data: session, update } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    fetchUserDetails();
  }, [session]);

  const fetchUserDetails = async () => {
    if (!bearerToken) return;

    try {
      setIsFetching(true);
      const response = await fetch(
        `${API_URL}/view_profile_details`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user details');

      const data = await response.json();
      setUserDetails(data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showToast.error('Failed to load user details');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/edit_profile_data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          f_name: userDetails.f_name,
          m_name: userDetails.m_name,
          l_name: userDetails.l_name,
          phone: userDetails.phone,
          institution: userDetails.institution,
          whatsapp_no: userDetails.whatsapp_no,
          area_of_specialization: userDetails.area_of_specialization,
          profession: userDetails.profession,
          postal_addr: userDetails.postal_addr,
          residential_addr: userDetails.residential_addr,
          type: userDetails.type,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      showToast.success('Profile updated successfully');
      await fetchUserDetails(); // Refresh user details
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#203A87] mx-auto mb-4" />
          <p className="text-[#0B142F] font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1A3D]/5 via-[#203A87]/5 to-[#D5B93C]/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-4">
            <Settings className="w-6 h-6 text-[#203A87]" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0E1A3D] via-[#203A87] to-[#D5B93C] bg-clip-text text-transparent">
              Account Settings
            </h1>
          </div>
          <p className="text-[#0B142F] max-w-md mx-auto">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Avatar Section */}
          <div className="relative bg-gradient-to-r from-[#0E1A3D] via-[#203A87] to-[#D5B93C] p-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-end justify-center">
              <div className="relative">
                <Avatar className="w-36 h-36 rounded-full border-6 border-white shadow-2xl bg-white">
                  <AvatarImage
                    src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${userDetails?.name}`}
                    alt={userDetails?.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#0E1A3D]/10 to-[#203A87]/10 text-4xl font-bold text-[#0E1A3D]">
                    {userDetails?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-[#D5B93C] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <h2 className="text-2xl font-bold text-white mb-2">{userDetails?.name}</h2>
              <p className="text-[#D5B93C] font-medium">{userDetails?.type} Member</p>
            </div>
          </div>

          <div className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-[#0E1A3D] to-[#203A87] rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B142F]">Personal Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="f_name" className="text-sm font-medium text-[#0B142F] mb-2 block">First Name</Label>
                      <Input
                        id="f_name"
                        value={userDetails?.f_name || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, f_name: e.target.value }))}
                        className="border-gray-200 focus:border-[#203A87] focus:ring-[#203A87] transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="m_name" className="text-sm font-medium text-[#0B142F] mb-2 block">Middle Name</Label>
                      <Input
                        id="m_name"
                        value={userDetails?.m_name || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, m_name: e.target.value }))}
                        className="border-gray-200 focus:border-[#203A87] focus:ring-[#203A87] transition-colors"
                        placeholder="Enter your middle name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="l_name" className="text-sm font-medium text-[#0B142F] mb-2 block">Last Name</Label>
                      <Input
                        id="l_name"
                        value={userDetails?.l_name || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, l_name: e.target.value }))}
                        className="border-gray-200 focus:border-[#203A87] focus:ring-[#203A87] transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-[#0B142F] mb-2 block">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userDetails?.email || ''}
                        disabled
                        className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-[#D5B93C] to-[#c4aa36] rounded-lg">
                      <Phone className="w-5 h-5 text-[#0E1A3D]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B142F]">Contact Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-[#0B142F] mb-2 block">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userDetails?.phone || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, phone: e.target.value }))}
                        className="border-gray-200 focus:border-[#D5B93C] focus:ring-[#D5B93C] transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp_no" className="text-sm font-medium text-[#0B142F] mb-2 block">WhatsApp Number</Label>
                      <Input
                        id="whatsapp_no"
                        value={userDetails?.whatsapp_no || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, whatsapp_no: e.target.value }))}
                        className="border-gray-200 focus:border-[#D5B93C] focus:ring-[#D5B93C] transition-colors"
                        placeholder="Enter your WhatsApp number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-[#0B142F] mb-2 block">Country</Label>
                      <Input
                        id="country"
                        value={userDetails?.country || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, country: e.target.value }))}
                        className="border-gray-200 focus:border-[#D5B93C] focus:ring-[#D5B93C] transition-colors"
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </div>
                {/* Professional Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-[#203A87] to-[#152a61] rounded-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B142F]">Professional Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="institution" className="text-sm font-medium text-[#0B142F] mb-2 block">Institution</Label>
                      <Input
                        id="institution"
                        value={userDetails?.institution || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, institution: e.target.value }))}
                        className="border-gray-200 focus:border-[#203A87] focus:ring-[#203A87] transition-colors"
                        placeholder="Enter your institution"
                      />
                    </div>

                    <div>
                      <Label htmlFor="profession" className="text-sm font-medium text-[#0B142F] mb-2 block">Profession</Label>
                      <Input
                        id="profession"
                        value={userDetails?.profession || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, profession: e.target.value }))}
                        className="border-gray-200 focus:border-[#203A87] focus:ring-[#203A87] transition-colors"
                        placeholder="Enter your profession"
                      />
                    </div>

                    <div>
                      <Label htmlFor="area_of_specialization" className="text-sm font-medium text-[#0B142F] mb-2 block">Area of Specialization</Label>
                      <Input
                        id="area_of_specialization"
                        value={userDetails?.area_of_specialization || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, area_of_specialization: e.target.value }))}
                        className="border-gray-200 focus:border-[#203A87] focus:ring-[#203A87] transition-colors"
                        placeholder="Enter your specialization"
                      />
                    </div>
                  </div>
                </div>
                {/* Address Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-[#0E1A3D] to-[#203A87] rounded-lg">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B142F]">Address Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="postal_addr" className="text-sm font-medium text-[#0B142F] mb-2 block">Postal Address</Label>
                      <textarea
                        id="postal_addr"
                        value={userDetails?.postal_addr || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, postal_addr: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] transition-colors resize-none"
                        rows={3}
                        placeholder="Enter your postal address"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="residential_addr" className="text-sm font-medium text-[#0B142F] mb-2 block">Residential Address</Label>
                      <textarea
                        id="residential_addr"
                        value={userDetails?.residential_addr || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev!, residential_addr: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] transition-colors resize-none"
                        rows={3}
                        placeholder="Enter your residential address"
                      />
                    </div>
                  </div>
                </div>
            </div>
              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#0E1A3D] via-[#203A87] to-[#D5B93C] hover:from-[#152a61] hover:via-[#1a2a5a] hover:to-[#c4aa36] text-white px-12 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-3 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}