import React from 'react';
import { Download } from 'lucide-react';

const CallForPapersPage: React.FC<{ flyer: string }> = ({ flyer }) => {
  const handleDownloadFlyer = () => {
    // Implement flyer download logic
    window.open(flyer, '_blank');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-[#1A2A5C]">Call for Papers</h2>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-gray-700 mb-6">
          We invite submissions for IAIIEA conference 2024. We seek innovative research and 
          insights on a topic which aligns with the conference theme. Please submit your 
          abstract by December 31, 2024 to iaiiea2024@iaiiea.org. The paper should, specifically, 
          address issues outlined in the associated sub-themes.
        </p>
        
        <div className="flex justify-center">
          <button 
            onClick={handleDownloadFlyer}
            className="bg-[#D5B93C] text-black px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition"
          >
            <Download className="w-5 h-5" />
            <span>Download Conference Flyer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallForPapersPage;