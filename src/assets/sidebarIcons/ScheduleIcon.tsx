import React from 'react';

const ScheduleIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default ScheduleIcon;