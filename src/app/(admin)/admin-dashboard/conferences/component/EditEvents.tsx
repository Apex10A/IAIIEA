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
  speaker_id?: number;
  name: string;
  title?: string;
  portfolio?: string;
  picture?: string;
}

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  sub_theme?: string[];
  work_shop?: string[];
  important_date: string[];
  flyer?: string;
  gallery?: string[];
  sponsors?: string[];
  videos?: string[];
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
  speakers?: Speaker[];
}

interface EditConferenceModalProps {
  conference: Conference;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const ROLES = [
  "Workshop Facilitator",
  "Key Note Address",
  "Guest Speaker"
];

const EditConferenceModal: React.FC<EditConferenceModalProps> = ({ 
  conference, 
  onSuccess,
  trigger 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
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
    subthemes_input: [],
    workshops_input: [],
    important_date: [],
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

    // Only initialize when conference data is available
    if (conference) {
      console.log('Initializing with conference data:', conference);
      
      const newFormData: Partial<FormData> = {
        title: conference.title,
        theme: conference.theme,
        venue: conference.venue,
        start: conference.start_date ? `${conference.start_date}T${conference.start_time || '00:00'}` : '',
        end: conference.end_date ? `${conference.end_date}T${conference.end_time || '00:00'}` : '',
        subthemes_input: Array.isArray(conference.sub_theme) ? conference.sub_theme : [],
        workshops_input: conference.work_shop || [],
        important_date: conference.important_date || [],
        basic_naira: conference.payments?.basic?.physical?.naira || '',
        basic_usd: conference.payments?.basic?.physical?.usd || '',
        basic_package: conference.payments?.basic?.package || [],
        premium_naira: conference.payments?.premium?.physical?.naira || '',
        premium_usd: conference.payments?.premium?.physical?.usd || '',
        premium_package: conference.payments?.premium?.package || [],
        standard_naira: conference.payments?.standard?.physical?.naira || '',
        standard_usd: conference.payments?.standard?.physical?.usd || '',
        standard_package: conference.payments?.standard?.package || [],
        selectedSpeakers: conference.speakers?.map(speaker => ({
          speaker_id: speaker.speaker_id || 0,
          occupation: speaker.portfolio || ''
        })) || []
      };

      // Handle file fields
      if (conference.flyer) {
        newFormData.flyer = {
          file: new File([], conference.flyer.split('/').pop() || 'flyer.jpg'),
          preview: conference.flyer,
          name: conference.flyer.split('/').pop() || 'flyer.jpg',
          size: 0,
          type: 'image'
        };
      }

      if (conference.gallery?.length) {
        newFormData.gallery = conference.gallery.map(url => ({
          file: new File([], url.split('/').pop() || 'gallery.jpg'),
          preview: url,
          name: url.split('/').pop() || 'gallery.jpg',
          size: 0,
          type: 'image'
        }));
      }

      if (conference.sponsors?.length) {
        newFormData.sponsors = conference.sponsors.map(url => ({
          file: new File([], url.split('/').pop() || 'sponsor.jpg'),
          preview: url,
          name: url.split('/').pop() || 'sponsor.jpg',
          size: 0,
          type: 'image'
        }));
      }

      if (conference.videos?.length) {
        newFormData.videos = conference.videos.map(url => ({
          file: new File([], url.split('/').pop() || 'video.mp4'),
          preview: url,
          name: url.split('/').pop() || 'video.mp4',
          size: 0,
          type: 'video'
        }));
      }

      setFormData(prev => ({
        ...prev,
        ...newFormData
      }));
    }
  }, [conference]);

