"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cross2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Conference {
    id: number;
    is_registered?: boolean;
    title: string;
    theme: string;
    venue: string;
    date: string;
    start_date: string;
    start_time: string;
    sub_theme: string[];
    work_shop: string[];
    important_date: string[];
    flyer: string;
    gallery: string[];
    sponsors: string[];
    videos: string[];
    payments: {
      basic?: {
        virtual: { usd: string; naira: string };
        physical: { usd: string; naira: string };
        package?: string[];
      };
      standard?: {
        virtual: { usd: string; naira: string };
        physical: { usd: string; naira: string };
        package?: string[];
      };
      premium?: {
        virtual: { usd: string; naira: string };
        physical: { usd: string; naira: string };
        package?: string[];
      };
      early_bird_registration?: {
        virtual: { usd: string; naira: string };
        physical: { usd: string; naira: string };
      };
      normal_registration?: {
        virtual: { usd: string; naira: string };
        physical: { usd: string; naira: string };
      };
      late_registration?: {
        virtual: { usd: string; naira: string };
        physical: { usd: string; naira: string };
      };
    };
    speakers: Array<{
      speaker_id: number;
      name: string;
      title: string;
      portfolio: string;
      picture: string;
      occupation?: string;
    }>;
    resources?: any[];
    schedule?: any[];
    meals?: any[];
    status?: string;
  }

  interface EditConferenceModalProps {
    conference: Conference;
    onSuccess: (updatedConference: Conference) => void; // Updated to accept parameter
  }

