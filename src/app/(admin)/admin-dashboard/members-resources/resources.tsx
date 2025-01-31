'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Resource } from './types';
import { ResourceUploadModal } from './modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Download, Eye, Video, FileText, Image as ImageIcon, X } from 'lucide-react';

interface ResourcesPageProps {
  initialResources?: Resource[];
  onUpload: (resource: Resource) => Promise<void>;
  onDelete?: (resourceId: string) => Promise<void>;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ 
  initialResources = [], 
  onUpload, 
  onDelete 
}) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [activeTab, setActiveTab] = useState<'Video' | 'document' | 'image'>('Video');

  const handleUpload = async (newResource: Resource) => {
    await onUpload(newResource);
    // Assuming onUpload returns the created resource with an ID
    // setResources(prev => [...prev, newResource]);
  };

  const filteredResources = resources.filter(r => r.resource_type === activeTab);

  const renderResourceIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Video />;
      case 'document': return <FileText />;
      case 'image': return <ImageIcon />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Resources</h1>
        <ResourceUploadModal onUpload={handleUpload} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Video">Videos</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderResourceIcon(resource.resource_type)}
                    <span className="font-semibold truncate max-w-[200px]">
                      {resource.caption}
                    </span>
                  </div>
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(resource.id!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {resource.created_at 
                        ? format(new Date(resource.created_at), 'PPP') 
                        : 'No date'}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredResources.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No {activeTab} resources found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};