  // Cleanup function
  useEffect(() => {
    return () => {
      const { flyer, gallery, sponsors, videos } = formData;
      if (flyer) URL.revokeObjectURL(flyer.preview);
      gallery.forEach(file => URL.revokeObjectURL(file.preview));
      sponsors.forEach(file => URL.revokeObjectURL(file.preview));
      videos.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [formData.flyer, formData.gallery, formData.sponsors, formData.videos]);

useEffect(() => {
  console.log('Current formData:', formData);
}, [formData]);
useEffect(() => {
  console.log('Conference prop changed:', conference);
  if (conference) {
    console.log('Subthemes from API:', conference.sub_theme);
    console.log('Workshops from API:', conference.work_shop);
    console.log('Important dates from API:', conference.important_date);
  }
}, [conference]);

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

    const newFiles = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type.split('/')[0]
    }));

    if (field === 'flyer') {
      if (formData.flyer) {
        URL.revokeObjectURL(formData.flyer.preview);
      }
      setFormData(prev => ({ 
        ...prev, 
        [field]: newFiles[0] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [field]: [...prev[field], ...newFiles] 
      }));
    }
  };

  const removeFile = (field: 'gallery' | 'sponsors' | 'videos', index: number) => {
    setFormData(prev => {
      const updatedFiles = [...prev[field]];
      URL.revokeObjectURL(updatedFiles[index].preview);
      updatedFiles.splice(index, 1);
      return { ...prev, [field]: updatedFiles };
    });
  };

  const clearAllFiles = (field: 'gallery' | 'sponsors' | 'videos') => {
    setFormData(prev => {
      prev[field].forEach(file => URL.revokeObjectURL(file.preview));
      return { ...prev, [field]: [] };
    });
  };

  const handleStepOneSubmit = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('theme', formData.theme);
    formDataToSend.append('venue', formData.venue);
    formDataToSend.append('start', formData.start);
    formDataToSend.append('end', formData.end);
    formDataToSend.append('subthemes_input', JSON.stringify(formData.subthemes_input));
    formDataToSend.append('workshops_input', JSON.stringify(formData.workshops_input));
    formDataToSend.append('important_date', JSON.stringify(
      formData.important_date.reduce((acc, curr) => {
        const [key, value] = curr.split(': ');
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      }, {} as Record<string, string>)
    ));
    
    if (formData.flyer && formData.flyer.file.size > 0) {
      formDataToSend.append('flyer', formData.flyer.file);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit_conference/${conference.id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setCurrentStep(2);
      } else {
        showToast.error(data.message || 'Failed to update conference details');
      }
    } catch (error) {
      console.error('Error submitting step 1:', error);
      showToast.error('Failed to update conference details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async () => {
    setIsLoading(true);
    const formDataToSend = new FormData();
    
    formData.gallery.forEach(file => {
      if (file.file.size > 0) {
        formDataToSend.append('gallery[]', file.file);
      }
    });
    formData.sponsors.forEach(file => {
      if (file.file.size > 0) {
        formDataToSend.append('sponsors[]', file.file);
      }
    });
    formData.videos.forEach(file => {
      if (file.file.size > 0) {
        formDataToSend.append('videos[]', file.file);
      }
    });
    
    formDataToSend.append('basic_naira', formData.basic_naira);
    formDataToSend.append('basic_usd', formData.basic_usd);
    formDataToSend.append('basic_package', JSON.stringify(formData.basic_package));
    formDataToSend.append('premium_naira', formData.premium_naira);
    formDataToSend.append('premium_usd', formData.premium_usd);
    formDataToSend.append('premium_package', JSON.stringify(formData.premium_package));
    formDataToSend.append('standard_naira', formData.standard_naira);
    formDataToSend.append('standard_usd', formData.standard_usd);
    formDataToSend.append('standard_package', JSON.stringify(formData.standard_package));
    
    formDataToSend.append('speakers', JSON.stringify(selectedSpeakers));
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit_conference/${conference.id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      if (data.status === "success") {
        showToast.success('Conference updated successfully');
        onSuccess();
      } else {
        showToast.error(data.message || 'Failed to update conference');
      }
    } catch (error) {
      console.error('Error submitting step 2:', error);
      showToast.error('Failed to update conference details');
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
            {currentStep === 1 ? 'Edit Conference - Basic Details' : 'Edit Conference - Additional Details'}
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
                  <div className="space-y-2">
                    <Label>Upload Flyer Image</Label>
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'flyer')}
                      accept="image/*"
                    />
                    {formData.flyer && (
                      <div className="mt-4 relative group">
                        <div className="aspect-[3/4] w-48 rounded-md overflow-hidden border">
                          <Image
                            src={formData.flyer.preview}
                            alt="Flyer preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {formData.flyer.name} ({formData.flyer.size > 0 ? 
                            `${Math.round(formData.flyer.size / 1024)} KB` : 
                            'Existing file'}
                        </div>
                      </div>
                    )}
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
                <CardContent className="space-y-6">
                  {/* Gallery Images Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Gallery Images</Label>
                      {formData.gallery.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearAllFiles('gallery')}
                          className="text-red-500"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'gallery')}
                      accept="image/*"
                    />
                    {formData.gallery.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {formData.gallery.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-md overflow-hidden border">
                              <Image
                                src={file.preview}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-red-500/80"
                                onClick={() => removeFile('gallery', index)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sponsors Images Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Sponsors Images</Label>
                      {formData.sponsors.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearAllFiles('sponsors')}
                          className="text-red-500"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'sponsors')}
                      accept="image/*"
                    />
                    {formData.sponsors.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {formData.sponsors.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-md overflow-hidden border">
                              <Image
                                src={file.preview}
                                alt={`Sponsor image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-red-500/80"
                                onClick={() => removeFile('sponsors', index)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Videos Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Videos</Label>
                      {formData.videos.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearAllFiles('videos')}
                          className="text-red-500"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'videos')}
                      accept="video/*"
                    />
                    {formData.videos.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {formData.videos.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video rounded-md overflow-hidden border bg-black">
                              {file.type === 'video' ? (
                                <video 
                                  src={file.preview}
                                  className="w-full h-full object-contain"
                                  controls={false}
                                  muted
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-red-500/80"
                                onClick={() => removeFile('videos', index)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
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
                  {isLoading ? 'Updating Conference...' : 'Update Conference'}
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

export default EditConferenceModal;