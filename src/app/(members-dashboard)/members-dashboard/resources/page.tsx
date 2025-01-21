"use client"
import React, { useState, useEffect } from 'react';
import AddFileModal from './AddFileModal';
import Link from 'next/link';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface Resource {
  resource_id: string; // or `number` depending on your data
  caption: string;
  date: string; // or `Date` if the API returns a Date object
  file?: string; // optional, since it's conditionally rendered
}
interface ResourceCardProps {
  resource: Resource;
}

// Resource Card Component
const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <div className="bg-[#F5F4F3] rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-[#0B142F] mb-2">{resource.caption}</h3>
          <p className="text-[16px] text-gray-600 mb-2">Date: {formatDate(resource.date)}</p>
          {resource.file && (
            <a 
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-[#203a87] hover:text-[#152a61] underline font-semibold"
            >
              View Resource
            </a>
          )}
        </div>
       
      </div>
    </div>
  );
};

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Conference resources');
  const [resources, setResources] = useState({
    conference: [],
    seminar: [],
    members: []
  });
  const { data: session } = useSession();

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/landing/event_details/1`);
      const data = await response.json();
      if (data.status === "success") {
        setResources(prev => ({
          ...prev,
          conference: data.data.resources || []
        }));
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);



  const renderCurrentSection = () => {
    let currentResources: any[] = [];
    let uploadEndpoint = '';

    switch (selectedSection) {
      case 'Conference resources':
        currentResources = resources.conference;
        uploadEndpoint = '/admin/upload_conference_resource';
        break;
      case 'Seminar resources':
        currentResources = resources.seminar;
        uploadEndpoint = '/admin/upload_seminar_resource';
        break;
      case 'Members resources':
        currentResources = resources.members;
        uploadEndpoint = '/admin/upload_member_resource';
        break;
    }

    return (
      <div className="my-5">
        {/* <div className="flex justify-between items-center mb-6">
          <AddFileModal />
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentResources.map((resource) => (
            <ResourceCard
              key={resource.resource_id}
              resource={resource}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="bg-gray-200 px-5 py-3 mb-6 mt-10">
        <h1 className="text-2xl">IAIIEA Resources</h1>
      </div>
      <div>
        <div className="mb-6">
          <ButtonProp
            options={['Conference resources', 'Seminar resources', 'Members resources']}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </div>
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default Page;