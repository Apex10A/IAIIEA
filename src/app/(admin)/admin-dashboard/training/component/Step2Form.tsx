import React from 'react';
import { Button } from '@/components/ui/button';
import { Step2FormProps } from './types';
import PackageSection from './PackageSection';
import SpeakersSection from './SpeakersSection';
import {
  getSeminarModeLabel,
  isFreeSeminar,
  isPaidSeminar,
} from '../utils/seminarPricing';

const Step2Form: React.FC<Step2FormProps> = ({
  data,
  onDataChange,
  onSubmit,
  availableSpeakers,
  mode,
  isFree,
}) => {
  const paidSeminar = isPaidSeminar(isFree);
  const freeSeminar = isFreeSeminar(isFree);

  const addSpeaker = () => {
    onDataChange({
      ...data,
      speakers: [...data.speakers, { speaker_id: 0, occupation: '' }],
    });
  };

  const removeSpeaker = (index: number) => {
    onDataChange({
      ...data,
      speakers: data.speakers.filter((_, i) => i !== index),
    });
  };

  const updateSpeaker = (
    index: number,
    field: keyof typeof data.speakers[0],
    value: string | number
  ) => {
    onDataChange({
      ...data,
      speakers: data.speakers.map((speaker, i) =>
        i === index ? { ...speaker, [field]: value } : speaker
      ),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Seminar mode: {getSeminarModeLabel(mode)}
        </h3>
        {freeSeminar ? (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This seminar is free. Attendees will not be charged. Assign speakers
            below to finish setup.
          </p>
        ) : paidSeminar ? (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Set one standard fee for each attendance type this seminar supports.
            Enter at least one price in Naira or USD per type.
          </p>
        ) : (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Select paid or free in step 1 to configure pricing.
          </p>
        )}
      </div>

      {paidSeminar && (
        <>
          {(mode === 'Physical' || mode === 'Virtual_Physical') && (
            <PackageSection
              type="physical"
              data={data}
              onDataChange={onDataChange}
              required
            />
          )}

          {(mode === 'Virtual' || mode === 'Virtual_Physical') && (
            <PackageSection
              type="virtual"
              data={data}
              onDataChange={onDataChange}
              required
            />
          )}
        </>
      )}

      {freeSeminar && (
        <div className="rounded-lg border border-dashed border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
          No payment fields are needed for free seminars.
        </div>
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
