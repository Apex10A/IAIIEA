"use client"
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const EventCreationForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Render progress bar
  const renderProgressBar = () => (
    <div className="flex w-[30%] justify-between mb-6">
      <div className={`w-[30%] rounded-2xl h-1 ${currentStep >= 1 ? 'bg-[#203A87]' : 'bg-gray-300'}`}></div>
      <div className={`w-[30%] rounded-2xl h-1 ${currentStep >= 2 ? 'bg-[#203A87]' : 'bg-gray-300'}`}></div>
      <div className={`w-[30%] rounded-2xl h-1 ${currentStep >= 3 ? 'bg-[#203A87]' : 'bg-gray-300'}`}></div>
    </div>
  );

  // Handle form submission
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render different steps based on event type
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='max-w-[70%]'>
            <div className='pt-10'>
              <div>
                <p className="text-[18px] font-[500] pb-2">{type === 'conference' ? 'Conference' : 'Seminar'} Title</p>
                <input 
                  type="text" 
                  placeholder={`${type === 'conference' ? 'Conference' : 'Seminar'} Title`} 
                  className="input-field border px-5 py-3 rounded-[30px] w-full mb-4" 
                />
              </div>
              <div className='py-3'>
                <p className="text-[18px] font-[500] pb-2">Theme</p>
                <input 
                  type="text" 
                  placeholder="Theme" 
                  className="input-field border px-5 py-3 rounded-[30px] w-full mb-4" 
                />
              </div>

              {type === 'conference' && (
                <>
                  <div>
                    <p className="text-[18px] font-[500] pb-2">Sub-theme</p>
                    <input 
                      type="text" 
                      placeholder="Subtheme" 
                      className="input-field border rounded-[30px] px-5 py-3 w-full mb-4" 
                    />
                  </div>
                  <div>
                    <p className="text-[18px] font-[500] pb-2">Workshop</p>
                    <input 
                      type="text" 
                      placeholder="Workshop" 
                      className="input-field border rounded-[30px] px-5 py-3 w-full mb-4" 
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between mb-4 mt-4">
                <div>
                  <p className="text-[18px] font-[500] pb-2">Start Date</p>
                  <input 
                    type="date" 
                    className="border rounded-[30px] px-5 py-3 w-full" 
                  />
                </div>

                <div>
                  <p className="text-[18px] font-[500] pb-2">End Date</p>
                  <input 
                    type="date" 
                    className="border rounded-[30px] px-5 py-3 w-full" 
                  />
                </div>
              </div>
            </div>
            
            <div className='flex items-center justify-between'>
              <p 
                className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' 
                onClick={() => router.push('/event-type')}
              >
                Cancel
              </p>
              <p 
                className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' 
                onClick={handleNext}
              >
                Next
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className='max-w-[70%]'>
            <div className="mb-4">
              <label className="block font-medium mb-2">Picture Gallery</label>
              <input 
                type="file" 
                multiple
                className="border p-2 rounded w-full" 
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Sponsors</label>
              <input 
                type="text" 
                placeholder="Add sponsors" 
                className="border p-2 rounded w-full" 
              />
            </div>
            
            <div className='flex items-center justify-between'>
              <p 
                className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' 
                onClick={handlePrevious}
              >
                Previous
              </p>
              <p 
                className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' 
                onClick={handleNext}
              >
                Next
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className='max-w-[70%]'>
            <div className="flex justify-between mb-4">
              <input 
                type="number" 
                placeholder="Fees (Naira)" 
                className="border p-2 rounded w-[48%]" 
              />
              <input 
                type="number" 
                placeholder="Fees (Dollars)" 
                className="border p-2 rounded w-[48%]" 
              />
            </div>
            <input 
              type="text" 
              placeholder="Package" 
              className="input-field border p-2 rounded w-full mb-4" 
            />
            
            <div className='flex items-center justify-between'>
              <p 
                className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' 
                onClick={handlePrevious}
              >
                Previous
              </p>
              <p 
                className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]'
              >
                Save
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='py-10'>
        <p className='text-[18px]'>
          Home {'>'} Create Event {'>'} <span className='font-[600]'>{type === 'conference' ? 'Conference' : 'Seminar'}</span>
        </p>
      </div>

      {renderProgressBar()}
      {renderStep()}
    </div>
  );
};

export default EventCreationForm;