'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import * as Toggle from '@radix-ui/react-toggle';
import { Loader2, Mail, Lock, User, Smartphone, Globe, Bell } from 'lucide-react';
import { toast } from 'sonner';
import * as Select from '@radix-ui/react-select';

export default function AccountSettings() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
    bio: session?.user?.bio || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    newsletter: true,
    language: 'en'
  });
  
  const [isLoading, setIsLoading] = useState({
    profile: false,
    password: false,
    preferences: false
  });
  
  const [activeTab, setActiveTab] = useState('profile');

  // Handler functions
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (name: string, value: any) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, profile: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileForm.name,
          bio: profileForm.bio,
          phone: profileForm.phone
        }
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(prev => ({ ...prev, password: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, preferences: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(prev => ({ ...prev, preferences: false }));
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Account Settings</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm md:text-base ${
            activeTab === 'profile' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm md:text-base ${
            activeTab === 'security' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm md:text-base ${
            activeTab === 'preferences' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>
      
      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-3">
                <AvatarImage src={session?.user?.image || ''} className="bg-gray-100" />
                <AvatarFallback className="text-2xl bg-gray-200 text-gray-700">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="text-gray-700 border-gray-300">
                Change Photo
              </Button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="flex-1 space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 mb-1 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="pl-10 text-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-1 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    disabled
                    className="pl-10 bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-gray-700 mb-1 block">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="pl-10 text-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio" className="text-gray-700 mb-1 block">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading.profile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading.profile ? (
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
      )}
      
      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-gray-700 mb-1 block">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="pl-10 text-gray-800"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="newPassword" className="text-gray-700 mb-1 block">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="pl-10 text-gray-800"
                required
                minLength={8}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 mb-1 block">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="pl-10 text-gray-800"
                required
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isLoading.password}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading.password ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </div>
        </form>
      )}
      
      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-gray-800">
              <Bell className="h-5 w-5 text-gray-700" />
              Notifications
            </h3>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="notifications" className="text-gray-700">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive email notifications</p>
              </div>
              <Toggle.Root
                id="notifications"
                pressed={preferences.notifications}
                onPressedChange={(pressed) => handlePreferenceChange('notifications', pressed)}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=on]:bg-blue-600 transition-colors"
              >
                <span className="block w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 left-0.5 data-[state=on]:left-[1.375rem] transition-all" />
              </Toggle.Root>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="newsletter" className="text-gray-700">Newsletter</Label>
                <p className="text-sm text-gray-600">Receive our monthly newsletter</p>
              </div>
              <Toggle.Root
                id="newsletter"
                pressed={preferences.newsletter}
                onPressedChange={(pressed) => handlePreferenceChange('newsletter', pressed)}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=on]:bg-blue-600 transition-colors"
              >
                <span className="block w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 left-0.5 data-[state=on]:left-[1.375rem] transition-all" />
              </Toggle.Root>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-gray-800">
              <Globe className="h-5 w-5 text-gray-700" />
              Language & Appearance
            </h3>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label htmlFor="language" className="text-gray-700 mb-2 block">Language</Label>
              <Select.Root
                value={preferences.language}
                onValueChange={(value) => handlePreferenceChange('language', value)}
              >
                <Select.Trigger className="inline-flex items-center justify-between w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-800">
                  <Select.Value placeholder="Select a language" />
                  <Select.Icon className="text-gray-500" />
                </Select.Trigger>
                <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <Select.Viewport className="p-1">
                    <Select.Item value="en" className="text-sm rounded px-3 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                      English
                    </Select.Item>
                    <Select.Item value="es" className="text-sm rounded px-3 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Spanish
                    </Select.Item>
                    <Select.Item value="fr" className="text-sm rounded px-3 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                      French
                    </Select.Item>
                    <Select.Item value="de" className="text-sm rounded px-3 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                      German
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="darkMode" className="text-gray-700">Dark Mode</Label>
                <p className="text-sm text-gray-600">Toggle dark theme</p>
              </div>
              <Toggle.Root
                id="darkMode"
                pressed={preferences.darkMode}
                onPressedChange={(pressed) => handlePreferenceChange('darkMode', pressed)}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=on]:bg-blue-600 transition-colors"
              >
                <span className="block w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 left-0.5 data-[state=on]:left-[1.375rem] transition-all" />
              </Toggle.Root>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isLoading.preferences}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading.preferences ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}