import React from 'react';

const ConferencePortalIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M17 22H7C4 22 2 20 2 17V7C2 4 4 2 7 2H17C20 2 22 4 22 7V17C22 20 20 22 17 22Z" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 2V22" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M17 2V22" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 12H22" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 7H7" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 17H7" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M17 17H22" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M17 7H22" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default ConferencePortalIcon;