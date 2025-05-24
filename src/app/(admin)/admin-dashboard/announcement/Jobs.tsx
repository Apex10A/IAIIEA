import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useSession } from "next-auth/react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import Image from "next/image";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface Job {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  image?: string | null;
  link: string;
}

interface JobsResponse {
  status: string;
  message: string;
  data: {
    [date: string]: Job[];
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({
    id: undefined,
    title: '',
    description: '',
    image: null,
    link: ''
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      const data: JobsResponse = await response.json();
      
      if (data.status === "success" && data.data) {
        const formattedJobs = Object.entries(data.data).flatMap(([date, jobs]) => 
          jobs.map(job => ({
            ...job,
            date
          }))
        ).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setJobs(formattedJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('title', currentJob.title || '');
    formData.append('description', currentJob.description || '');
    if (currentJob.image instanceof File) {
      formData.append('image', currentJob.image);
    }
    if (currentJob.link) {
      formData.append('link', currentJob.link);
    }

    try {
      const response = await fetch(`${API_URL}/admin/create_job`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Job created successfully');
        setIsSuccessModalOpen(true);
        fetchJobs();
        setIsCreateModalOpen(false);
        setCurrentJob({
          id: undefined,
          title: '',
          description: '',
          image: null,
          link: ''
        });
      }
    } catch (error) {
      console.error('Failed to create job', error);
    }
  };

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (currentJob.id) formData.append('id', currentJob.id.toString());
    formData.append('title', currentJob.title || '');
    formData.append('description', currentJob.description || '');
    if (currentJob.image instanceof File) {
      formData.append('image', currentJob.image);
    } else if (typeof currentJob.image === 'string') {
      formData.append('existing_image', currentJob.image);
    }
    if (currentJob.link) {
      formData.append('link', currentJob.link);
    }

    try {
      const response = await fetch(`${API_URL}/admin/edit_job/${currentJob.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Job updated successfully');
        setIsSuccessModalOpen(true);
        fetchJobs();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to edit job', error);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/delete_job`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: jobToDelete })
      });
      
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Job deleted successfully');
        setIsSuccessModalOpen(true);
        fetchJobs();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete job', error);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchJobs();
    }
  }, [bearerToken]);

  const getImageUrl = (image: string | File | null | undefined) => {
    if (!image) return '';
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${API_URL}/${image}`;
    }
    return URL.createObjectURL(image);
  };

  return (
    <div className='container mx-auto px-4 py-8 dark:bg-gray-900'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Opportunities</h1>
          <p className="text-gray-500 dark:text-gray-400">{jobs.length} available positions</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <PlusIcon className='mr-2 h-4 w-4' /> Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Create Job Opportunity</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                Fill in the details for the new job posting
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJob} className='space-y-4'>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Job Title *</Label>
                <Input 
                  id="title"
                  value={currentJob.title}
                  onChange={(e) => setCurrentJob({
                    ...currentJob, 
                    title: e.target.value
                  })}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Job Description *</Label>
                <Textarea 
                  id="description"
                  value={currentJob.description}
                  onChange={(e) => setCurrentJob({
                    ...currentJob, 
                    description: e.target.value
                  })}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  rows={5}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">Company Logo/Image</Label>
                <Input 
                  id="image"
                  type="file"
                  accept="image/*"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCurrentJob({
                        ...currentJob, 
                        image: e.target.files[0]
                      });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link" className="text-gray-700 dark:text-gray-300">Application Link (Optional)</Label>
                <Input 
                  id="link"
                  type="url"
                  value={currentJob.link || ''}
                  onChange={(e) => setCurrentJob({
                    ...currentJob, 
                    link: e.target.value
                  })}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="https://example.com/apply"
                />
              </div>
              <Button type='submit' className="w-full bg-primary hover:bg-primary/90 text-white">
                Post Job
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {jobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No job opportunities posted yet</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className='hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
              {job.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={getImageUrl(job.image)}
                    alt={job.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{job.title}</CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posted on {new Date(job.date).toLocaleDateString()} at {job.time}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {job.description}
                </p>
                <div className="flex justify-between items-center">
                  {job.link && (
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/90 font-medium"
                    >
                      Apply Now
                    </a>
                  )}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      onClick={() => {
                        setCurrentJob(job);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        setJobToDelete(job.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Job Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Job Opportunity</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Make changes to this job posting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditJob} className='space-y-4'>
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-gray-700 dark:text-gray-300">Job Title *</Label>
              <Input 
                id="edit-title"
                value={currentJob.title}
                onChange={(e) => setCurrentJob({
                  ...currentJob, 
                  title: e.target.value
                })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-gray-700 dark:text-gray-300">Job Description *</Label>
              <Textarea 
                id="edit-description"
                value={currentJob.description}
                onChange={(e) => setCurrentJob({
                  ...currentJob, 
                  description: e.target.value
                })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                rows={5}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Current Image</Label>
              {currentJob.image && typeof currentJob.image === 'string' && (
                <div className="relative h-32 w-32 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(currentJob.image)}
                    alt="Current job image"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <Label htmlFor="edit-image" className="text-gray-700 dark:text-gray-300">Upload New Image</Label>
              <Input 
                id="edit-image"
                type="file"
                accept="image/*"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCurrentJob({
                      ...currentJob, 
                      image: e.target.files[0]
                    });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-link" className="text-gray-700 dark:text-gray-300">Application Link (Optional)</Label>
              <Input 
                id="edit-link"
                type="url"
                value={currentJob.link || ''}
                onChange={(e) => setCurrentJob({
                  ...currentJob, 
                  link: e.target.value
                })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/apply"
              />
            </div>
            <Button type='submit' className="w-full bg-primary hover:bg-primary/90 text-white">
              Update Job
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg 
                    className="w-12 h-12 text-primary animate-checkmark"
                    viewBox="0 0 52 52" 
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle 
                      cx="26" 
                      cy="26" 
                      r="25" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="opacity-30"
                    />
                    <path 
                      className="animate-checkmark-path"
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      style={{
                        strokeDasharray: 50,
                        strokeDashoffset: 50,
                        animation: 'draw 0.6s ease-out forwards 0.2s'
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>
            <DialogTitle className="text-center text-primary text-2xl mt-4 font-semibold">
              Success!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 space-y-2 px-4">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{successMessage}</p>
          </div>
          <DialogFooter className="flex justify-center pb-4">
            <Button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="px-8 bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/60 backdrop-blur-sm fixed inset-0" />
          <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <AlertDialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Delete Job Posting
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  onClick={handleDeleteJob}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default Jobs;