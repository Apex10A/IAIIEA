import React from 'react';

type SectionType = 'Conference Portal' | 'Conference Directory' | 'Conference Resources';

interface ButtonPropProps {
  options: SectionType[];
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
}

const ButtonProp: React.FC<ButtonPropProps> = ({ options, selectedSection, setSelectedSection }) => (
  <div>
    {options.map((option) => (
      <button
        key={option}
        onClick={() => setSelectedSection(option)}
        className={`${
          selectedSection === option ? 'bg-[#203a87] text-white' : 'bg-transparent text-black'
        } px-5 py-2 font-semibold rounded-3xl transition-all duration-200`}
      >
        {option}
      </button>
    ))}
  </div>
);

export default ButtonProp;
