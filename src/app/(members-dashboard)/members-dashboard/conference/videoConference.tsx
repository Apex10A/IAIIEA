import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

const CustomMediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = 'NP5QrQsIRqM';

  return (
    <div className='py-10'>
        <div>
        <h1 className='text-[35px] text-[#0B142F] font-[700] opacity-[0.8] pb-2'>Conference Resources</h1>
    </div>
    <div className="max-w-[600px]">
      <div className="relative">
        <div className="absolute z-[20] bottom-5 right-5">
          <button className="bg-[#f2e9c3] px-3 py-2 rounded-md font-[600] text-[18px]">
            1:12:00
          </button>
        </div>
        
        <div className="absolute z-[20] top-7 right-0">
          <button className="bg-[#f2e9c3] px-5 py-3 rounded-l-[30px] font-[500] text-[18px]">
            Video resources
          </button>
        </div>

        {/* Video/Thumbnail Container */}
        <div className="relative w-full aspect-video bg-black">
          {!isPlaying ? (
            <>
              <Image 
                src="/Meeting.png"
                alt="Video thumbnail" 
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 bg-white/80 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <Play size={32} className="text-black ml-1" />
              </button>
            </>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          )}
        </div>
      </div>

      <div className="bg-[#fff] border rounded-b-2xl px-7 pt-3 pb-8 max-w-[600px]">
        <p className="text-[#0B142F] text-[24px] font-[500] max-w-xl pt-3 pb-2">
          Strategic Thinking for Effective Spiritual and Secular Leadership. 
          Talk Presented by Dr Mike Egbayelo, PhD,FCIS, FICBC, FIMC
        </p>
        <button className="font-[600] underline pt-3">
          Audio listen
        </button>
      </div>
    </div>
    </div>
  );
};

export default CustomMediaPlayer;