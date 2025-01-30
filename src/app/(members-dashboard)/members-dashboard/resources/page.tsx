"use client"
import React, { useState, useEffect } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Resource {
  resource_id: string;
  caption: string;
  date: string;
  file?: string;
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#F5F4F3] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-[#0B142F] mb-2">{resource.caption}</h3>
          <p className="text-[16px] text-gray-600 mb-2">Date: {formatDate(resource.date)}</p>
          {resource.file && (
            <a 
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center text-[#203a87] hover:text-[#152a61] underline font-semibold"
            >
              View Resource
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources available</h3>
    <p className="text-gray-500">Check back later for new resources.</p>
  </div>
);

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Members resources');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/member_resources`, {
        headers: {
          'Authorization': `Bearer ${session?.user?.token || session?.user?.userData?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data = await response.json();
      
      if (data.status === "success") {
        setResources(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch resources');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.token || session?.user?.userData?.token) {
      fetchResources();
    }
  }, [session]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#203a87]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      );
    }

    if (resources.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.resource_id}
            resource={resource}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="bg-gray-200 px-5 py-3 mb-6 mt-10">
        <h1 className="text-lg md:text-2xl text-black">IAIIEA Resources</h1>
      </div>
      <div className='pt-10'>
        {/* <div className="mb-6">
          <ButtonProp
            options={['Members resources']}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </div> */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;