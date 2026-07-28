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
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const AGENDA_PLACEHOLDER = `9:00–10:00 → Opening Prayer
10:00–11:00 → Keynote Speech
11:00–12:00 → Panel Discussion`;

interface AddConferenceModalProps {
  onSuccess?: () => void;
}

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
  description: string;
  agenda: string;
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

const AddConferenceModal = ({ onSuccess }: AddConferenceModalProps) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [step2Tab, setStep2Tab] = useState<'media' | 'pricing' | 'speakers'>('media');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
    description: '',
    agenda: '',
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
    if (open) {
      fetchSpeakers();
    }
    return () => {
      ['flyer', 'gallery', 'sponsors', 'videos'].forEach(field => {
        const files = formData[field as keyof FormData];
        if (Array.isArray(files)) {
          files.forEach(file => URL.revokeObjectURL(file.preview));
        } else if (files) {
          URL.revokeObjectURL((files as FileWithPreview).preview);
        }
      });
    };
  }, [open]);

  const resetForm = () => {
    setFormData({
      title: '',
      theme: '',
      venue: '',
      description: '',
      agenda: '',
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
    setSelectedSpeakers([]);
    setCurrentStep(1);
    setStep2Tab('media');
    setFieldErrors({});
    setToken('');
    sessionStorage.removeItem('createConferenceToken');
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.theme.trim()) errors.theme = 'Theme is required';
    if (!formData.venue.trim()) errors.venue = 'Venue is required';
    if (!formData.start) errors.start = 'Start date is required';
    if (!formData.end) errors.end = 'End date is required';
    if (formData.start && formData.end && new Date(formData.end) < new Date(formData.start)) {
      errors.end = 'End must be after start';
    }
    if (!formData.flyer) errors.flyer = 'Flyer image is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
      type: file.type.split('/')[0] // 'image' or 'video'
    }));

    if (field === 'flyer') {
      // Revoke previous flyer URL if exists
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
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(updatedFiles[index].preview);
      updatedFiles.splice(index, 1);
      return { ...prev, [field]: updatedFiles };
    });
  };

  const clearAllFiles = (field: 'gallery' | 'sponsors' | 'videos') => {
    setFormData(prev => {
      // Revoke all object URLs
      prev[field].forEach(file => URL.revokeObjectURL(file.preview));
      return { ...prev, [field]: [] };
    });
  };

  const handleStepOneSubmit = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('theme', formData.theme);
    formDataToSend.append('venue', formData.venue);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('agenda', formData.agenda);
    formDataToSend.append('start', formData.start);
    formDataToSend.append('end', formData.end);
    formDataToSend.append('subthemes_input', JSON.stringify(formData.subthemes_input));
    formDataToSend.append('workshops_input', JSON.stringify(formData.workshops_input));
    formDataToSend.append('important_date', JSON.stringify(formData.important_date));
    if (formData.flyer) formDataToSend.append('flyer', formData.flyer.file);

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
        sessionStorage.setItem('createConferenceToken', data.data.token);
        setCurrentStep(2);
        showToast.success('Basic details saved');
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
    const activeToken = token || sessionStorage.getItem('createConferenceToken') || '';
    if (!activeToken) {
      showToast.error('Session expired. Please complete step 1 again.');
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('token', activeToken);
    
    // Append media files
    formData.gallery.forEach(file => formDataToSend.append('gallery[]', file.file));
    formData.sponsors.forEach(file => formDataToSend.append('sponsors[]', file.file));
    formData.videos.forEach(file => formDataToSend.append('videos[]', file.file));
    
    // Append payment data
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
        resetForm();
        setOpen(false);
        onSuccess?.();
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
    <Dialog.Root open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <Dialog.Trigger asChild>
        <Button className="bg-[#203a87]  hover:bg-[#1a2f6d] text-white text-sm">
          Add New Conference
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div>
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Create Conference
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  Step {currentStep} of 2 — {currentStep === 1 ? 'Basic details' : 'Media, pricing & speakers'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-8 rounded-full ${currentStep >= 1 ? 'bg-[#203a87]' : 'bg-gray-200'}`} />
                <span className={`h-2 w-8 rounded-full ${currentStep >= 2 ? 'bg-[#203a87]' : 'bg-gray-200'}`} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Dialog.Title className="sr-only">
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
                    {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Input
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      placeholder="Enter conference theme"
                    />
                    {fieldErrors.theme && <p className="text-sm text-red-500">{fieldErrors.theme}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="Enter venue location"
                    />
                    {fieldErrors.venue && <p className="text-sm text-red-500">{fieldErrors.venue}</p>}
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
                      {fieldErrors.start && <p className="text-sm text-red-500">{fieldErrors.start}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Date & Time</Label>
                      <Input
                        id="end"
                        type="datetime-local"
                        value={formData.end}
                        onChange={(e) => handleInputChange('end', e.target.value)}
                      />
                      {fieldErrors.end && <p className="text-sm text-red-500">{fieldErrors.end}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief overview of the conference..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agenda">Agenda</Label>
                    <Textarea
                      id="agenda"
                      value={formData.agenda}
                      onChange={(e) => handleInputChange('agenda', e.target.value)}
                      placeholder={AGENDA_PLACEHOLDER}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      One item per line. Format: <span className="font-mono">9:00–10:00 → Opening Prayer</span>
                    </p>
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
                          {formData.flyer.name} ({Math.round(formData.flyer.size / 1024)} KB)
                        </div>
                      </div>
                    )}
                    {fieldErrors.flyer && <p className="text-sm text-red-500">{fieldErrors.flyer}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-gray-200 pb-2">
                {(['media', 'pricing', 'speakers'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStep2Tab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                      step2Tab === tab
                        ? 'bg-[#203a87] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {step2Tab === 'media' && (
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
              )}

              {step2Tab === 'pricing' && (
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
              )}

              {step2Tab === 'speakers' && (
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
              )}

              <div className="flex justify-between gap-3 pt-2">
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
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-6 flex justify-end gap-3">
              {currentStep === 1 && (
                <>
                  <Button variant="outline" onClick={() => setOpen(false)} className="text-gray-900">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStepOneSubmit}
                    disabled={isLoading}
                    className="bg-[#203a87] hover:bg-[#1a2f6d]"
                  >
                    {isLoading ? 'Processing...' : 'Next Step'}
                  </Button>
                </>
              )}
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddConferenceModal;