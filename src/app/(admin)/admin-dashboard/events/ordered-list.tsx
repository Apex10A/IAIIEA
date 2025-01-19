import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';

interface DynamicListInputProps {
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
}

export const DynamicListInput: React.FC<DynamicListInputProps> = ({
  label,
  items,
  onItemsChange,
  placeholder = "Enter item"
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onItemsChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, index) => index !== indexToRemove));
  };

  const updateItem = (index: number, newValue: string) => {
    const updatedItems = [...items];
    updatedItems[index] = newValue;
    onItemsChange(updatedItems);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* List of current items */}
      {items.length > 0 && (
        <ol className="list-decimal list-inside space-y-2 mb-2 bg-gray-50 p-4 rounded">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center space-x-2 group"
            >
              <span className="flex-grow">{item}</span>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={() => removeItem(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </li>
          ))}
        </ol>
      )}
      
      {/* Input for adding new items */}
      <div className="flex space-x-2">
        <Input 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button 
          type="button"
          onClick={addItem}
          disabled={!newItem.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
};

// Example of how to use in a parent component
export const EventFormExample = () => {
  const [subthemes, setSubthemes] = useState<string[]>([]);
  const [workshops, setWorkshops] = useState<string[]>([]);
  const [importantDates, setImportantDates] = useState<{ label: string, date: string }[]>([]);

  return (
    <div className="space-y-4">
      <DynamicListInput 
        label="Subthemes"
        items={subthemes}
        onItemsChange={setSubthemes}
        placeholder="Enter subtheme"
      />

      <DynamicListInput 
        label="Workshops"
        items={workshops}
        onItemsChange={setWorkshops}
        placeholder="Enter workshop"
      />

      {/* For important dates, you might want a custom version with date input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Important Dates</label>
        {importantDates.map((date, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input 
              placeholder="Date Label (e.g., Abstract Submission)"
              value={date.label}
              onChange={(e) => {
                const updatedDates = [...importantDates];
                updatedDates[index].label = e.target.value;
                setImportantDates(updatedDates);
              }}
            />
            <Input 
              type="date"
              value={date.date}
              onChange={(e) => {
                const updatedDates = [...importantDates];
                updatedDates[index].date = e.target.value;
                setImportantDates(updatedDates);
              }}
            />
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => {
                const filteredDates = importantDates.filter((_, i) => i !== index);
                setImportantDates(filteredDates);
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button 
          type="button"
          onClick={() => {
            setImportantDates([...importantDates, { label: '', date: '' }]);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Important Date
        </Button>
      </div>
    </div>
  );
};