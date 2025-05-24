"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Loader2, User, Mail, Phone, Building2, GraduationCap, MapPin } from 'lucide-react';
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
    if (!bearerToken || !session?.user?.userData?.user_id) return;

    try {
      setIsFetching(true);
      const response = await fetch(
        `${API_URL}/admin/user_details/${session.user.userData.user_id}`,
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
      const response = await fetch(`${API_URL}/admin/update_user`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userDetails.user_id,
          f_name: userDetails.f_name,
          m_name: userDetails.m_name,
          l_name: userDetails.l_name,
          email: userDetails.email,
          phone: userDetails.phone,
          country: userDetails.country,
          institution: userDetails.institution,
          whatsapp_no: userDetails.whatsapp_no,
          area_of_specialization: userDetails.area_of_specialization,
          profession: userDetails.profession,
          postal_addr: userDetails.postal_addr,
          residential_addr: userDetails.residential_addr,
          type: userDetails.type
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-16 left-6">
            <Avatar className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white">
              <AvatarImage
                src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${userDetails?.name}`}
                alt={userDetails?.name}
              />
              <AvatarFallback className="bg-gray-100">
                {userDetails?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
      </div>
      
        <div className="pt-20 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>

                <div>
                  <Label htmlFor="f_name">First Name</Label>
                  <Input
                    id="f_name"
                    value={userDetails?.f_name || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, f_name: e.target.value }))}
                    className="mt-1"
                  />
            </div>
            
              <div>
                  <Label htmlFor="m_name">Middle Name</Label>
                  <Input
                    id="m_name"
                    value={userDetails?.m_name || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, m_name: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="l_name">Last Name</Label>
                  <Input
                    id="l_name"
                    value={userDetails?.l_name || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, l_name: e.target.value }))}
                    className="mt-1"
                  />
              </div>
              
              <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userDetails?.email || ''}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
              
              <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userDetails?.phone || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp_no">WhatsApp Number</Label>
                  <Input
                    id="whatsapp_no"
                    value={userDetails?.whatsapp_no || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, whatsapp_no: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={userDetails?.country || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, country: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Professional Information
                </h3>

                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={userDetails?.institution || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, institution: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={userDetails?.profession || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, profession: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="area_of_specialization">Area of Specialization</Label>
                  <Input
                    id="area_of_specialization"
                    value={userDetails?.area_of_specialization || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, area_of_specialization: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Address Information
                </h3>
              
              <div>
                  <Label htmlFor="postal_addr">Postal Address</Label>
                <textarea
                    id="postal_addr"
                    value={userDetails?.postal_addr || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, postal_addr: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
                <div>
                  <Label htmlFor="residential_addr">Residential Address</Label>
                  <textarea
                    id="residential_addr"
                    value={userDetails?.residential_addr || ''}
                    onChange={(e) => setUserDetails(prev => ({ ...prev!, residential_addr: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
                <Button 
                  type="submit" 
                disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}