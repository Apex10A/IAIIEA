import React from 'react';
import { PackageSectionProps } from './types';

const PackageSection: React.FC<PackageSectionProps> = ({
  type,
  data,
  onDataChange,
  onPackageChange
}) => {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  
  const handlePriceChange = (currency: 'naira' | 'usd', value: string) => {
    const fieldName = `${type}_${currency}` as keyof typeof data;
    onDataChange({
      ...data,
      [fieldName]: value === '' ? '' : Number(value)
    });
  };

  const packageOptions = [
    'Digital materials',
    'Certificate of completion',
    'Recorded sessions access',
    'Live Q&A sessions',
    'Networking opportunities',
    'Workshop materials',
    'Lunch & refreshments',
    'Welcome kit',
    'Follow-up resources',
    'One-on-one consultation',
    'VIP seating',
    'Exclusive networking dinner',
    'Premium resource pack',
    'Priority support'
  ];

  const currentPackages = data[`${type}_package` as keyof typeof data] as string[];

  return (
    <div className="space-y-2">
      <h3 className="font-medium">{capitalizedType} Package</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (Naira)</label>
          <input
            type="number"
            value={data[`${type}_naira` as keyof typeof data] === 0 ? '' : data[`${type}_naira` as keyof typeof data]}
            onChange={e => handlePriceChange('naira', e.target.value)}
            className="w-full border rounded-md p-2"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input
            type="number"
            value={data[`${type}_usd` as keyof typeof data] === 0 ? '' : data[`${type}_usd` as keyof typeof data]}
            onChange={e => handlePriceChange('usd', e.target.value)}
            className="w-full border rounded-md p-2"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Package Includes</label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
          {packageOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={currentPackages.includes(option)}
                onChange={() => onPackageChange(type, option)}
                className="rounded"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageSection;