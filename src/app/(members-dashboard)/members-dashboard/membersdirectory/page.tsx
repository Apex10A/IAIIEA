"use client"
import React, { useState } from 'react';
import ButtonProp from '../notification/button';
import IAIIEAmembers from './IAIIEAmembers/page'
import EventSpeakers from './EventSpeakers/page'
import Volunteers from './Volunteers/page'
import ConferenceParticipants from './ConferenceParticipants/page'
import WorkshopParticipant from './WorkshopParticipants/page'
import { SectionType } from '../notification/buttonTs'
import   PortalAccessWrapper   from '@/components/ProtectedRoute';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('IAIIEA members');

  const renderContent = () => {
    switch (selectedSection) {
      case 'IAIIEA members':
        return (
          <div>
            <IAIIEAmembers/>
          </div>
        );
      // case 'Event speakers':
      //   return (
      //     <div>
      //       <EventSpeakers/>
      //     </div>
      //   );
      // case 'Conference participants':
      //   return (
      //     <div>
      //       <ConferenceParticipants/>
      //     </div>
      //   );
      // case 'Volunteers':
      //   return (
      //     <div>
      //       <Volunteers/>
      //     </div>
      //   );
      // case 'Workshop participants':
      //   return (
      //     <div>
      //       <WorkshopParticipant/>
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
   
    <div className='p-6'>
      <div className='bg-gray-200 px-5 py-3 mb-6 mt-10'>
        <h1 className='text-2xl text-gray-800'>Members Directory</h1>
      </div>
      {/* <div>
        <ButtonProp
          options={['IAIIEA members']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div> */}

      <div className='py-10'>
        

        {/* Render the content based on the selected section */}
        {renderContent()}
      </div>
    </div>

  );
};

export default Page;
