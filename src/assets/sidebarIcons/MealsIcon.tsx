import React from 'react';

const MealsIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M18 22V21C18 19.9 17.1 19 16 19H8C6.9 19 6 19.9 6 21V22" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M17 15H7C4.8 15 3 13.21 3 11V7C3 4.79 4.8 3 7 3H17C19.2 3 21 4.79 21 7V11C21 13.21 19.2 15 17 15Z" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 3V15" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default MealsIcon;