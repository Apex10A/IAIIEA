import React from 'react';
import { Video, VideoOff } from 'lucide-react';

const VideosPage: React.FC<{ videos: string[] }> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <VideoOff className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-semibold">No Videos Available</h2>
        <p className="text-gray-400">Video content will be uploaded soon</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((videoUrl, index) => (
        <div 
          key={index} 
          className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform"
        >
          <video 
            controls 
            className="w-full h-48 object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideosPage;
