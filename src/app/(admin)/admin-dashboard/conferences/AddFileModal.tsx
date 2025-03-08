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
  selectedSpeakers: number[];
}
type Speaker = {
  speaker_id: number;
  speaker_name: string;
};

type SelectedSpeaker = {
  speaker_id: number;
  occupation: string;
};

const AddConferenceModal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [token, setToken] = useState<string>('');
  const [availableSpeakers, setAvailableSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState<SelectedSpeaker[]>([]); 
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // const handleSpeakerSelect = (value: any) => {
  //   // Add new speaker with default occupation
  //   const newSpeaker = {
  //     speaker_id: Number(value),
  //     occupation: "Workshop Facilitator" // default value, can be changed
  //   };
    
  //   setSelectedSpeakers(prev => [...prev, newSpeaker]);
  //   handleInputChange('selectedSpeakers', [...selectedSpeakers, newSpeaker]);
  // };
  
  const fetchSpeakers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speakers_list`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data = await response.json();
      if (data.status === "success") {
        console.log('Speaker data:', data.data);
        setAvailableSpeakers(data.data);
      }
    } catch (error) {
      console.error('Error fetching speakers:', error);
    }
  };
  const handleSpeakerSelect = (value: string) => {
    const newSpeaker = {
      speaker_id: Number(value),
      occupation: "Workshop Facilitator" // default value
    };
    
    const updatedSpeakers = [...selectedSpeakers, newSpeaker];
    setSelectedSpeakers(updatedSpeakers);
    handleInputChange('selectedSpeakers', updatedSpeakers);
  };

  const handleRoleChange = (index: number, occupation: string) => {
    const updatedSpeakers = selectedSpeakers.map((s, i) => 
      i === index ? { ...s, occupation } : s
    );
    setSelectedSpeakers(updatedSpeakers);
    handleInputChange('selectedSpeakers', updatedSpeakers);
  };

  const removeSpeaker = (index: number) => {
    const updatedSpeakers = selectedSpeakers.filter((_, i) => i !== index);
    setSelectedSpeakers(updatedSpeakers);
    handleInputChange('selectedSpeakers', updatedSpeakers);
  };

  const roles = [
    "Workshop Facilitator",
    "Key Note Address",
    "Guest Speaker"
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'subthemes_input' | 'workshops_input' | 'important_date' | 'basic_package' | 'premium_package' | 'standard_package', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const addArrayItem = (field: 'subthemes_input' | 'workshops_input' | 'important_date' | 'basic_package' | 'premium_package' | 'standard_package',) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'subthemes_input' | 'workshops_input' | 'important_date' | 'basic_package' | 'premium_package' | 'standard_package', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'flyer' | 'gallery' | 'sponsors' | 'videos') => {
      const files = event.target.files as FileList;
      if (!files) return;
  
      if (field === 'flyer') {
        setFormData(prev => ({
          ...prev,
          [field]: files[0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: [...Array.from(files)]
        }));
      }
    };

  const handleStepOneSubmit = async () => {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'flyer' && value) {
        formDataToSend.append(key, value);
      } else if (Array.isArray(value)) {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_conference/1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      console.log('Step 1 Response:', data);
      if (data.status === "success" && data.data?.token) {  // Changed this line
        setToken(data.data.token);  // Changed this line
        setCurrentStep(2);
      } else {
        console.error('No token in response:', data);
        showToast.error('Failed to get token from server');
      }
    } catch (error) {
      console.error('Error submitting step 1:', error);
      showToast.error('Failed to submit conference details');
    }
  };

  const handleStepTwoSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('token', token);
    
    formData.gallery.forEach(file => formDataToSend.append('gallery[]', file));
    formData.sponsors.forEach(file => formDataToSend.append('sponsors[]', file));
    formData.videos.forEach(file => formDataToSend.append('videos[]', file));
    
    formDataToSend.append('basic_naira', formData.basic_naira);
    formDataToSend.append('basic_usd', formData.basic_usd);
    formDataToSend.append('basic_package', JSON.stringify(formData.basic_package));
    formDataToSend.append('premium_naira', formData.premium_naira);
    formDataToSend.append('premium_usd', formData.premium_usd);
    formDataToSend.append('premium_package', JSON.stringify(formData.premium_package));
    formDataToSend.append('standard_naira', formData.standard_naira);
    formDataToSend.append('standard_usd', formData.standard_usd);
    formDataToSend.append('standard_package', JSON.stringify(formData.standard_package));
    formDataToSend.append('speakers', JSON.stringify(formData.selectedSpeakers));
    console.log(token)

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
      }
    } catch (error) {
      console.error('Error submitting step 2:', error);
      showToast.error('Failed to submit conference details');
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-[#203a87] text-white px-4 py-2 rounded-lg text-sm sm:text-base">
          Add New Conference
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[700px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50 overflow-y-auto">
          <Dialog.Title className="text-xl font-medium mb-4">
            {currentStep === 1 ? 'Add Conference - Step 1' : 'Add Conference - Step 2'}
          </Dialog.Title>
          
          {currentStep === 1 ? (
            // Step 1 Form
            <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Basic Information</h3>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-gray-700">Title</label>
                    <input
                      className="col-span-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
      
                  {/* Theme */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-gray-700">Theme</label>
                    <input
                      className="col-span-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                    />
                  </div>
      
                  {/* Venue */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-gray-700">Venue</label>
                    <input
                      className="col-span-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                    />
                  </div>
      
                  {/* Dates */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-gray-700">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="col-span-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.start}
                      onChange={(e) => handleInputChange('start', e.target.value)}
                    />
                  </div>
      
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-gray-700">End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="col-span-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.end}
                      onChange={(e) => handleInputChange('end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
      
            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Additional Details</h3>
      
                {/* Subthemes */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">Subthemes</label>
                  <div className="col-span-3 space-y-2">
                    {formData.subthemes_input.map((subtheme, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={subtheme}
                          onChange={(e) => handleArrayInputChange('subthemes_input', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('subthemes_input', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('subthemes_input')}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Subtheme
                    </button>
                  </div>
                </div>
      
                {/* Workshops */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">Workshops</label>
                  <div className="col-span-3 space-y-2">
                    {formData.workshops_input.map((workshop, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={workshop}
                          onChange={(e) => handleArrayInputChange('workshops_input', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('workshops_input', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('workshops_input')}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Workshop
                    </button>
                  </div>
                </div>
      
                {/* Important Dates */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">Important Dates</label>
                  <div className="col-span-3 space-y-2">
                    {formData.important_date.map((date, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={date}
                          onChange={(e) => handleArrayInputChange('important_date', index, e.target.value)}
                          placeholder="e.g., Abstract Submission 2024-05-01"
                        />
                        <button
                          onClick={() => removeArrayItem('important_date', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('important_date')}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Important Date
                    </button>
                  </div>
                </div>
              </div>
            </div>
      
            {/* Flyer Upload */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-6">Event Flyer</h3>
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
              </div>
            </div>
      
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleStepOneSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
            ) : (
            // Step 2 Form
<div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Media Upload</h3>
          
          {/* Gallery Images */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-gray-700">Gallery Images</label>
            <div className="col-span-3">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, 'gallery')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
            </div>
          </div>

          {/* Sponsors Images */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-gray-700">Sponsors Images</label>
            <div className="col-span-3">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, 'sponsors')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
            </div>
          </div>

          {/* Videos */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-gray-700">Videos</label>
            <div className="col-span-3">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, 'videos')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="video/*"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 space-y-8">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Package Details</h3>

          {/* Basic Package */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Basic Package</h4>
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium text-gray-700">Pricing</label>
                <div className="col-span-3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Naira Price"
                      type="number"
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.basic_naira}
                      onChange={(e) => handleInputChange('basic_naira', e.target.value)}
                    />
                    <input
                      placeholder="USD Price"
                      type="number"
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.basic_usd}
                      onChange={(e) => handleInputChange('basic_usd', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    {formData.basic_package.map((subtheme, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={subtheme}
                          onChange={(e) => handleArrayInputChange('basic_package', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('basic_package', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('basic_package')}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Package Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Package */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Standard Package</h4>
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium text-gray-700">Pricing</label>
                <div className="col-span-3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Naira Price"
                      type="number"
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.standard_naira}
                      onChange={(e) => handleInputChange('standard_naira', e.target.value)}
                    />
                    <input
                      placeholder="USD Price"
                      type="number"
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.standard_usd}
                      onChange={(e) => handleInputChange('standard_usd', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    {formData.standard_package.map((subtheme, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={subtheme}
                          onChange={(e) => handleArrayInputChange('standard_package', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('standard_package', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('standard_package')}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Package Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Package */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Premium Package</h4>
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium text-gray-700">Pricing</label>
                <div className="col-span-3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Naira Price"
                      type="number"
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.premium_naira}
                      onChange={(e) => handleInputChange('premium_naira', e.target.value)}
                    />
                    <input
                      placeholder="USD Price"
                      type="number"
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.premium_usd}
                      onChange={(e) => handleInputChange('premium_usd', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    {formData.premium_package.map((subtheme, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={subtheme}
                          onChange={(e) => handleArrayInputChange('premium_package', index, e.target.value)}
                        />
                        <button
                          onClick={() => removeArrayItem('premium_package', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('premium_package')}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Package Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speakers Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Speakers</h3>
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium text-gray-700">Add Speakers</label>
            <div className="col-span-3 space-y-4">
              <Select onValueChange={handleSpeakerSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add a speaker" />
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

              <div className="space-y-3">
                {selectedSpeakers.map((selected, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="min-w-[150px] font-medium">
                      {availableSpeakers.find(s => s.speaker_id === selected.speaker_id)?.speaker_name}
                    </span>
                    <Select
                      value={selected.occupation}
                      onValueChange={(occupation) => handleRoleChange(index, occupation)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => removeSpeaker(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-auto"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleStepTwoSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Conference
        </button>
      </div>
    </div>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddConferenceModal;