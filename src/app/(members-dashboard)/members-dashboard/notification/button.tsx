import React from 'react';
import { SectionType } from './buttonTs';

interface ButtonPropProps {
  options: SectionType[];
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
}

const ButtonProp: React.FC<ButtonPropProps> = ({ 
  options, 
  selectedSection, 
  setSelectedSection 
}) => {
  const handleSectionChange = (option: SectionType) => {
    setSelectedSection(option);
  };

  return (
    <div className='flex flex-col sm:flex-row w-full sm:w-auto gap-2'>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSectionChange(option)}
          className={`
            px-4 py-2.5 
            font-medium 
            rounded-lg 
            border border-border
            transition-all duration-200 
            text-sm
            w-full sm:w-auto text-black dark:text-gray-300
            ${
              selectedSection === option 
                ? 'bg-primary text-black shadow-lg border-primary ring-2 ring-primary/30 scale-105 transition-all duration-300' 
                : 'bg-white text-black hover:bg-gray-50 dark:hover:bg-gray-800 opacity-80 border-gray-300'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ButtonProp;