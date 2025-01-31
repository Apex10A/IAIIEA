'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Download, Eye, Video, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';

export type ResourceType = 'Video';

export interface Resource {
  resource_id?: string;
  resource_type: ResourceType;
  resource: string | File[];  // URL string for existing resources, File[] for uploads
  caption: string;
  created_at?: string;
}

interface ResourcesPageProps {
  initialResources?: Resource[];
  onUpload: (resource: Resource) => Promise<void>;
  onDelete?: (resourceId: string) => Promise<void>;
  uploadProgress?: number;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ 
  initialResources = [], 
  onUpload, 
  onDelete,
  uploadProgress
}) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const handleUpload = async (newResource: Resource) => {
    await onUpload(newResource);
  };

  return (
    <div className="container mx-auto p-6">
      {uploadProgress !== undefined && uploadProgress > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className="bg-white shadow-lg rounded-lg p-4 border border-blue-200">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out" 
                style={{width: `${uploadProgress}%`}}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Uploading Video</p>
              <p className="text-sm font-semibold text-blue-600">{uploadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video Resources</h1>
        <ResourceUploadModal onUpload={handleUpload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.resource_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold truncate max-w-[200px]">
                    {resource.caption}
                  </span>
                </div>
                {onDelete && resource.resource_id && (
                  <button 
                    onClick={() => onDelete(resource.resource_id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex flex-col gap-2">
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={typeof resource.resource === 'string' ? resource.resource : undefined}
                  >
                    Your browser does not support the video tag.
                  </video>
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
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No video resources found
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceUploadModal: React.FC<{ onUpload: (resource: Resource) => Promise<void> }> = ({ onUpload }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files || !caption.trim()) {
      alert('Please select videos and provide a caption');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resource_type', 'Video');
      formData.append('caption', caption.trim());
      formData.append('date', date || new Date().toISOString());
      
      // Append each file with the same field name
      Array.from(files).forEach((file) => {
        formData.append('resources[]', file);
      });

      await onUpload({
        resource_type: 'Video',
        resource: Array.from(files),
        caption: caption.trim(),
        created_at: date || new Date().toISOString()
      });
      
      // Reset form and close modal
      setFiles(null);
      setCaption('');
      setDate('');
      setIsOpen(false);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Videos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Video Resources</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="video-upload" className="block mb-2">
              Select Videos
            </label>
            <Input 
              id="video-upload"
              type="file" 
              accept="video/*"
              onChange={handleFileChange}
              multiple // Allow multiple file selection
              className="w-full"
            />
            {files && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {Array.from(files).map(file => file.name).join(', ')}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="video-caption" className="block mb-2">
              Video Caption
            </label>
            <Input 
              id="video-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a descriptive caption"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="video-date" className="block mb-2">
              Date (Optional)
            </label>
            <Input 
              id="video-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!files || !caption.trim()}
          >
            Upload Videos
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourcesPage;