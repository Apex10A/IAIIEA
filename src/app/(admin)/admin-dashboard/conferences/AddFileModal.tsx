"use client"

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CalendarIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { showToast } from '@/utils/toast';
import ImageUpload from './ImageUpload'
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  // Step 1 data
  title: string;
  theme: string;
  venue: string;
  start: string;
  end: string;
  subthemes_input: string[];
  workshops_input: string[];
  important_date: string[];
  flyer: File | null;
  
  // Step 2 data
  gallery: File[];
  sponsors: File[];
  videos: File[];
  basic_naira: string;
  basic_usd: string;
  basic_package: string[];
  premium_naira: string;
  premium_usd: string;
  premium_package: string[];
  standard_naira: string;
  standard_usd: string;
  standard_package: string[];
  selectedSpeakers: Array<{
    speaker_id: number;
    occupation: string;
  }>;
}

type Speaker = {
  speaker_id: number;
  speaker_name: string;
  speaker_title?: string;
  speaker_picture?: string;
};

const ROLES = [
  "Workshop Facilitator",
  "Key Note Address",
  "Guest Speaker"
];

const AddConferenceModal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [token, setToken] = useState<string>('');
  const [availableSpeakers, setAvailableSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState<FormData['selectedSpeakers']>([]); 
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    theme: '',
    venue: '',
    start: '',
    end: '',
    subthemes_input: [''],
    workshops_input: [''],
    important_date: [''],
    flyer: null,
    gallery: [],
    sponsors: [],
    videos: [],
    basic_naira: '',
    basic_usd: '',
    basic_package: [],
    premium_naira: '',
    premium_usd: '',
    premium_package: [],
    standard_naira: '',
    standard_usd: '',
    standard_package: [],
    selectedSpeakers: []
  });

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speakers_list`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data = await response.json();
      if (data.status === "success") {
        setAvailableSpeakers(data.data);
      }
    } catch (error) {
      console.error('Error fetching speakers:', error);
      showToast.error('Failed to load speakers');
    }
  };

  const handleSpeakerSelect = (value: string) => {
    const speakerId = Number(value);
    if (!selectedSpeakers.some(s => s.speaker_id === speakerId)) {
      const newSpeaker = {
        speaker_id: speakerId,
        occupation: "Workshop Facilitator"
      };
      setSelectedSpeakers(prev => [...prev, newSpeaker]);
    }
  };

  const handleRoleChange = (index: number, occupation: string) => {
    setSelectedSpeakers(prev => 
      prev.map((s, i) => i === index ? { ...s, occupation } : s)
    );
  };

  const removeSpeaker = (index: number) => {
    setSelectedSpeakers(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (
    field: 'basic_naira' | 'basic_usd' | 'premium_naira' | 'premium_usd' | 'standard_naira' | 'standard_usd',
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePackageItemChange = (
    packageType: 'basic' | 'premium' | 'standard',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newPackage = [...prev[`${packageType}_package`]];
      newPackage[index] = value;
      return { ...prev, [`${packageType}_package`]: newPackage };
    });
  };
  const addPackageItem = (packageType: 'basic' | 'premium' | 'standard') => {
    setFormData(prev => ({
      ...prev,
      [`${packageType}_package`]: [...prev[`${packageType}_package`], '']
    }));
  };
  
  const removePackageItem = (packageType: 'basic' | 'premium' | 'standard', index: number) => {
    setFormData(prev => ({
      ...prev,
      [`${packageType}_package`]: prev[`${packageType}_package`].filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'flyer' | 'gallery' | 'sponsors' | 'videos') => {
    const files = event.target.files;
    if (!files) return;

    if (field === 'flyer') {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [field]: [...Array.from(files)] }));
    }
  };

  const handleStepOneSubmit = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();
    
    // Append all step 1 fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('theme', formData.theme);
    formDataToSend.append('venue', formData.venue);
    formDataToSend.append('start', formData.start);
    formDataToSend.append('end', formData.end);
    formDataToSend.append('subthemes_input', JSON.stringify(formData.subthemes_input));
    formDataToSend.append('workshops_input', JSON.stringify(formData.workshops_input));
    formDataToSend.append('important_date', JSON.stringify(formData.important_date));
    if (formData.flyer) formDataToSend.append('flyer', formData.flyer);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_conference/1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      if (data.status === "success" && data.data?.token) {
        setToken(data.data.token);
        setCurrentStep(2);
      } else {
        showToast.error(data.message || 'Failed to get token from server');
      }
    } catch (error) {
      console.error('Error submitting step 1:', error);
      showToast.error('Failed to submit conference details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('token', token);
    
    // Append media files
    formData.gallery.forEach(file => formDataToSend.append('gallery[]', file));
    formData.sponsors.forEach(file => formDataToSend.append('sponsors[]', file));
    formData.videos.forEach(file => formDataToSend.append('videos[]', file));
    
    // Append payment data in the flat structure the backend expects
    formDataToSend.append('basic_naira', formData.basic_naira);
    formDataToSend.append('basic_usd', formData.basic_usd);
    formDataToSend.append('basic_package', JSON.stringify(formData.basic_package));
    formDataToSend.append('premium_naira', formData.premium_naira);
    formDataToSend.append('premium_usd', formData.premium_usd);
    formDataToSend.append('premium_package', JSON.stringify(formData.premium_package));
    formDataToSend.append('standard_naira', formData.standard_naira);
    formDataToSend.append('standard_usd', formData.standard_usd);
    formDataToSend.append('standard_package', JSON.stringify(formData.standard_package));
    
    // Append speakers
    formDataToSend.append('speakers', JSON.stringify(selectedSpeakers));
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_conference/2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      if (data.status === "success") {
        showToast.success('Conference created successfully');
        // Close modal or reset form here
      } else {
        showToast.error(data.message || 'Failed to create conference');
      }
    } catch (error) {
      console.error('Error submitting step 2:', error);
      showToast.error('Failed to submit conference details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="bg-[#203a87] hover:bg-[#1a2f6d]">
          Add New Conference
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50 overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4 text-[#000]">
            {currentStep === 1 ? 'Create Conference - Basic Details' : 'Create Conference - Additional Details'}
          </Dialog.Title>
          
          {currentStep === 1 ? (
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Conference Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter conference title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Input
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      placeholder="Enter conference theme"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="Enter venue location"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Date & Time</Label>
                      <Input
                        id="start"
                        type="datetime-local"
                        value={formData.start}
                        onChange={(e) => handleInputChange('start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Date & Time</Label>
                      <Input
                        id="end"
                        type="datetime-local"
                        value={formData.end}
                        onChange={(e) => handleInputChange('end', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subthemes Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Subthemes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.subthemes_input.map((subtheme, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={subtheme}
                        onChange={(e) => {
                          const newSubthemes = [...formData.subthemes_input];
                          newSubthemes[index] = e.target.value;
                          handleInputChange('subthemes_input', newSubthemes);
                        }}
                        placeholder="Enter subtheme"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newSubthemes = formData.subthemes_input.filter((_, i) => i !== index);
                          handleInputChange('subthemes_input', newSubthemes);
                        }}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleInputChange('subthemes_input', [...formData.subthemes_input, ''])}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Subtheme
                  </Button>
                </CardContent>
              </Card>

              {/* Workshops Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Workshops</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.workshops_input.map((workshop, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={workshop}
                        onChange={(e) => {
                          const newWorkshops = [...formData.workshops_input];
                          newWorkshops[index] = e.target.value;
                          handleInputChange('workshops_input', newWorkshops);
                        }}
                        placeholder="Enter workshop title"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newWorkshops = formData.workshops_input.filter((_, i) => i !== index);
                          handleInputChange('workshops_input', newWorkshops);
                        }}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleInputChange('workshops_input', [...formData.workshops_input, ''])}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Workshop
                  </Button>
                </CardContent>
              </Card>

              {/* Important Dates Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.important_date.map((date, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={date}
                        onChange={(e) => {
                          const newDates = [...formData.important_date];
                          newDates[index] = e.target.value;
                          handleInputChange('important_date', newDates);
                        }}
                        placeholder="e.g., Abstract Submission 2024-05-01"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newDates = formData.important_date.filter((_, i) => i !== index);
                          handleInputChange('important_date', newDates);
                        }}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleInputChange('important_date', [...formData.important_date, ''])}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Important Date
                  </Button>
                </CardContent>
              </Card>

              {/* Flyer Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Flyer</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload 
                    onFileChange={(files: File[]) => {
                      const syntheticEvent = {
                        target: {
                          files: (() => {
                            const dataTransfer = new DataTransfer();
                            files.forEach(file => dataTransfer.items.add(file));
                            return dataTransfer.files;
                          })()
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleFileChange(syntheticEvent, 'flyer');
                    }} 
                  />
                  {formData.flyer && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {formData.flyer.name}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <Button variant="outline" className='text-[#000]'>
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  onClick={handleStepOneSubmit}
                  disabled={isLoading}
                  className="bg-[#203a87] hover:bg-[#1a2f6d]"
                >
                  {isLoading ? 'Processing...' : 'Next Step'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Media Upload Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Media Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Gallery Images</Label>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'gallery')}
                      accept="image/*"
                    />
                    {formData.gallery.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {formData.gallery.length} file(s) selected
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sponsors Images</Label>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'sponsors')}
                      accept="image/*"
                    />
                    {formData.sponsors.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {formData.sponsors.length} file(s) selected
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Videos</Label>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'videos')}
                      accept="video/*"
                    />
                    {formData.videos.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {formData.videos.length} file(s) selected
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Packages Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Package */}
                  <div className="border rounded-lg p-4">
  <h4 className="font-medium mb-4">Basic Package</h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="space-y-2">
      <Label>Price (Naira)</Label>
      <Input
        type="number"
        value={formData.basic_naira}
        onChange={(e) => handlePaymentChange('basic_naira', e.target.value)}
        placeholder="Enter Naira price"
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Price (USD)</Label>
      <Input
        type="number"
        value={formData.basic_usd}
        onChange={(e) => handlePaymentChange('basic_usd', e.target.value)}
        placeholder="Enter USD price"
        required
      />
    </div>
  </div>
  
  <div className="space-y-2">
    <Label>Package Inclusions</Label>
    {formData.basic_package.map((item, index) => (
      <div key={index} className="flex gap-2 items-center">
        <Input
          value={item}
          onChange={(e) => handlePackageItemChange('basic', index, e.target.value)}
          placeholder="Enter package item"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removePackageItem('basic', index)}
        >
          <TrashIcon className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    ))}
    <Button
      variant="outline"
      onClick={() => addPackageItem('basic')}
    >
      <PlusIcon className="w-4 h-4 mr-2" />
      Add Package Item
    </Button>
  </div>
</div>

<div className="border rounded-lg p-4">
  <h4 className="font-medium mb-4">Standard Package</h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="space-y-2">
      <Label>Price (Naira)</Label>
      <Input
        type="number"
        value={formData.standard_naira}
        onChange={(e) => handlePaymentChange('standard_naira', e.target.value)}
        placeholder="Enter Naira price"
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Price (USD)</Label>
      <Input
        type="number"
        value={formData.standard_usd}
        onChange={(e) => handlePaymentChange('standard_usd', e.target.value)}
        placeholder="Enter USD price"
        required
      />
    </div>
  </div>
  
  <div className="space-y-2">
    <Label>Package Inclusions</Label>
    {formData.standard_package.map((item, index) => (
      <div key={index} className="flex gap-2 items-center">
        <Input
          value={item}
          onChange={(e) => handlePackageItemChange('standard', index, e.target.value)}
          placeholder="Enter package item"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removePackageItem('standard', index)}
        >
          <TrashIcon className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    ))}
    <Button
      variant="outline"
      onClick={() => addPackageItem('standard')}
    >
      <PlusIcon className="w-4 h-4 mr-2" />
      Add Package Item
    </Button>
  </div>
</div>


<div className="border rounded-lg p-4">
  <h4 className="font-medium mb-4">Premium Package</h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="space-y-2">
      <Label>Price (Naira)</Label>
      <Input
        type="number"
        value={formData.premium_naira}
        onChange={(e) => handlePaymentChange('premium_naira', e.target.value)}
        placeholder="Enter Naira price"
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Price (USD)</Label>
      <Input
        type="number"
        value={formData.premium_usd}
        onChange={(e) => handlePaymentChange('premium_usd', e.target.value)}
        placeholder="Enter USD price"
        required
      />
    </div>
  </div>
  
  <div className="space-y-2">
    <Label>Package Inclusions</Label>
    {formData.premium_package.map((item, index) => (
      <div key={index} className="flex gap-2 items-center">
        <Input
          value={item}
          onChange={(e) => handlePackageItemChange('premium', index, e.target.value)}
          placeholder="Enter package item"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removePackageItem('premium', index)}
        >
          <TrashIcon className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    ))}
    <Button
      variant="outline"
      onClick={() => addPackageItem('premium')}
    >
      <PlusIcon className="w-4 h-4 mr-2" />
      Add Package Item
    </Button>
  </div>
</div>


                  {/* Standard Package */}
                  {/* <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Standard Package</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Virtual Attendance (USD)</Label>
                        <Input
                          type="number"
                          value={formData.standard_usd}
                          onChange={(e) => handlePackageItemChange('standard', index, e.target.value)}
                          placeholder="Enter USD price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Virtual Attendance (Naira)</Label>
                        <Input
                          type="number"
                          value={formData.standard_naira}
                          onChange={(e) => handlePackageItemChange('standard', index, e.target.value)}
                          placeholder="Enter Naira price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Physical Attendance (USD)</Label>
                        <Input
                          type="number"
                          value={formData.payments.standard.physical.usd}
                          onChange={(e) => handlePaymentChange('standard', 'physical', 'usd', e.target.value)}
                          placeholder="Enter USD price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Physical Attendance (Naira)</Label>
                        <Input
                          type="number"
                          value={formData.payments.standard.physical.naira}
                          onChange={(e) => handlePaymentChange('standard', 'physical', 'naira', e.target.value)}
                          placeholder="Enter Naira price"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Package Inclusions</Label>
                      {formData.payments.standard.package.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={item}
                            onChange={(e) => handlePackageItemChange('standard', index, e.target.value)}
                            placeholder="Enter package item"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePackageItem('standard', index)}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => addPackageItem('standard')}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Package Item
                      </Button>
                    </div>
                  </div> */}

                  {/* Premium Package */}
                  {/* <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Premium Package</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Virtual Attendance (USD)</Label>
                        <Input
                          type="number"
                          value={formData.payments.premium.virtual.usd}
                          onChange={(e) => handlePaymentChange('premium', 'virtual', 'usd', e.target.value)}
                          placeholder="Enter USD price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Virtual Attendance (Naira)</Label>
                        <Input
                          type="number"
                          value={formData.payments.premium.virtual.naira}
                          onChange={(e) => handlePaymentChange('premium', 'virtual', 'naira', e.target.value)}
                          placeholder="Enter Naira price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Physical Attendance (USD)</Label>
                        <Input
                          type="number"
                          value={formData.payments.premium.physical.usd}
                          onChange={(e) => handlePaymentChange('premium', 'physical', 'usd', e.target.value)}
                          placeholder="Enter USD price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Physical Attendance (Naira)</Label>
                        <Input
                          type="number"
                          value={formData.payments.premium.physical.naira}
                          onChange={(e) => handlePaymentChange('premium', 'physical', 'naira', e.target.value)}
                          placeholder="Enter Naira price"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Package Inclusions</Label>
                      {formData.payments.premium.package.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={item}
                            onChange={(e) => handlePackageItemChange('premium', index, e.target.value)}
                            placeholder="Enter package item"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePackageItem('premium', index)}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => addPackageItem('premium')}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Package Item
                      </Button>
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              {/* Speakers Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Speakers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Speaker</Label>
                    <Select onValueChange={handleSpeakerSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSpeakers.map((speaker) => (
                          <SelectItem
                            key={speaker.speaker_id}
                            value={speaker.speaker_id.toString()}
                            disabled={selectedSpeakers.some(s => s.speaker_id === speaker.speaker_id)}
                          >
                            {speaker.speaker_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {selectedSpeakers.map((selected, index) => {
                      const speaker = availableSpeakers.find(s => s.speaker_id === selected.speaker_id);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{speaker?.speaker_name}</p>
                            <p className="text-sm text-gray-600">{speaker?.speaker_title}</p>
                          </div>
                          <Select
                            value={selected.occupation}
                            onValueChange={(occupation) => handleRoleChange(index, occupation)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSpeaker(index)}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className='text-[#000]'
                >
                  Back
                </Button>
                <Button
                  onClick={handleStepTwoSubmit}
                  disabled={isLoading}
                  className='bg-[#203a87] hover:bg-[#1a2f6d]'
                >
                  {isLoading ? 'Creating Conference...' : 'Create Conference'}
                </Button>
              </div>
            </div>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close"
            >
              <Cross2Icon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddConferenceModal;