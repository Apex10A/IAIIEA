import React from 'react';

const SpeakersIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 12H6" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M18 12H21" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 21V18" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 6V3" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M4.92871 19.071L7.05072 16.949" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M16.9497 7.05005L19.0717 4.92804" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M4.92871 4.92896L7.05072 7.05097" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M16.9497 16.949L19.0717 19.071" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default SpeakersIcon;