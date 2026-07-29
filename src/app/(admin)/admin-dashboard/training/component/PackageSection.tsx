import React from 'react';
import { PackageSectionProps, Step2Data } from './types';

const PackageSection: React.FC<PackageSectionProps> = ({
  type,
  data,
  onDataChange,
  required = false,
}) => {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  
  const handlePriceChange = (currency: 'naira' | 'usd', value: string) => {
    if (type === 'physical') {
      if (currency === 'naira') {
        onDataChange({ ...data, physical_fee_naira: value });
      } else {
        onDataChange({ ...data, physical_fee_usd: value });
      }
    } else {
      if (currency === 'naira') {
        onDataChange({ ...data, virtual_fee_naira: value });
      } else {
        onDataChange({ ...data, virtual_fee_usd: value });
      }
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">
        Standard {capitalizedType} Fee
        {required && <span className="text-red-500 ml-1">*</span>}
      </h3>
      <p className="text-xs text-gray-500">
        One standard rate for {type} attendance. Enter Naira, USD, or both.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (Naira)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={type === 'physical' ? data.physical_fee_naira || '' : data.virtual_fee_naira || ''}
            onChange={e => handlePriceChange('naira', e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={type === 'physical' ? data.physical_fee_usd || '' : data.virtual_fee_usd || ''}
            onChange={e => handlePriceChange('usd', e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageSection;