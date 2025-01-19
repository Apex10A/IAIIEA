import React, { useState } from 'react'

type ToggleButtonProps = {
  title: string;
  subtitle: string;
};
const ToggleButton: React.FC<ToggleButtonProps> = ({title, subtitle}) => {
  const [activeOption, setActiveOption] = useState(title[0]);

  const handleClick = (option: string) => {
    setActiveOption(option);
  };
  return (
    <div>
        <div className='border max-w-[400px] rounded-3xl px-2 py-2'>
            <button 
              className='bg-[#203a87] px-4 py-2 rounded-3xl text-[#fff] mr-5 font-[600]'>{title}
            </button>
            <button>{subtitle}
            </button>
        </div>
    </div>
  )
}

export default ToggleButton