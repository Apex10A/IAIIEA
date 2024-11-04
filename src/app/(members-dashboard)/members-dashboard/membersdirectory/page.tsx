import React, { useState } from 'react';
import ButtonProp from '../notification/button';
import IAIIEAmembers from './IAIIEAmembers/page'
import EventSpeakers from './EventSpeakers/page'
import Volunteers from './Volunteers/page'
import ConferenceParticipants from './ConferenceParticipants/page'
import WorkshopParticipant from './WorkshopParticipants/page'
const Page = () => {
  const [selectedSection, setSelectedSection] = useState<'IAIIEA members' | 'Event speakers' | 'Conference participants' | 'Volunteers' | 'Workshop participants'>('IAIIEA members');

  const renderContent = () => {
    switch (selectedSection) {
      case 'IAIIEA members':
        return (
          <div>
            <IAIIEAmembers/>
          </div>
        );
      case 'Event speakers':
        return (
          <div>
            <EventSpeakers/>
          </div>
        );
      case 'Conference participants':
        return (
          <div>
            <ConferenceParticipants/>
          </div>
        );
      case 'Volunteers':
        return (
          <div>
            <Volunteers/>
          </div>
        );
      case 'Workshop participants':
        return (
          <div>
            <WorkshopParticipant/>
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
          Home {'>'} <span className='font-[600]'>Members Directory</span>
        </p>
      </div>

      <div>
        <ButtonProp
          options={['IAIIEA members', 'Event speakers', 'Conference participants', 'Volunteers', 'Workshop participants']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div>

      <div className='py-10'>
        

        {/* Render the content based on the selected section */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;
