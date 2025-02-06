import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource, ResourcesPage } from './resources';
import { useSession } from "next-auth/react";
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Dialog from "@radix-ui/react-dialog";
import { showToast } from '@/utils/toast';

const Page = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchResources = async () => {
    try {
      const response = await axios.get('https://iaiiea.org/api/sandbox/member_resources', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          resource_type: 'Video'
        }
      });
  
      // Transform API response to match the Resource interface
      const formattedResources: Resource[] = response.data.data.map((item: any) => ({
        resource_id: item.resource_id.toString(),
        resource_type: item.resource_type,
        resource: item.file, // Use the file URL directly
        caption: item.caption,
        created_at: item.date
      }));
  
      console.log('Formatted Resources:', formattedResources); // Add this to debug
      setResources(formattedResources);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch video resources');
    }
  };
  
  const handleUpload = async (resource: Resource) => {
    const formData = new FormData();
    formData.append('resource_type', 'Video');
    formData.append('caption', resource.caption);
    formData.append('date', resource.created_at || new Date().toISOString());
    
    // Append each file with the same field name 'resources[]'
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
  
      showToast.success('Video upload complete');
      setUploadProgress(0);
      await fetchResources();
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Video upload failed');
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
      showToast.success('Video resource deleted');
      await fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      showToast.error('Failed to delete video resource');
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