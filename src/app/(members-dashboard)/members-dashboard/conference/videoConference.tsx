import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';


type ProgressState = {
  played: number;
  playedSeconds: number;
};


const CustomMediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Replace with your Vimeo video URL
  const videoUrl = "https://vimeo.com/1029612847";

  const handleProgress = (state: ProgressState) => {
    if (state) {
      setProgress(state.played * 100);
      setPlayedSeconds(state.playedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // const handleProgress = (state: OnProgressProps) => {
  //   if (state) {
  //     setProgress(state.played * 100);
  //     setPlayedSeconds(state.playedSeconds);
  //   }
  // };

  // const handleDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value) / 100;
    setProgress(seekTo * 100);
    playerRef.current?.seekTo(seekTo, 'seconds');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const pad = (num: number) => (`0${Math.floor(num)}`).slice(-2);
    const minutes = seconds / 60;
    const hours = minutes / 60;
    
    if (hours >= 1) {
      return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
    }
    return `${pad(minutes)}:${pad(seconds % 60)}`;
  };
  return (
    <div className="py-10 bg-[#F9FAFF]">
      <h1 className="text-2xl md:text-3xl text-gray-900 font-bold opacity-80 pb-2">
        Conference Resources
      </h1>
      
      <div className="max-w-2xl">
        <div className="relative" ref={containerRef}>
          <div className="relative w-full aspect-video bg-black rounded-t-xl overflow-hidden">
            <div className="relative w-full h-full">
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                width="100%"
                height="100%"
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
                config={{
                  vimeo: {
                    playerOptions: {
                      controls: false,
                      responsive: true,
                      dnt: true,
                      pip: false,
                      portrait: false,
                      title: false,
                      byline: false,
                      background: true
                    }
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            </div>

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
              {/* Progress Bar */}
              <div className="w-full group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
                />
                <div 
                  className="h-1 bg-white transition-all duration-300 ease-out relative -mt-1"
                  style={{ width: `${progress}%` }} 
                />
              </div>
              
              {/* Controls Bar */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-4">
                  {/* Play/Pause Button */}
                  <button 
                    onClick={togglePlayPause}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {isPlaying ? 
                      <Pause size={24} className="text-white" /> : 
                      <Play size={24} className="text-white" />
                    }
                  </button>

                  {/* Volume Controls */}
                  <div className="flex items-center space-x-2 group">
                    <button 
                      onClick={toggleMute}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {isMuted || volume === 0 ? 
                        <VolumeX size={24} className="text-white" /> : 
                        <Volume2 size={24} className="text-white" />
                      }
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover:w-20 transition-all duration-200 h-1 bg-white/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>

                  {/* Time Display */}
                  <div className="text-white text-sm">
                    {formatTime(playedSeconds)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleFullscreen}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {isFullscreen ? 
                      <Minimize size={24} className="text-white" /> : 
                      <Maximize size={24} className="text-white" />
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-b-xl px-7 pt-4 pb-8">
            <h1 className="text-gray-900 text-xl md:text-2xl">
              Strategic Thinking for Effective Spiritual and Secular Leadership.
              <span className="block text-lg text-gray-700 mt-3">
                <p className="text-[16px] md:text-[18px]">Talk Presented by Dr Mike Egbayelo, PhD, FCIS, FICBC, FIMC</p>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMediaPlayer;