import React, { useState } from 'react';
import { PackageSectionProps } from './types';

const PackageSection: React.FC<PackageSectionProps> = ({
  type,
  data,
  onDataChange,
  onPackageChange
}) => {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const [newPackageItem, setNewPackageItem] = useState('');
  
  const handlePriceChange = (currency: 'naira' | 'usd', value: string) => {
    const fieldName = `${type}_${currency}` as keyof typeof data;
    onDataChange({
      ...data,
      [fieldName]: value
    });
  };

  const currentPackages = data[`${type}_package` as keyof typeof data] as string[];

  const addPackageItem = () => {
    if (newPackageItem.trim() && !currentPackages.includes(newPackageItem.trim())) {
      onPackageChange(type, newPackageItem.trim());
      setNewPackageItem('');
    }
  };

  const removePackageItem = (item: string) => {
    onPackageChange(type, item);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPackageItem();
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">{capitalizedType} Package</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (Naira)</label>
          <input
            type="number"
            value={data[`${type}_naira` as keyof typeof data] || ''}
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
            value={data[`${type}_usd` as keyof typeof data] || ''}
            onChange={e => handlePriceChange('usd', e.target.value)}
            className="w-full border rounded-md p-2"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Package Includes</label>
        
        {/* Add new package item */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPackageItem}
            onChange={(e) => setNewPackageItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add package item (e.g., Food, Accommodation, Materials)"
            className="flex-1 border rounded-md p-2 text-sm"
          />
          <button
            type="button"
            onClick={addPackageItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Add
          </button>
        </div>

        {/* Display current package items */}
        <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
          {currentPackages.length === 0 ? (
            <p className="text-gray-500 text-sm">No package items added yet</p>
          ) : (
            currentPackages.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removePackageItem(item)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageSection;