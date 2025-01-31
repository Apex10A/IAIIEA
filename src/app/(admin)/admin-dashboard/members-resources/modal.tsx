'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Resource, ResourceType } from './types';

interface ResourceUploadModalProps {
  onUpload: (resource: Resource) => Promise<void>;
}

export const ResourceUploadModal: React.FC<ResourceUploadModalProps> = ({ onUpload }) => {
  const [open, setOpen] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceType>('Video');
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.length || !caption) {
      toast.error('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('resource_type', resourceType);
    formData.append('caption', caption);
    
    files.forEach((file, index) => {
      formData.append(`resource[${index}]`, file);
    });

    try {
      await onUpload({
        resource_type: resourceType,
        resource: files,
        caption
      });
      
      toast.success('Resource uploaded successfully');
      setOpen(false);
      // Reset form
      setFiles([]);
      setCaption('');
    } catch (error) {
      toast.error('Failed to upload resource');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Member Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select 
            value={resourceType} 
            onValueChange={(value: ResourceType) => setResourceType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            type="file" 
            multiple 
            onChange={handleFileChange}
            accept={resourceType === 'Video' 
              ? 'Video/*' 
              : resourceType === 'document' 
                ? '.pdf,.doc,.docx' 
                : 'image/*'
            }
          />

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="relative w-20 h-20 bg-gray-100 rounded"
                >
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs truncate p-1">{file.name}</p>
                </div>
              ))}
            </div>
          )}

          <Input 
            placeholder="Caption" 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <Button type="submit" className="w-full">Upload</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};