import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';

const CustomMediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);
  const videoUrl = 'https://www.youtube.com/watch?v=NP5QrQsIRqM';

  const handleProgress = (state: { played: number; }) => {
    setProgress(state.played * 100);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="py-10  bg-[#F9FAFF]">
      <h1 className="text-3xl text-gray-900 font-bold opacity-80 pb-2">
        Conference Resources
      </h1>
      
      <div className="max-w-2xl">
        <div className="relative">
          <div className="relative w-full aspect-video bg-black rounded-t-xl overflow-hidden">
            {/* Wrapper div to control iframe visibility */}
            <div className="relative w-full h-full">
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={isPlaying}
                width="100%"
                height="100%"
                onProgress={handleProgress}
                controls={false}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      controls: 0,
                      showinfo: 0,
                      iv_load_policy: 3,
                      disablekb: 1
                    },
                    embedOptions: {
                      controls: 0
                    }
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
              
              {/* Overlay to hide YouTube elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-16 bg-black" /> {/* Hide top bar */}
                <div className="absolute bottom-16 right-0 w-24 h-24 bg-black" /> {/* Hide logo */}
              </div>
            </div>

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/30">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }} 
                />
              </div>
              
              {/* Controls Bar */}
              <div className="flex items-center justify-between px-4 py-3">
                <button 
                  onClick={togglePlayPause}
                  className="hover:opacity-80 transition-opacity"
                >
                  {isPlaying ? 
                    <Pause size={24} className="text-white" /> : 
                    <Play size={24} className="text-white" />
                  }
                </button>
                
                {/* Time Display - Optional */}
                <div className="text-white text-sm ml-4">
                  {Math.floor(progress * 1.12)} min
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-b-xl px-7 pt-3 pb-8">
            <h2 className="text-gray-900 text-2xl font-medium">
              Strategic Thinking for Effective Spiritual and Secular Leadership.
              <span className="block text-lg text-gray-700 mt-1">
                Talk Presented by Dr Mike Egbayelo, PhD, FCIS, FICBC, FIMC
              </span>
            </h2>
            <button className="font-semibold text-blue-600 hover:text-blue-700 underline pt-3">
              Listen to audio version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMediaPlayer;