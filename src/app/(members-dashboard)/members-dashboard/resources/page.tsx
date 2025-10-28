'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource, ResourcesPage } from './resources';
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/member_resources`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Transform API response to match the Resource interface
      const formattedResources: Resource[] = response.data.data.map((item: any) => ({
        resource_id: item.resource_id.toString(),
        resource_type: item.resource_type,
        resource: item.file,
        caption: item.caption,
        created_at: item.date
      }));

      setResources(formattedResources);
    } catch (error) {
      console.error('Fetch error:', error);
      showToast.error('Failed to fetch resources');
    }
  };

  const handleUpload = async (resource: Resource) => {
    const formData = new FormData();
    formData.append('resource_type', resource.resource_type);
    formData.append('caption', resource.caption);
    formData.append('date', resource.created_at || new Date().toISOString());

    if (Array.isArray(resource.resource)) {
      resource.resource.forEach((file) => {
        formData.append('resources[]', file);
      });
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/upload_member_resource`, formData, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
        timeout: 300000 // 5-minute timeout
      });

      showToast.success('Resource upload complete');
      setUploadProgress(0);
      await fetchResources();
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Resource upload failed');
      setUploadProgress(0);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_member_resource/${resourceId}}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      showToast.success('Resource deleted');
      await fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      showToast.error('Failed to delete resource');
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchResources();
    }
  }, [bearerToken]);

  // Show warning and hide content if registration is incomplete
  if (session?.user?.userData?.registration === "incomplete") {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your registration is incomplete. Please complete your registration to access all features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Resources Section */}
      <ResourcesPage
        initialResources={resources}
        onUpload={handleUpload}
        onDelete={handleDelete}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default Page;