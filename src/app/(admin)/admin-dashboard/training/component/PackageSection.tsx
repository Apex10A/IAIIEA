import React from 'react';
import { PackageSectionProps, Step2Data } from './types';

const PackageSection: React.FC<PackageSectionProps> = ({
  type,
  data,
  onDataChange
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
      <h3 className="font-medium">{capitalizedType} Fee</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (Naira)</label>
          <input
            type="number"
            value={type === 'physical' ? data.physical_fee_naira || '' : data.virtual_fee_naira || ''}
            onChange={e => handlePriceChange('naira', e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD)</label>
          <input
            type="number"
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