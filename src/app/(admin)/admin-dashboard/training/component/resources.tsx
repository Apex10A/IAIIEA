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
import { Download, File, Video, Music, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from '@/utils/toast';
import { useSession } from 'next-auth/react';

export type ResourceType = 'Video' | 'Audio' | 'PDF' | 'PPT' | 'DOCX';

export interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

interface ResourcesPageProps {
  initialResources?: Resource[];
  onUpload: (resource: Resource) => Promise<void>;
  onDelete?: (resourceId: string) => Promise<void>;
  uploadProgress?: number;
}

const getFileIcon = (type: ResourceType) => {
  switch (type) {
    case 'Video': return <Video className="w-5 h-5" />;
    case 'Audio': return <Music className="w-5 h-5" />;
    case 'PDF': return <FileText className="w-5 h-5" />;
    case 'PPT':
    case 'DOCX': return <File className="w-5 h-5" />;
  }
};

const ResourceCard: React.FC<{ resource: Resource; onDelete?: (id: string) => Promise<void> }> = ({ resource, onDelete }) => {
  const isMediaResource = resource.resource_type === 'Video' || resource.resource_type === 'Audio';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 pt-2">
        <div className="flex flex-col gap-2">
          {isMediaResource ? (
            resource.resource_type === 'Video' ? (
              <video 
                controls 
                className="w-full rounded-lg"
                src={typeof resource.file === 'string' ? resource.file : undefined}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <audio 
                controls 
                className="w-full"
                src={typeof resource.file === 'string' ? resource.file : undefined}
              >
                Your browser does not support the audio tag.
              </audio>
            )
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
              {getFileIcon(resource.resource_type as ResourceType)}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {resource.date 
                ? format(new Date(resource.date), 'PPP') 
                : 'No date'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <div className="flex items-center gap-2 px-4">
        {getFileIcon(resource.resource_type as ResourceType)}
        <span className="font-semibold truncate max-w-[200px]">
          <h1 className='text-md md:text-lg'>{resource.caption}</h1>
        </span>
      </div>

      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className='flex items-center justify-between w-full'>
          <div className="flex gap-2">
            <button className="text-black bg-gray-100 rounded-md flex gap-2 px-4 py-2">
              <Download className="w-5 h-5" />
              <span className='text-sm'>Download {resource.resource_type?.toLowerCase()}</span>
            </button>
          </div>
          
          {onDelete && resource.resource_id.toString() && (
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button className="text-left px-4 py-2 bg-gray-100 rounded-md flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span className='text-sm'>Delete</span>
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
                <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
                  <AlertDialog.Title className="text-lg font-semibold">
                    Delete {resource.resource_type?.toLowerCase()}
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
                    Are you sure you want to delete this {resource.resource_type?.toLowerCase()}? This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button 
                        onClick={() => onDelete(resource.resource_id.toString())}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

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

  const mediaResources = resources.filter(r => r.resource_type === 'Video' || r.resource_type === 'Audio');
  const documentResources = resources.filter(r => ['PDF', 'PPT', 'DOCX'].includes(r.resource_type as ResourceType));

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
              <p className="text-sm text-gray-700">Uploading Resource</p>
              <p className="text-sm font-semibold text-blue-600">{uploadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seminar Events</h1>
        <ResourceUploadModal onUpload={onUpload} />
      </div>

      <Tabs defaultValue="media" className="w-full">
        <TabsList>
          <TabsTrigger value="media">Media Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="media">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaResources.length > 0 ? (
              mediaResources.map((resource) => (
                <ResourceCard 
                  key={resource.resource_id.toString()} 
                  resource={resource} 
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No media resources found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentResources.length > 0 ? (
              documentResources.map((resource) => (
                <ResourceCard 
                  key={resource.resource_id.toString()} 
                  resource={resource} 
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No document resources found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Seminar Resources</CardTitle>
            <AddResourceModal seminarId={resources[0]?.resource_id || 0} onSuccess={() => {}} />
          </div>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-gray-500">No resources yet.</p>
          ) : (
            <ul>
              {resources.map(resource => (
                <li key={resource.resource_id.toString()} className="flex items-center justify-between py-2 border-b">
                  <span>
                    <ResourceTypeBadge type={resource.resource_type as ResourceType} />
                    {resource.caption}
                  </span>
                  <div>
                    <Button onClick={() => {}}>View</Button>
                    <Button variant="destructive" onClick={() => onDelete?.(resource.resource_id.toString())}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ResourceUploadModal: React.FC<{ onUpload: (resource: Resource) => Promise<void> }> = ({ onUpload }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('Video');
  const [isOpen, setIsOpen] = useState(false);
  const [seminarId, setSeminarId] = useState(''); // New state for conference ID

  const acceptedFileTypes = {
    'Video': 'video/*',
    'Audio': 'audio/*',
    'PDF': '.pdf',
    'PPT': '.ppt,.pptx',
    'DOCX': '.doc,.docx'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files || !caption.trim()) {
      alert('Please select files and provide a caption');
      return;
    }

    try {
      await onUpload({
        resource_type: resourceType,
        resource: Array.from(files),
        caption: caption.trim(),
        date: date || new Date().toISOString(),
        file: Array.from(files)[0].name
      });
      
      setFiles(null);
      setCaption('');
      setDate('');
      setIsOpen(false);
      setSeminarId(''); // Reset conference ID
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Resources
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resources</DialogTitle>
          <div className="text-sm opacity-60 space-y-1 pt-2">
            <p>Videos should not be more than 10mb and should be in MP4 format</p>
            <p>Audio files should be in MP3 format</p>
            <p>Documents should be in PDF, PPT, or DOCX format</p>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="resource-type" className="block mb-2">
              Resource Type
            </label>
            <select
              id="resource-type"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as ResourceType)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Video">Video</option>
              <option value="Audio">Audio</option>
              <option value="PDF">PDF</option>
              <option value="PPT">PowerPoint</option>
              <option value="DOCX">Word Document</option>
            </select>
          </div>

          <div>
            <label htmlFor="file-upload" className="block mb-2">
              Select Files
            </label>
            <Input 
              id="file-upload"
              type="file" 
              accept={acceptedFileTypes[resourceType]}
              onChange={handleFileChange}
              multiple
              className="w-full"
            />
            {files && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {Array.from(files).map(file => file.name).join(', ')}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="resource-caption" className="block mb-2">
              Caption
            </label>
            <Input 
              id="resource-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a descriptive caption"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="resource-date" className="block mb-2">
              Date (Optional)
            </label>
            <Input 
              id="resource-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="seminar-id" className="block mb-2">
              Seminar ID
            </label>
            <Input 
              id="seminar-id"
              type="text"
              value={seminarId}
              onChange={(e) => setSeminarId(e.target.value)}
              placeholder="Enter seminar ID"
              className="w-full"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!files || !caption.trim()}
          >
            Upload Resources
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ResourceTypeBadge: React.FC<{ type: ResourceType }> = ({ type }) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'Video': return 'bg-blue-100 text-blue-800';
      case 'Audio': return 'bg-green-100 text-green-800';
      case 'PDF': return 'bg-yellow-100 text-yellow-800';
      case 'PPT': return 'bg-purple-100 text-purple-800';
      case 'DOCX': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${getBadgeColor()}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const RESOURCE_TYPES = ['Video', 'Audio', 'PPT', 'PDF', 'Docx'];

const AddResourceModal: React.FC<{ seminarId: number; onSuccess: () => void }> = ({ seminarId, onSuccess }) => {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [open, setOpen] = useState(false);
  const [resourceType, setResourceType] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceType || !caption || !date || !files || files.length === 0) {
      showToast.error('Please fill all fields and select at least one file.');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('resource_type', resourceType);
      formData.append('caption', caption);
      formData.append('date', date);
      formData.append('seminar_id', seminarId.toString());
      for (let i = 0; i < files.length; i++) {
        formData.append('resources[]', files[i]);
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/upload_seminar_resource`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast.success('Resource uploaded successfully!');
        setOpen(false);
        setResourceType('');
        setCaption('');
        setDate('');
        setFiles(null);
        onSuccess();
      } else {
        showToast.error(data.message || 'Failed to upload resource');
      }
    } catch (error) {
      showToast.error('Failed to upload resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Seminar Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Resource Type</label>
            <select
              value={resourceType}
              onChange={e => setResourceType(e.target.value as ResourceType)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              {RESOURCE_TYPES.map(rt => (
                <option key={rt} value={rt}>{rt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Select Files</label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full"
              required
            />
            {files && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {Array.from(files).map(file => file.name).join(', ')}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2">Caption</label>
            <Input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Enter a descriptive caption"
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Date</label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Resource'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourcesPage;