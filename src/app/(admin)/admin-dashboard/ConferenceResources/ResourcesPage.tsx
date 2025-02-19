'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource, ResourcesPage } from './resources';
import { useSession } from "next-auth/react";
import { toast } from 'sonner';

const Page = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchResources = async () => {
    try {
      const response = await axios.get('https://iaiiea.org/api/sandbox/conference_resources', {
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
      toast.error('Failed to fetch resources');
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
      await axios.post('https://iaiiea.org/api/sandbox/admin/upload_member_resource', formData, {
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

      toast.success('Resource upload complete');
      setUploadProgress(0);
      await fetchResources();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Resource upload failed');
      setUploadProgress(0);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await axios.delete(`https://iaiiea.org/api/sandbox/admin/delete_member_resource/${resourceId}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      toast.success('Resource deleted');
      await fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resource');
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchResources();
    }
  }, [bearerToken]);

  return (
    <ResourcesPage
      initialResources={resources}
      onUpload={handleUpload}
      onDelete={handleDelete}
      uploadProgress={uploadProgress}
    />
  );
};

export default Page;