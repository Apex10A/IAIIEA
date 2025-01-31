import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Resource } from './types'
import { ResourcesPage } from './resources'
import { useSession } from "next-auth/react";
import { toast } from 'sonner';

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
                }
            });
            setResources(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch resources');
        }
    };

    const handleUpload = async (resource: Resource) => {
        const file = resource.resource[0];
        
        try {
            const formData = new FormData();
            formData.append('resource_type', resource.resource_type);
            formData.append('caption', resource.caption);
            formData.append('date', new Date().toISOString());
            formData.append('resource', file);

            await axios.post('https://iaiiea.org/api/sandbox/admin/upload_member_resource',  {
                headers: {
                    body: formData,
                    'Authorization': `Bearer ${bearerToken}`
                },
                onUploadProgress: (progressEvent: { loaded: number; total: number; }) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
                timeout: 300000 // 5-minute timeout
            });

            toast.success('Upload complete');
            setUploadProgress(0);
            fetchResources();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed');
            setUploadProgress(0);
        }
    };

    useEffect(() => {
        if (bearerToken) {
            fetchResources();
        }
    }, [bearerToken]);

    return (
        <>
            {uploadProgress > 0 && (
                <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{width: `${uploadProgress}%`}}
                            ></div>
                        </div>
                        <p className="text-center mt-2">{uploadProgress}% Uploaded</p>
                    </div>
                </div>
            )}
            <ResourcesPage 
                initialResources={resources}
                onUpload={handleUpload}
            />
        </>
    )
}

export default Page