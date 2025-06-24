"use client";

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { showToast } from '@/utils/toast';
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
import { FileText, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { SeminarDetails } from './index';

interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  title: string;
  theme: string;
  venue: string;
  start: string;
  end: string;
  mode: string;
  is_free: string;
  subthemes_input: string[];
  workshops_input: string[];
  important_date: string[];
  flyer: FileWithPreview | null;
  gallery: FileWithPreview[];
  sponsors: FileWithPreview[];
  videos: FileWithPreview[];
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

interface Speaker {
  speaker_id: number;
  name: string;
  title?: string;
  portfolio?: string;
  picture?: string;
}

interface EditSeminarModalProps {
  seminar: {
    id: number;
    title: string;
    theme: string;
    venue: string;
    start_date?: string;
    start_time?: string;
    status: string;
    speakers: Array<{
      name: string;
      portfolio?: string;
      picture?: string;
      title?: string;
    }>;
    payments?: {
      basic?: {
        physical?: {
          naira?: string;
          usd?: string;
        };
        package?: string[];
      };
      premium?: {
        physical?: {
          naira?: string;
          usd?: string;
        };
        package?: string[];
      };
      standard?: {
        physical?: {
          naira?: string;
          usd?: string;
        };
        package?: string[];
      };
    };
  };
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

interface SessionUser {
  token?: string;
  userData?: {
    token: string;
  };
}

const ROLES = [
  "Workshop Facilitator",
  "Key Note Address",
  "Guest Speaker"
];

const EditSeminarModal: React.FC<EditSeminarModalProps> = ({ 
  seminar, 
  onSuccess,
  trigger 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [availableSpeakers, setAvailableSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState<FormData['selectedSpeakers']>([]); 
  const { data: session } = useSession();
  const bearerToken = (session?.user as SessionUser)?.token || (session?.user as SessionUser)?.userData?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [stepOneToken, setStepOneToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    theme: '',
    venue: '',
    start: '',
    end: '',
    mode: '',
    is_free: '',
    basic_naira: '',
    basic_usd: '',
    basic_package: [],
    premium_naira: '',
    premium_usd: '',
    premium_package: [],
    standard_naira: '',
    standard_usd: '',
    standard_package: [],
    selectedSpeakers: [],
    subthemes_input: [],
    workshops_input: [],
    important_date: [],
    flyer: null,
    gallery: [],
    sponsors: [],
    videos: []
  });

  // Initialize form data from seminar details
  const initializeFormData = (details: EditSeminarModalProps['seminar']) => {
    const newFormData: FormData = {
      title: details.title || '',
      theme: details.theme || '',
      venue: details.venue || '',
      start: details.start_date ? `${details.start_date}T${details.start_time || '00:00'}` : '',
      end: details.start_date ? `${details.start_date}T${details.start_time || '00:00'}` : '',
      mode: '',
      is_free: '',
      basic_naira: details.payments?.basic?.physical?.naira || '',
      basic_usd: details.payments?.basic?.physical?.usd || '',
      basic_package: details.payments?.basic?.package || [],
      premium_naira: details.payments?.premium?.physical?.naira || '',
      premium_usd: details.payments?.premium?.physical?.usd || '',
      premium_package: details.payments?.premium?.package || [],
      standard_naira: details.payments?.standard?.physical?.naira || '',
      standard_usd: details.payments?.standard?.physical?.usd || '',
      standard_package: details.payments?.standard?.package || [],
      selectedSpeakers: details.speakers?.map(speaker => ({
        speaker_id: availableSpeakers.find(s => s.name === speaker.name)?.speaker_id || 0,
        occupation: speaker.portfolio || 'Workshop Facilitator'
      })) || [],
      subthemes_input: [],
      workshops_input: [],
      important_date: [],
      flyer: null,
      gallery: [],
      sponsors: [],
      videos: []
    };

    setFormData(newFormData);
    setSelectedSpeakers(newFormData.selectedSpeakers);
  };

  // Fetch speakers when component mounts
  useEffect(() => {
    fetchSpeakers();
    if (seminar) {
      initializeFormData(seminar);
    }
  }, [seminar]);

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

  const handleStepOneSubmit = async () => {
    setIsLoading(true);
    
    try {
      const startDate = new Date(formData.start);
      const endDate = new Date(formData.end);
      
      const payload = {
        seminar_id: seminar.id,
        title: formData.title,
        theme: formData.theme,
        venue: formData.venue,
        start: startDate.toISOString().slice(0, 19).replace('T', ' '),
        end: endDate.toISOString().slice(0, 19).replace('T', ' '),
        mode: formData.mode,
        is_free: formData.is_free
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit_seminar/1`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        const token = data.data?.token || data.token;
        if (!token) {
          throw new Error('No token received in response');
        }
        
        setStepOneToken(token);
        localStorage.setItem('editSeminarToken', token);
        
        setCurrentStep(2);
        showToast.success('Basic details updated successfully');
      } else {
        showToast.error(data.message || 'Failed to update seminar details');
      }
    } catch (error) {
      console.error('Error submitting step 1:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to update seminar details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async () => {
    const token = stepOneToken || localStorage.getItem('editSeminarToken');
    
    if (!token) {
      showToast.error('Token from step 1 is required. Please try again.');
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        token,
        basic_naira: Number(formData.basic_naira),
        basic_usd: Number(formData.basic_usd),
        basic_package: formData.basic_package,
        premium_naira: Number(formData.premium_naira),
        premium_usd: Number(formData.premium_usd),
        premium_package: formData.premium_package,
        standard_naira: Number(formData.standard_naira),
        standard_usd: Number(formData.standard_usd),
        standard_package: formData.standard_package,
        speakers: selectedSpeakers
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit_seminar/2`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        localStorage.removeItem('editSeminarToken');
        setStepOneToken(null);
        
        showToast.success('Seminar updated successfully');
        onSuccess();
      } else {
        showToast.error(data.message || 'Failed to update seminar');
      }
    } catch (error) {
      console.error('Error submitting step 2:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to update seminar details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50 overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4 text-[#000]">
            {currentStep === 1 ? 'Edit Seminar - Basic Details' : 'Edit Seminar - Additional Details'}
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
                    <Label htmlFor="title">Seminar Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter seminar title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Input
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      placeholder="Enter seminar theme"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="mode">Mode</Label>
                    <select
                      id="mode"
                      value={formData.mode}
                      onChange={e => handleInputChange('mode', e.target.value)}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="">Select mode</option>
                      <option value="Physical">Physical</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Virtual_Physical">Hybrid (Virtual & Physical)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="is_free">Seminar Type</Label>
                    <select
                      id="is_free"
                      value={formData.is_free}
                      onChange={e => handleInputChange('is_free', e.target.value)}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  
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
                  className="bg-[#203a87] hover:bg-[#1a2f6d] text-white"
                >
                  {isLoading ? 'Processing...' : 'Next Step'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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

                  {/* Standard Package */}
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

                  {/* Premium Package */}
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
                            {speaker.name}
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
                            <p className="font-medium">{speaker?.name}</p>
                            <p className="text-sm text-gray-600">{speaker?.title}</p>
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
                  className='bg-[#203a87] hover:bg-[#1a2f6d] text-white'
                >
                  {isLoading ? 'Updating Seminar...' : 'Update Seminar'}
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

export default EditSeminarModal;