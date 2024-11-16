import React from 'react';
import { SectionType } from './buttonTs';

interface ButtonPropProps {
  options: SectionType[];
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
}

const ButtonProp: React.FC<ButtonPropProps> = ({ options, selectedSection, setSelectedSection }) => (
  <div className='flex w-full md:w-auto gap-2'>
    {options.map((option) => (
      <button
        key={option}
        onClick={() => setSelectedSection(option)}
        className={`${
          selectedSection === option ? 'bg-[#203a87] text-white flex w-full md:w-auto text-[16px] md:text-[18px]' : 'bg-transparent text-black'
        } px-3 md:px-5 py-2 font-semibold rounded-lg border  w-full md:w-auto transition-all duration-200 text-[16px] md:text-[18px]`}
      >
        {option}
      </button>
    ))}
  </div>
);

export default ButtonProp;
