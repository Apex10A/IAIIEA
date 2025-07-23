"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/utils/toast';
import MembersCertificate from '@/app/(members-dashboard)/members-dashboard/members-certificate/page';

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
  const { data: session } = useSession();
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
      await fetchUserDetails();
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
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-full bg-white rounded shadow p-8">
        <MembersCertificate />
        <h1 className="text-2xl font-bold mb-2 text-center">Account Settings</h1>
        <p className="text-gray-600 mb-8 text-center">Update your personal information below.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="f_name">First Name</Label>
            <Input
              id="f_name"
              value={userDetails?.f_name || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, f_name: e.target.value }))}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <Label htmlFor="m_name">Middle Name</Label>
            <Input
              id="m_name"
              value={userDetails?.m_name || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, m_name: e.target.value }))}
              placeholder="Enter your middle name"
            />
          </div>
          <div>
            <Label htmlFor="l_name">Last Name</Label>
            <Input
              id="l_name"
              value={userDetails?.l_name || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, l_name: e.target.value }))}
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userDetails?.email || ''}
              disabled
              className="bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={userDetails?.phone || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <Label htmlFor="whatsapp_no">WhatsApp Number</Label>
            <Input
              id="whatsapp_no"
              value={userDetails?.whatsapp_no || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, whatsapp_no: e.target.value }))}
              placeholder="Enter your WhatsApp number"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={userDetails?.country || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, country: e.target.value }))}
              placeholder="Enter your country"
            />
          </div>
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={userDetails?.institution || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, institution: e.target.value }))}
              placeholder="Enter your institution"
            />
          </div>
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={userDetails?.profession || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, profession: e.target.value }))}
              placeholder="Enter your profession"
            />
          </div>
          <div>
            <Label htmlFor="area_of_specialization">Area of Specialization</Label>
            <Input
              id="area_of_specialization"
              value={userDetails?.area_of_specialization || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, area_of_specialization: e.target.value }))}
              placeholder="Enter your specialization"
            />
          </div>
          <div>
            <Label htmlFor="postal_addr">Postal Address</Label>
            <textarea
              id="postal_addr"
              value={userDetails?.postal_addr || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, postal_addr: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              rows={2}
              placeholder="Enter your postal address"
            />
          </div>
          <div>
            <Label htmlFor="residential_addr">Residential Address</Label>
            <textarea
              id="residential_addr"
              value={userDetails?.residential_addr || ''}
              onChange={(e) => setUserDetails(prev => ({ ...prev!, residential_addr: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              rows={2}
              placeholder="Enter your residential address"
            />
          </div>
          <div className="pt-4 flex justify-center">
            <Button type="submit" disabled={isLoading} className="w-full max-w-xs">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}