import React from 'react';
import { Button } from '@/components/ui/button';
import { Step2FormProps } from './types';
import PackageSection from './PackageSection';
import SpeakersSection from './SpeakersSection';

const Step2Form: React.FC<Step2FormProps> = ({
  data,
  onDataChange,
  onSubmit,
  availableSpeakers,
  mode
}) => {

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

  const getModeDisplayName = (mode: string) => {
    switch (mode) {
      case 'Physical': return 'Physical Only';
      case 'Virtual': return 'Virtual Only';
      case 'Virtual_Physical': return 'Hybrid (Virtual & Physical)';
      default: return mode;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Mode indicator */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Seminar Mode: {getModeDisplayName(mode)}
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {mode === 'Virtual_Physical' 
            ? 'Set fees for both virtual and physical attendance options.'
            : `Set fees for ${mode.toLowerCase()} attendance.`
          }
        </p>
      </div>

      {/* Conditionally render fee sections based on mode */}
      {(mode === 'Physical' || mode === 'Virtual_Physical') && (
        <PackageSection
          type="physical"
          data={data}
          onDataChange={onDataChange}
        />
      )}

      {(mode === 'Virtual' || mode === 'Virtual_Physical') && (
        <PackageSection
          type="virtual"
          data={data}
          onDataChange={onDataChange}
        />
      )}
      
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