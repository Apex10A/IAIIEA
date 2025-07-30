import React from 'react';
import { PlusIcon, Trash2Icon } from "lucide-react";
import { SpeakersSectionProps, Speaker } from './types';

const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  speakers,
  availableSpeakers,
  onAddSpeaker,
  onRemoveSpeaker,
  onUpdateSpeaker
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Speakers</h3>
        <button
          type="button"
          onClick={onAddSpeaker}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Speaker
        </button>
      </div>
      
      {speakers.map((speaker, index) => (
        <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Speaker</label>
            <select
              value={speaker.speaker_id}
              onChange={e => onUpdateSpeaker(index, 'speaker_id', Number(e.target.value))}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select a speaker</option>
              {availableSpeakers.map((availableSpeaker) => (
                <option key={availableSpeaker.speaker_id} value={availableSpeaker.speaker_id}>
                  {availableSpeaker.speaker_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={speaker.occupation}
              onChange={e => onUpdateSpeaker(index, 'occupation', e.target.value)}
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
            onClick={() => onRemoveSpeaker(index)}
            className="text-red-600 hover:text-red-800 p-2"
          >
            <Trash2Icon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SpeakersSection;