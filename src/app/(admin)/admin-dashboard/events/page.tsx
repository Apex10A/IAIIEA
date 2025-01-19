import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePickerWithPopover } from '@/components/ui/date-picker';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicListInput } from './ordered-list';
import { PaperFlyerUpload } from './paperFlyer';
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useSession } from "next-auth/react";

const EventCreationForm = () => {
    const { data: session } = useSession();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const bearerToken = session?.user?.token || session?.user?.userData?.token;
  // State for managing the entire form process
  const [eventType, setEventType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Conference specific fields
    title: '',
    theme: '',
    start: null,
    end: null,
    subthemes_input: [''],
    workshops_input: [''],
    important_date: [''],
    flyer: [],

    // Seminar specific fields
    venue: '',

    // Pricing and packages
    
    basic: {
      naira: '',
      usd: '',
      package: ['']
    },
    premium: {
      naira: '',
      usd: '',
      package: ['']
    },
    standard: {
      naira: '',
      usd: '',
      package: ['']
    },

    // Speakers
    speakers: [{}],
    availableSpeakers: []
  });

  interface Speaker {
    speaker_id: string;
    speaker_name: string;
    speaker_institution: string;
    speaker_image: string;
}

  // Fetch speakers list
  useEffect(() => {
    const fetchSpeakers = async () => {
        try {
            console.log('Fetching speakers...'); // Debug log
            const response = await fetch(`${API_URL}/admin/speakers_list`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch speakers');
            }

            const responseData = await response.json();
            console.log('API Response:', responseData); // Debug log

            // Extract speakers from the data array
            const speakers = responseData.data || [];
            console.log('Processed speakers:', speakers); // Debug log

            setFormData(prev => ({
                ...prev,
                availableSpeakers: speakers
            }));
        } catch (error) {
            console.error('Failed to fetch speakers:', error);
            setFormData(prev => ({
                ...prev,
                availableSpeakers: []
            }));
        }
    };

    if (currentStep === 1) {
        fetchSpeakers();
    }
}, [currentStep, API_URL, bearerToken]);
const renderSpeakersSection = () => (
  <div>
      <Label>Speakers</Label>
      <div className="space-y-2">
          {formData.speakers.map((speaker, index) => (
              <div key={index} className="flex items-center space-x-2">
                  <Select 
                      value={speaker.speaker_id} 
                      onValueChange={(value) => {
                          const selectedSpeaker = formData.availableSpeakers.find(
                              s => s.speaker_id === value
                          );
                          const newSpeakers = [...formData.speakers];
                          newSpeakers[index] = {
                              speaker_id: value,
                              speaker_name: selectedSpeaker?.speaker_name,
                              speaker_institution: selectedSpeaker?.speaker_institution
                          };
                          setFormData(prev => ({
                              ...prev,
                              speakers: newSpeakers
                          }));
                      }}
                  >
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Speaker" />
                      </SelectTrigger>
                      <SelectContent>
                          {formData.availableSpeakers.map((availableSpeaker) => (
                              <SelectItem 
                                  key={availableSpeaker.speaker_id} 
                                  value={availableSpeaker.speaker_id}
                              >
                                  {availableSpeaker.speaker_name} - {availableSpeaker.speaker_institution}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {index > 0 && (
                      <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => {
                              setFormData(prev => ({
                                  ...prev,
                                  speakers: prev.speakers.filter((_, i) => i !== index)
                              }));
                          }}
                      >
                          <TrashIcon className="h-4 w-4" />
                      </Button>
                  )}
              </div>
          ))}
          <Button 
              variant="outline" 
              onClick={() => {
                  setFormData(prev => ({
                      ...prev,
                      speakers: [...prev.speakers, {}]
                  }));
              }}
          >
              <PlusIcon className="h-4 w-4 mr-2" /> Add Speaker
          </Button>
      </div>
  </div>
);

  // Dynamic input handlers
  const handleInputChange = (field: string, value: string) => {
    // Handle nested object states for pricing
    if (field.includes('_')) {
      const [category, subField] = field.split('_');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subField]: value
        }
      }));
    } else {
      // Handle simple top-level fields
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSubtheme = () => {
    setFormData(prev => ({
      ...prev,
      subthemes: [...prev.subthemes_input, '']
    }));
  };

  const removeSubtheme = (index) => {
    const newSubthemes = formData.subthemes_input.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      subthemes: newSubthemes
    }));
  };

  const handleSubthemeChange = (index, value) => {
    const newSubthemes = [...formData.subthemes_input];
    newSubthemes[index] = value;
    setFormData(prev => ({
      ...prev,
      subthemes: newSubthemes
    }));
  };

  // Similar methods for workshops, important dates, speakers, etc.

  const handleNextStep = async () => {
    // Validation and API submission logic
    try {
      let endpoint = '';
      let payload = {};

      if (eventType === 'conference') {
        if (currentStep === 0) {
          endpoint = `${API_URL}/admin/create_conference/1`;
          payload = {
            title: formData.title,
            theme: formData.theme,
            start: formData.start ? format(formData.start, "yyyy-MM-dd HH:mm:ss") : '',
            end: formData.end ? format(formData.end, "yyyy-MM-dd HH:mm:ss") : '',
            subthemes_input: formData.subthemes_input,
            workshops_input: formData.workshops_input,
            important_date: formData.important_date
          };
        } else if (currentStep === 1) {
          endpoint = `${API_URL}/admin/create_conference/2`;
          payload = {
            token: formData.token, // From previous step's response
            basic_naira: formData.basic.naira,
            basic_usd: formData.basic.usd,
            basic_package: formData.basic.package,
            premium_naira: formData.premium.naira,
            premium_usd: formData.premium.usd,
            premium_package: formData.premium.package,
            standard_naira: formData.standard.naira,
            standard_usd: formData.standard.usd,
            standard_package: formData.standard.package,
            speakers: formData.speakers.map(speaker => ({
              speaker_id: speaker.id,
              occupation: speaker.occupation
            }))
          };
        }
      } else if (eventType === 'seminar') {
        if (currentStep === 0) {
          endpoint = `${API_URL}/admin/create_seminar/1`;
          payload = {
            title: formData.title,
            theme: formData.theme,
            venue: formData.venue,
            start: formData.start ? format(formData.start, "yyyy-MM-dd HH:mm:ss") : '',
            end: formData.end ? format(formData.end, "yyyy-MM-dd HH:mm:ss") : ''
          };
        } else if (currentStep === 1) {
          endpoint = `${API_URL}/admin/create_seminar/2`;
          payload = {
            token: formData.token,
            basic_naira: formData.basic.naira,
            basic_usd: formData.basic.usd,
            basic_package: formData.basic.package,
            premium_naira: formData.premium.naira,
            premium_usd: formData.premium.usd,
            premium_package: formData.premium.package,
            standard_naira: formData.standard.naira,
            standard_usd: formData.standard.usd,
            standard_package: formData.standard.package,
            speakers: formData.speakers.map(speaker => ({
              speaker_id: speaker.id,
              occupation: speaker.occupation
            }))
          };
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          // Add authentication token if required
        },
        body: JSON.stringify(payload)
      });

      
      const result = await response.json();

      if (currentStep === 0) {
        // Store the token from the first step's response
        setFormData(prev => ({
          ...prev,
          token: result.data.token // Access the token from the nested data object
        }));
      }
  
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Submission error', error);
    }
  };
  const handleFlyerUpload = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      flyers: files
    }));
  };

  const renderStepContent = () => {
    if (!eventType) {
      return (
        <div className="space-y-4">
          <Select onValueChange={setEventType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (eventType === 'conference') {
      if (currentStep === 0) {
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Theme</Label>
              <Input 
                value={formData.theme} 
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />
            </div>
            <div>
              <Label>Venue</Label>
              <Input 
                value={formData.venue} 
                onChange={(e) => handleInputChange('venue', e.target.value)}
              />
            </div>
          <div className=' flex items-center justify-between'>
          <div>
    <Label>Start Date</Label>
    <DateTimePickerWithPopover
      value={formData.start}
      onChange={(date) => handleInputChange('start', date)}
    />
  </div>
  <div>
    <Label>End Date</Label>
    <DateTimePickerWithPopover
      value={formData.end}
      onChange={(date) => handleInputChange('end', date)}
    />
  </div>
          </div>
            <div>

            </div>
            <DynamicListInput 
            label="Subthemes"
            items={formData.subthemes_input}
            onItemsChange={(subthemes_input) => setFormData(prev => ({...prev, subthemes_input}))}
            placeholder="Enter subtheme"
          />

          <DynamicListInput 
            label="Workshops"
            items={formData.workshops_input}
            onItemsChange={(workshops_input) => setFormData(prev => ({...prev, workshops_input}))}
            placeholder="Enter workshop"
          />
          <DynamicListInput 
            label="Important Date"
            items={formData.important_date}
            onItemsChange={(important_date) => setFormData(prev => ({...prev, important_date}))}
            placeholder="Enter important dates"
          />
            {/* Other form fields */}
      <PaperFlyerUpload 
        onFilesChange={handleFlyerUpload}
        maxFiles={5}
      />
            {/* Date Pickers, Subthemes, Workshops, etc. would go here */}
          </div>
        );
      } else if (currentStep === 1) {
        return (
          <div className="space-y-4">
             <div>
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
          </div>
        );
      }
    }

    if (eventType === 'seminar') {
      if (currentStep === 0) {
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Theme</Label>
              <Input 
                value={formData.theme} 
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />
            </div>
            <div>
              <Label>Venue</Label>
              <Input 
                value={formData.venue} 
                onChange={(e) => handleInputChange('venue', e.target.value)}
              />
            </div>
           <div className='flex items-center justify-between'>
           <div>
    <Label>Start Date</Label>
    <DateTimePickerWithPopover
      value={formData.start}
      onChange={(date) => handleInputChange('start', date)}
    />
  </div>
  <div>
    <Label>End Date</Label>
    <DateTimePickerWithPopover
      value={formData.end}
      onChange={(date) => handleInputChange('end', date)}
    />
  </div>
           </div>
          </div>
        );
      } else if (currentStep === 1) {
        return (
          <div className="space-y-4">
            <div>
            <Label>Speakers</Label>
           <div className='flex items-start gap-3 '>
            <div>
            <Input
              type="file"
              accept="image/*"
              className='h-[200px]'
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const newSpeakers = [...formData.speakers];
                  newSpeakers[index] = {
                    ...newSpeakers[index],
                    speaker_image: URL.createObjectURL(file), // Preview URL
                  };
                  setFormData((prev) => ({
                    ...prev,
                    speakers: newSpeakers,
                  }));
                }
              }}
            />
            </div>
           <div className=''>
           <div className='w-full'>
            <Label>Input Name</Label>
              <Input 
                value={formData.standard.naira} 
                onChange={(e) => handleInputChange('standard_naira', e.target.value)}
              />
            </div>
            <div>
            <Label>Input Occupation</Label>
              <Input 
                value={formData.standard.naira} 
                onChange={(e) => handleInputChange('standard_naira', e.target.value)}
              />
            </div>
            <div>
            <Label>Input Instituition</Label>
              <Input 
                value={formData.standard.naira} 
                onChange={(e) => handleInputChange('standard_naira', e.target.value)}
              />
            </div>
           </div>
           </div>

            </div>
            <div className='flex items-center justify-between gap-3 pt-10'>
            <div className='w-full'>
              <Label>Fees in Naira </Label>
              <Input 
                value={formData.basic.naira} 
                onChange={(e) => handleInputChange('basic_naira', e.target.value)}
              />
            </div>
            <div className='w-full'>
              <Label>Fees in USD</Label>
              <Input 
                value={formData.basic.usd} 
                onChange={(e) => handleInputChange('basic_usd', e.target.value)}
              />
            </div>
            </div>
            <div>
              <Label>Package (What it includes)</Label>
              <Input 
                value={formData.basic.package} 
                className='mb-3'
                onChange={(e) => handleInputChange('basic_package', e.target.value)}
              />
            </div>


            <div className='py-5'>
            <div className='flex items-center justify-between gap-3 w-full'>
            <div className='w-full'>
              <Label>Fees in Naira</Label>
              <Input 
                value={formData.premium.naira} 
                onChange={(e) => handleInputChange('premium_naira', e.target.value)}
              />
            </div>
            <div className='w-full'>
              <Label>Fees in USD</Label>
              <Input 
                value={formData.premium.usd} 
                onChange={(e) => handleInputChange('premium_usd', e.target.value)}
              />
            </div>
            </div>
            <div>
              <Label>Package (What it includes)</Label>
              <Input 
                value={formData.premium.package} 
                onChange={(e) => handleInputChange('premium_package', e.target.value)}
              />
            </div>
            </div>



<div>
<div className='flex items-center justify-between gap-3'>
            <div className='w-full'>
              <Label>Fees in Naira</Label>
              <Input 
                value={formData.standard.naira} 
                onChange={(e) => handleInputChange('standard_naira', e.target.value)}
              />
            </div>
            <div className='w-full'>
              <Label>Fees in USD</Label>
              <Input 
                value={formData.standard.usd} 
                onChange={(e) => handleInputChange('standard_usd', e.target.value)}
              />
            </div>
            </div>
            <div>
              <Label>Package (What it includes)</Label>
              <Input 
                value={formData.standard.package} 
                onChange={(e) => handleInputChange('standard_package', e.target.value)}
              />
            </div>
</div>


          </div>
        );
      }
    }
  };
  

  return (
    <div className='p-6'>
        <div className='bg-gray-200 px-5 py-3 mb-6 '>
        <h1 className='text-2xl'>EVENTS</h1>
      </div>
      <Card className="w-full max-w-2xl bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>
         <p className='text-lg opacity-[0.8]'> {!eventType ? 'Select Event Type' : 
           eventType === 'conference' ? 
             (currentStep === 0 ? 'Conference Details' : 'Conference Pricing & Speakers') :
             (currentStep === 0 ? 'Seminar Details' : 'Seminar Pricing & Speakers')
          }</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
        {renderStepContent()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentStep > 0 && (
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Previous
          </Button>
        )}
        <Button onClick={handleNextStep} className='font-bold bg-[#FEF08A]'>
          {currentStep === 0 ? 'Next' : 'Submit'}
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
};

export default EventCreationForm;