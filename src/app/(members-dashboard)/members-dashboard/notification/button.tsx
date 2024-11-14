import React from 'react';

type SectionType = 'Conference Portal' | 'Conference Directory' | 'Conference Resources';

interface ButtonPropProps {
  options: SectionType[];
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
}

const ButtonProp: React.FC<ButtonPropProps> = ({ options, selectedSection, setSelectedSection }) => (
  <div className='flex'>
    {options.map((option) => (
      <button
        key={option}
        onClick={() => setSelectedSection(option)}
        className={`${
          selectedSection === option ? 'bg-[#203a87] text-white flex text-[16px] md:text-[18px]' : 'bg-transparent text-black'
        } px-3 md:px-5 py-2 font-semibold rounded-3xl border ml-2 transition-all duration-200 text-[16px] md:text-[18px]`}
      >
        {option}
      </button>
    ))}
  </div>
);

export default ButtonProp;