const EditConferenceModal: React.FC<EditConferenceModalProps> = ({ conference, onSuccess }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSpeakers, setAvailableSpeakers] = useState<any[]>([]);
  const [formData, setFormData] = useState<Omit<Conference, 'id'>>({
    title: conference.title,
    theme: conference.theme,
    venue: conference.venue,
    date: conference.date,
    start_date: conference.start_date,
    start_time: conference.start_time,
    sub_theme: [...conference.sub_theme],
    work_shop: [...conference.work_shop],
    important_date: [...conference.important_date],
    flyer: conference.flyer,
    gallery: [...conference.gallery],
    sponsors: [...conference.sponsors],
    videos: [...conference.videos],
    payments: { ...conference.payments },
    speakers: [...conference.speakers],
  });

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speakers_list`, {
          headers: {
            'Authorization': `Bearer ${session?.user?.token}`
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

    if (isOpen) {
      fetchSpeakers();
    }
  }, [isOpen, session?.user?.token]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'sub_theme' | 'work_shop' | 'important_date', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'sub_theme' | 'work_shop' | 'important_date') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'sub_theme' | 'work_shop' | 'important_date', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handlePaymentChange = (
    plan: 'basic' | 'standard' | 'premium' | 'early_bird_registration' | 'normal_registration' | 'late_registration',
    type: 'virtual' | 'physical',
    currency: 'usd' | 'naira',
    value: string
  ) => {
    setFormData(prev => {
      const newPayments = { ...prev.payments };
      if (!newPayments[plan]) {
        newPayments[plan] = {
          virtual: { usd: '', naira: '' },
          physical: { usd: '', naira: '' }
        };
      }
      newPayments[plan]![type][currency] = value;
      return { ...prev, payments: newPayments };
    });
  };

  const handlePackageItemChange = (
    plan: 'basic' | 'standard' | 'premium',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newPayments = { ...prev.payments };
      if (!newPayments[plan]?.package) {
        if (!newPayments[plan]) {
          newPayments[plan] = {
            virtual: { usd: '', naira: '' },
            physical: { usd: '', naira: '' },
            package: []
          };
        } else {
          newPayments[plan]!.package = [];
        }
      }
      const newPackage = [...newPayments[plan]!.package!];
      newPackage[index] = value;
      newPayments[plan]!.package = newPackage;
      return { ...prev, payments: newPayments };
    });
  };

  const addPackageItem = (plan: 'basic' | 'standard' | 'premium') => {
    setFormData(prev => {
      const newPayments = { ...prev.payments };
      if (!newPayments[plan]?.package) {
        if (!newPayments[plan]) {
          newPayments[plan] = {
            virtual: { usd: '', naira: '' },
            physical: { usd: '', naira: '' },
            package: []
          };
        } else {
          newPayments[plan]!.package = [];
        }
      }
      newPayments[plan]!.package = [...newPayments[plan]!.package!, ''];
      return { ...prev, payments: newPayments };
    });
  };

  const removePackageItem = (plan: 'basic' | 'standard' | 'premium', index: number) => {
    setFormData(prev => {
      const newPayments = { ...prev.payments };
      if (newPayments[plan]?.package) {
        newPayments[plan]!.package = newPayments[plan]!.package!.filter((_, i) => i !== index);
      }
      return { ...prev, payments: newPayments };
    });
  };

  const handleSpeakerSelect = (speakerId: number) => {
    const speaker = availableSpeakers.find(s => s.speaker_id === speakerId);
    if (speaker && !formData.speakers.some(s => s.speaker_id === speakerId)) {
      setFormData(prev => ({
        ...prev,
        speakers: [
          ...prev.speakers,
          {
            speaker_id: speaker.speaker_id,
            name: speaker.speaker_name,
            title: speaker.speaker_title || '',
            portfolio: 'Workshop Facilitator',
            picture: speaker.speaker_picture || '',
            occupation: 'Workshop Facilitator'
          }
        ]
      }));
    }
  };

  const handleSpeakerRoleChange = (index: number, occupation: string) => {
    setFormData(prev => {
      const newSpeakers = [...prev.speakers];
      newSpeakers[index].occupation = occupation;
      return { ...prev, speakers: newSpeakers };
    });
  };

  const removeSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/edit_conference/${conference.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        showToast.success("Conference updated successfully");
        onSuccess({ ...formData, id: conference.id }); 
        setIsOpen(false);
      } else {
        showToast.error(data.message || "Failed to update conference");
      }
    } catch (error) {
      console.error("Error updating conference:", error);
      showToast.error("Failed to update conference");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-[#203a87]">
          Edit Conference
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Conference</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subthemes */}
          <Card>
            <CardHeader>
              <CardTitle>Subthemes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.sub_theme.map((subtheme, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={subtheme}
                    onChange={(e) => handleArrayChange('sub_theme', index, e.target.value)}
                    required
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeArrayItem('sub_theme', index)}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                onClick={() => addArrayItem('sub_theme')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Subtheme
              </Button>
            </CardContent>
          </Card>

          {/* Workshops */}
          <Card>
            <CardHeader>
              <CardTitle>Workshops</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.work_shop.map((workshop, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={workshop}
                    onChange={(e) => handleArrayChange('work_shop', index, e.target.value)}
                    required
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeArrayItem('work_shop', index)}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                onClick={() => addArrayItem('work_shop')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Workshop
              </Button>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.important_date.map((date, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={date}
                    onChange={(e) => handleArrayChange('important_date', index, e.target.value)}
                    required
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeArrayItem('important_date', index)}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                type="button"
                onClick={() => addArrayItem('important_date')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Important Date
              </Button>
            </CardContent>
          </Card>

          {/* Payment Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Plan */}
              {formData.payments.basic && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Basic Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Virtual (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.basic.virtual.usd}
                        onChange={(e) => handlePaymentChange('basic', 'virtual', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Virtual (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.basic.virtual.naira}
                        onChange={(e) => handlePaymentChange('basic', 'virtual', 'naira', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.basic.physical.usd}
                        onChange={(e) => handlePaymentChange('basic', 'physical', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.basic.physical.naira}
                        onChange={(e) => handlePaymentChange('basic', 'physical', 'naira', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.payments.basic.package && (
                    <div className="space-y-2">
                      <Label>Package Inclusions</Label>
                      {formData.payments.basic.package.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={item}
                            onChange={(e) => handlePackageItemChange('basic', index, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => removePackageItem('basic', index)}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => addPackageItem('basic')}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Package Item
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Standard Plan */}
              {formData.payments.standard && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Standard Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Virtual (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.standard.virtual.usd}
                        onChange={(e) => handlePaymentChange('standard', 'virtual', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Virtual (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.standard.virtual.naira}
                        onChange={(e) => handlePaymentChange('standard', 'virtual', 'naira', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.standard.physical.usd}
                        onChange={(e) => handlePaymentChange('standard', 'physical', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.standard.physical.naira}
                        onChange={(e) => handlePaymentChange('standard', 'physical', 'naira', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.payments.standard.package && (
                    <div className="space-y-2">
                      <Label>Package Inclusions</Label>
                      {formData.payments.standard.package.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={item}
                            onChange={(e) => handlePackageItemChange('standard', index, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => removePackageItem('standard', index)}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => addPackageItem('standard')}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Package Item
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Premium Plan */}
              {formData.payments.premium && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Premium Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Virtual (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.premium.virtual.usd}
                        onChange={(e) => handlePaymentChange('premium', 'virtual', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Virtual (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.premium.virtual.naira}
                        onChange={(e) => handlePaymentChange('premium', 'virtual', 'naira', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.premium.physical.usd}
                        onChange={(e) => handlePaymentChange('premium', 'physical', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.premium.physical.naira}
                        onChange={(e) => handlePaymentChange('premium', 'physical', 'naira', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.payments.premium.package && (
                    <div className="space-y-2">
                      <Label>Package Inclusions</Label>
                      {formData.payments.premium.package.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={item}
                            onChange={(e) => handlePackageItemChange('premium', index, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => removePackageItem('premium', index)}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => addPackageItem('premium')}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Package Item
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Early Bird Registration */}
              {formData.payments.early_bird_registration && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Early Bird Registration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Virtual (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.early_bird_registration.virtual.usd}
                        onChange={(e) => handlePaymentChange('early_bird_registration', 'virtual', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Virtual (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.early_bird_registration.virtual.naira}
                        onChange={(e) => handlePaymentChange('early_bird_registration', 'virtual', 'naira', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (USD)</Label>
                      <Input
                        type="number"
                        value={formData.payments.early_bird_registration.physical.usd}
                        onChange={(e) => handlePaymentChange('early_bird_registration', 'physical', 'usd', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Physical (Naira)</Label>
                      <Input
                        type="number"
                        value={formData.payments.early_bird_registration.physical.naira}
                        onChange={(e) => handlePaymentChange('early_bird_registration', 'physical', 'naira', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Speakers */}
          <Card>
            <CardHeader>
              <CardTitle>Speakers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Speaker</Label>
                <Select onValueChange={(value) => handleSpeakerSelect(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a speaker" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpeakers.map((speaker) => (
                      <SelectItem
                        key={speaker.speaker_id}
                        value={speaker.speaker_id.toString()}
                        disabled={formData.speakers.some(s => s.speaker_id === speaker.speaker_id)}
                      >
                        {speaker.speaker_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {formData.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{speaker.name}</p>
                      <p className="text-sm text-gray-600">{speaker.title}</p>
                    </div>
                    <Select
                      value={speaker.occupation}
                      onValueChange={(occupation) => handleSpeakerRoleChange(index, occupation)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop Facilitator">Workshop Facilitator</SelectItem>
                        <SelectItem value="Key Note Address">Key Note Address</SelectItem>
                        <SelectItem value="Guest Speaker">Guest Speaker</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeSpeaker(index)}
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditConferenceModal;