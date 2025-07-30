import React from 'react';
import { Button } from '@/components/ui/button';
import { Step2FormProps } from './types';
import PackageSection from './PackageSection';
import SpeakersSection from './SpeakersSection';

const Step2Form: React.FC<Step2FormProps> = ({
  data,
  onDataChange,
  onSubmit,
  availableSpeakers
}) => {
  const handlePackageChange = (
    type: 'basic' | 'premium' | 'standard',
    value: string
  ) => {
    const packageKey = `${type}_package` as keyof typeof data;
    const currentPackages = data[packageKey] as string[];
    
    if (currentPackages.includes(value)) {
      onDataChange({
        ...data,
        [packageKey]: currentPackages.filter(item => item !== value)
      });
    } else {
      onDataChange({
        ...data,
        [packageKey]: [...currentPackages, value]
      });
    }
  };

  const addSpeaker = () => {
    onDataChange({
      ...data,
      speakers: [...data.speakers, { speaker_id: 0, occupation: '' }]
    });
  };

  const removeSpeaker = (index: number) => {
    onDataChange({
      ...data,
      speakers: data.speakers.filter((_, i) => i !== index)
    });
  };

  const updateSpeaker = (index: number, field: keyof typeof data.speakers[0], value: string | number) => {
    onDataChange({
      ...data,
      speakers: data.speakers.map((speaker, i) => 
        i === index ? { ...speaker, [field]: value } : speaker
      )
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PackageSection
        type="basic"
        data={data}
        onDataChange={onDataChange}
        onPackageChange={handlePackageChange}
      />

      <PackageSection
        type="standard"
        data={data}
        onDataChange={onDataChange}
        onPackageChange={handlePackageChange}
      />

      <PackageSection
        type="premium"
        data={data}
        onDataChange={onDataChange}
        onPackageChange={handlePackageChange}
      />
      <SpeakersSection
        speakers={data?.speakers}
        availableSpeakers={availableSpeakers}
        onAddSpeaker={addSpeaker}
        onRemoveSpeaker={removeSpeaker}
        onUpdateSpeaker={updateSpeaker}
      />

      <Button
        type="submit"
        variant='default'
        className="w-full bg-[#203a87] text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
      >
        Create Seminar
      </Button>
    </form>
  );
};

export default Step2Form;