// components/ui/multi-select.tsx
import React from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  className = ''
}) => {
  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter(item => item !== value));
    }
  };

  return (
    <div className={`border rounded-md p-2 max-h-60 overflow-y-auto ${className}`}>
      {options.length === 0 ? (
        <div className="text-sm text-gray-500 p-2">{placeholder}</div>
      ) : (
        options.map(option => (
          <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
            <Checkbox
              id={option.value}
              checked={selected.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
            />
            <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))
      )}
    </div>
  );
};