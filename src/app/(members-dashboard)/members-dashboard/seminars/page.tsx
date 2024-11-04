import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1); // Controls current step (1, 2, or 3)
  const [selectedSection, setSelectedSection] = useState<'Seminar' | 'CreateEvent'>('CreateEvent'); // Default to Create Event

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handler to go back to the seminar section
  const handleBackToSeminar = () => {
    setSelectedSection('Seminar');
    setCurrentStep(1); // Reset the form steps when switching back
  };

  // Handler for changing the section to multi-step event creation
  const handleCreateEventClick = () => {
    setSelectedSection('CreateEvent');
  };

  // Progress bar component
  const renderProgressBar = () => {
    return (
      <div className="flex w-[30%] justify-between mb-6">
        <div className={`w-[30%] rounded-2xl h-1 ${currentStep >= 1 ? 'bg-[#203A87]' : 'bg-gray-300'}`}></div>
        <div className={`w-[30%] rounded-2xl h-1 ${currentStep >= 2 ? 'bg-[#203A87]' : 'bg-gray-300'}`}></div>
        <div className={`w-[30%] rounded-2xl h-1 ${currentStep >= 3 ? 'bg-[#203A87]' : 'bg-gray-300'}`}></div>
      </div>
    );
  };

  // Render the step form based on the currentStep value
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='max-w-[60%]'>
            <h2 className="text-[24px] font-[600] mb-4">Create Event</h2>
            <div>
              <p className="text-[18px] font-[500] pb-2">Event Type</p>
              <input 
                type="text" 
                placeholder="Select event type" 
                className="input-field border px-5 py-3 rounded-[30px] w-full  mb-4"
              />
            </div>
            <div className='flex items-center justify-between'>
              <p className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' onClick={handleBackToSeminar}>Cancel</p>
              <p className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' onClick={handleNext}>Next</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='max-w-[70%]'>
            <div className='pt-10'>
              <div>
                <p className="text-[18px] font-[500] pb-2">Conference Title</p>
                <input type="text" placeholder="Conference Title" className="input-field border px-5 py-3 rounded-[30px] w-full mb-4" />
              </div>
              <div className='py-3'>
                <p className="text-[18px] font-[500] pb-2">theme</p>
              <input type="text" placeholder="Theme" className="input-field border px-5 py-3 rounded-[30px] w-full mb-4" />
              </div>

              <div>
              <p className="text-[18px] font-[500] pb-2">location</p>
              <input type="text" placeholder="Location" className="input-field border px-5 py-3 rounded-[30px] w-full mb-4" />
              </div>

              <div className="flex justify-between mb-4 mt-4">
                <div>
                  <p className="text-[18px] font-[500] pb-2">start date</p>
                <input type="date" placeholder="Start Date" className="border rounded-[30px] px-5 py-3 w-full" />
                </div>

               <div>
                <p className="text-[18px] font-[500] pb-2">end date</p>
               <input type="date" placeholder="End Date" className="border rounded-[30px] px-5 py-3 w-full" />
               </div>
              </div>

             <div>
              <p className="text-[18px] font-[500] pb-2">sub-theme</p>
             <input type="text" placeholder="Subtheme" className="input-field border rounded-[30px] px-5 py-3 w-full mb-4" />
             </div>

              <div>
              <p className="text-[18px] font-[500] pb-2">workshop</p>
              <input type="text" placeholder="Workshop" className="input-field border rounded-[30px] px-5 py-3 w-full mb-4" />
              </div>

              <div>
              <p className="text-[18px] font-[500] pb-2">important date</p>
              <input type="text" placeholder="Important Date" className="input-field border rounded-[30px] px-5 py-3 w-full mb-4" />
              </div>

              <div>
              <p className="text-[18px] font-[500] pb-2">call for paper flyer</p>
              <input type="file" className="input-field border rounded-[30px] px-5 py-3 w-full mb-4 h-44" />
              </div>
            </div>
            
            <div className='flex items-center justify-between'>
              <p className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' onClick={handlePrevious}>Previous</p>
              <p className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' onClick={handleNext}>Next</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className='max-w-[70%]'>
            <h2 className="text-[24px] font-[600] mb-4">Create Event</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Picture gallery</label>
              <input type="file" multiple className="border p-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Sponsors</label>
              <input type="text" placeholder="Add sponsors" className="border p-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Videos</label>
              <input type="file" multiple className="border p-2 rounded w-full" />
            </div>
            <div className="flex justify-between mb-4">
              <input type="text" placeholder="Fees (Naira)" className="border p-2 rounded w-[48%]" />
              <input type="text" placeholder="Fees (Dollars)" className="border p-2 rounded w-[48%]" />
            </div>
            <input type="text" placeholder="Package" className="input-field border p-2 rounded w-full mb-4" />
            
            <div className='flex items-center justify-between'>
              <p className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]' onClick={handlePrevious}>Previous</p>
              <p className='font-[600] text-[17px] cursor-pointer pt-4 text-[#0B142F]'>Save</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='py-10'>
        <p className='text-[18px]'>
          Home {'>'} <span className='font-[600]'>{selectedSection === 'Seminar' ? 'Seminar' : 'Create Event'}</span>
        </p>
      </div>

      {selectedSection === 'Seminar' ? (
        <>
          <div className='border p-4 rounded-lg my-10'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-[20px] font-[500]'>Start an instant virtual event</h3>
              </div>
              <div>
                <p className='font-[600] text-[#203a87] text-[20px]'>Start</p>
              </div>
            </div>
          </div>
          <div className='border p-4 rounded-lg my-10'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-[20px] font-[500]'>Schedule virtual events</h3>
              </div>
              <div>
                <p className='font-[600] text-[#203a87] text-[20px]'>Schedule</p>
              </div>
            </div>
          </div>
          <div 
            className='border p-4 rounded-lg my-10 cursor-pointer'
            onClick={handleCreateEventClick}
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-[20px] font-[500]'>Create Events</h3>
              </div>
              <div>
                <FiChevronRight />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Render progress bar */}
          {renderProgressBar()}

          {/* Render the current step form */}
          {renderStep()}
        </>
      )}
    </div>
  );
};

export default Page;
