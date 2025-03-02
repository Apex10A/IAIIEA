import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { PlusIcon, Trash2Icon } from "lucide-react";
import { showToast } from '@/utils/toast';

interface Speaker {
  speaker_id: number;
  occupation: string;
}

interface AvailableSpeaker {
  speaker_id: number;
  speaker_name: string;
  // Add other speaker properties as needed
}
interface Step1Data {
  title: string;
  theme: string;
  venue: string;
  start: string;
  end: string;
}

interface Step2Data {
  token: string;
  basic_naira: number;
  basic_usd: number;
  basic_package: string[];
  premium_naira: number;
  premium_usd: number;
  premium_package: string[];
  standard_naira: number;
  standard_usd: number;
  standard_package: string[];
  speakers: Speaker[];
}

const CreateSeminarModal: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [step, setStep] = useState(1);
  const [step1Token, setStep1Token] = useState('');
  const [availableSpeakers, setAvailableSpeakers] = useState<AvailableSpeaker[]>([]);
  
  const [step1Data, setStep1Data] = useState<Step1Data>({
    title: '',
    theme: '',
    venue: '',
    start: '',
    end: ''
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    token: '',
    basic_naira: 0,
    basic_usd: 0,
    basic_package: [],
    premium_naira: 0,
    premium_usd: 0,
    premium_package: [],
    standard_naira: 0,
    standard_usd: 0,
    standard_package: [],
    speakers: []
  });

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_seminar/1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(step1Data),
      });

      const data = await response.json();
      if (data.status === "success" && data.data?.token) {
        setStep1Token(data.data.token);
        console.log(data.data.token)
        setStep2Data(prev => ({ ...prev, token: data.data.token }));
        setStep(2);
      } else {
        showToast.error("Failed to create seminar")
        throw new Error(data.message || 'Failed to create seminar');
      }
    } catch (error) {
      console.error('Error creating seminar:', error);
      showToast.error('Failed to create seminar');
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_seminar/2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(step2Data),
      });

      const data = await response.json();
      if (data.status === "success") {
        showToast.success('Seminar created successfully');
        onSuccess();
        setStep(1);
        setStep1Data({
          title: '',
          theme: '',
          venue: '',
          start: '',
          end: ''
        });
        setStep2Data({
          token: '',
          basic_naira: 0,
          basic_usd: 0,
          basic_package: [],
          premium_naira: 0,
          premium_usd: 0,
          premium_package: [],
          standard_naira: 0,
          standard_usd: 0,
          standard_package: [],
          speakers: []
        });
      } else {
        throw new Error(data.message || 'Failed to complete seminar creation');
      }
    } catch (error) {
      console.error('Error completing seminar creation:', error);
      showToast.error('Failed to complete seminar creation');
    }
  };
  

  const handlePackageChange = (
    type: 'basic' | 'premium' | 'standard',
    value: string
  ) => {
    const packageKey = `${type}_package` as keyof Step2Data;
    const currentPackages = step2Data[packageKey] as string[];
    
    if (currentPackages.includes(value)) {
      setStep2Data(prev => ({
        ...prev,
        [packageKey]: currentPackages.filter(item => item !== value)
      }));
    } else {
      setStep2Data(prev => ({
        ...prev,
        [packageKey]: [...currentPackages, value]
      }));
    }
  };



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
        console.log(data.data)
      }
    } catch (error) {
      console.error('Error fetching speakers:', error);
    }
  };

  const addSpeaker = () => {
    setStep2Data(prev => ({
      ...prev,
      speakers: [...prev.speakers, { speaker_id: 0, occupation: '' }]
    }));
  };

  const removeSpeaker = (index: number) => {
    setStep2Data(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string | number) => {
    setStep2Data(prev => ({
      ...prev,
      speakers: prev.speakers.map((speaker, i) => 
        i === index ? { ...speaker, [field]: value } : speaker
      )
    }));
  
  }

  const renderSpeakersSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Speakers</h3>
        <button
          type="button"
          onClick={addSpeaker}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Speaker
        </button>
      </div>
      
      {step2Data.speakers.map((speaker, index) => (
        <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Speaker</label>
            <select
              value={speaker.speaker_id}
              onChange={e => updateSpeaker(index, 'speaker_id', Number(e.target.value))}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select a speaker</option>
              {availableSpeakers.map((speaker) => (
                <option key={speaker.speaker_id} value={speaker.speaker_id}>
                  {speaker.speaker_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={speaker.occupation}
              onChange={e => updateSpeaker(index, 'occupation', e.target.value)}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select a role</option>
              <option value="Keynote Speaker">Keynote Speaker</option>
              <option value="Workshop Facilitator">Workshop Facilitator</option>
              <option value="Panel Moderator">Panel Moderator</option>
              <option value="Guest Speaker">Guest Speaker</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => removeSpeaker(index)}
            className="text-red-600 hover:text-red-800 p-2"
          >
            <Trash2Icon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-[#203a87] text-white px-4 py-2 rounded-md transition-colors">
          Add New Seminar
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Create New Seminar - Step {step}
          </Dialog.Title>
          
          <Dialog.Close className="absolute top-4 right-4">
            <Cross2Icon className="h-4 w-4" />
          </Dialog.Close>

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={step1Data.title}
                  onChange={e => setStep1Data(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <input
                  type="text"
                  value={step1Data.theme}
                  onChange={e => setStep1Data(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Venue</label>
                <input
                  type="text"
                  value={step1Data.venue}
                  onChange={e => setStep1Data(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={step1Data.start}
                  onChange={e => setStep1Data(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={step1Data.end}
                  onChange={e => setStep1Data(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* Basic Package */}
              <div className="space-y-2">
                <h3 className="font-medium">Basic Package</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (Naira)</label>
                    <input
                      type="number"
                      value={step2Data.basic_naira}
                      onChange={e => setStep2Data(prev => ({ ...prev, basic_naira: Number(e.target.value) }))}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={step2Data.basic_usd}
                      onChange={e => setStep2Data(prev => ({ ...prev, basic_usd: Number(e.target.value) }))}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={step2Data.basic_package.includes('Food')}
                      onChange={() => handlePackageChange('basic', 'Food')}
                      className="mr-2"
                    />
                    Food
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={step2Data.basic_package.includes('Accommodation')}
                      onChange={() => handlePackageChange('basic', 'Accommodation')}
                      className="mr-2"
                    />
                    Accommodation
                  </label>
                </div>
              </div>

              {/* Premium Package */}
              <div className="space-y-2">
                <h3 className="font-medium">Premium Package</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (Naira)</label>
                    <input
                      type="number"
                      value={step2Data.premium_naira}
                      onChange={e => setStep2Data(prev => ({ ...prev, premium_naira: Number(e.target.value) }))}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={step2Data.premium_usd}
                      onChange={e => setStep2Data(prev => ({ ...prev, premium_usd: Number(e.target.value) }))}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={step2Data.premium_package.includes('Food')}
                      onChange={() => handlePackageChange('premium', 'Food')}
                      className="mr-2"
                    />
                    Food
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={step2Data.premium_package.includes('Accommodation')}
                      onChange={() => handlePackageChange('premium', 'Accommodation')}
                      className="mr-2"
                    />
                    Accommodation
                  </label>
                </div>
              </div>

              {/* Standard Package */}
              <div className="space-y-2">
                <h3 className="font-medium">Standard Package</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (Naira)</label>
                    <input
                      type="number"
                      value={step2Data.standard_naira}
                      onChange={e => setStep2Data(prev => ({ ...prev, standard_naira: Number(e.target.value) }))}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={step2Data.standard_usd}
                      onChange={e => setStep2Data(prev => ({ ...prev, standard_usd: Number(e.target.value) }))}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={step2Data.standard_package.includes('Food')}
                      onChange={() => handlePackageChange('standard', 'Food')}
                      className="mr-2"
                    />
                    Food
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={step2Data.standard_package.includes('Accommodation')}
                      onChange={() => handlePackageChange('standard', 'Accommodation')}
                      className="mr-2"
                    />
                    Accommodation
                  </label>
                </div>
              </div>

              {/* Speakers */}
 {renderSpeakersSection()}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Seminar
                </button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateSeminarModal;