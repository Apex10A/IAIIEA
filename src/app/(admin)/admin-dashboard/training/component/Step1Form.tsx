import React from 'react';
import { Button } from '@/components/ui/button';
import { Step1FormProps } from './types';

const Step1Form: React.FC<Step1FormProps> = ({ data, onDataChange, onSubmit }) => {
  const handleInputChange = (field: keyof typeof data, value: string) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={data?.title}
          onChange={e => handleInputChange('title', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Theme</label>
        <input
          type="text"
          value={data?.theme}
          onChange={e => handleInputChange('theme', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Venue</label>
        <input
          type="text"
          value={data?.venue}
          onChange={e => handleInputChange('venue', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Start Date & Time</label>
        <input
          type="datetime-local"
          value={data?.start}
          onChange={e => handleInputChange('start', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date & Time</label>
        <input
          type="datetime-local"
          value={data?.end}
          onChange={e => handleInputChange('end', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mode</label>
        <select
          value={data?.mode}
          onChange={e => handleInputChange('mode', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select mode</option>
          <option value="Physical">Physical</option>
          <option value="Virtual">Virtual</option>
          <option value="Virtual_Physical">Hybrid (Virtual & Physical)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Seminar Type</label>
        <select
          value={data?.is_free}
          onChange={e => handleInputChange('is_free', e.target.value)}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select type</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <Button
        type="submit"
        variant='default'
        className="w-full bg-[#203a87] text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
      >
        Next Step
      </Button>
    </form>
  );
};

export default Step1Form;