import React from 'react';

const NewsIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M22 3H2V19H22V3Z" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 7H17" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 11H17" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 15H12" 
      stroke={isActive ? "#FFFFFF" : "#9CA3AF"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default NewsIcon;