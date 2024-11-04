import React from 'react';

interface ToggleButtonProps {
  options: string[];
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ options, selectedSection, setSelectedSection }) => {
  return (
    <div className="flex space-x-1 bg-white border p-2 rounded-3xl max-w-[95%]">
      {options.map((option, idx) => (
        <button
          key={idx}
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
};

export default ToggleButton;
