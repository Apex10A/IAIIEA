"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <textarea className="w-full h-32 px-3 py-2 border rounded-md" />
});

import 'react-quill/dist/quill.snow.css';

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  social_media: string;
  social_media_link: string;
  description: string;
  image?: string;
}

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  resources: any[];
}

interface FormData {
  title: string;
  date: string;
  time: string;
  social_media: string;
  social_media_link: string;
  description: string;
  image: File | null;
}

const initialFormData: FormData = {
  title: "",
  date: "",
  time: "",
  social_media: "",
  social_media_link: "",
  description: "",
  image: null,
};

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingNewsId, setEditingNewsId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<number | null>(null);
  const [isLoadingConferences, setIsLoadingConferences] = useState<boolean>(true);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [newsToDelete, setNewsToDelete] = useState<string | number | null>(null);
  const [viewingNews, setViewingNews] = useState<NewsItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  // Fetch conferences
  const fetchConferences = async () => {
    if (!bearerToken) {
      showToast.error("No authorization token available");
      setIsLoadingConferences(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch conferences: ${response.status}`);

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setConferences(data.data);
        
        // Auto-select the first conference if available
        if (data.data.length > 0 && !selectedConferenceId) {
          setSelectedConferenceId(data.data[0].id);
        }
      } else {
        showToast.error("Invalid response format");
      }
    } catch (err) {
      console.error('Error fetching conferences:', err);
      showToast.error('Failed to load conferences. Please try again later.');
    } finally {
      setIsLoadingConferences(false);
    }
  };

  // Fetch news items
  const fetchNews = async (conferenceId?: number): Promise<void> => {
    setIsLoadingNews(true);
    try {
      let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/list_news`;
      if (conferenceId) {
        endpoint += `?conference_id=${conferenceId}`;
      }
      
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      if (response.ok) {
        setNews(result.data || []);
      } else {
        console.error(result.message || "Failed to fetch news.");
        showToast.error("Failed to load news items.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      showToast.error("An error occurred while loading news items.");
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (bearerToken) {
      fetchConferences();
    }
  }, [bearerToken]);

  // When selected conference changes, fetch news
  useEffect(() => {
    if (bearerToken && selectedConferenceId) {
      fetchNews(selectedConferenceId);
    }
  }, [bearerToken, selectedConferenceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const isDescriptionEmpty = !formData.description || 
                            formData.description.replace(/<[^>]*>/g, '').trim() === '';
  
    if (!formData.title || isDescriptionEmpty) {
      showToast.error("Please fill in all required fields (Title and Description)");
      return;
    }
  
    const body = new FormData();
    body.append('title', formData.title);
    body.append('description', formData.description);
    
    if (formData.date) body.append('date', formData.date);
    if (formData.time) body.append('time', formData.time);
    if (formData.social_media) body.append('social_media', formData.social_media);
    if (formData.social_media_link) body.append('social_media_link', formData.social_media_link);
  
    // Only append image if a new one was selected
    if (formData.image) {
      body.append('image', formData.image);
    } else if (editingNewsId && !existingImageUrl) {
      // If editing and no existing image, you might want to remove the image
      body.append('remove_image', 'true');
    }

    if (editingNewsId) body.append("news_id", editingNewsId.toString());
  
    try {
      setLoading(true);
      const endpoint = editingNewsId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/edit_news` 
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/add_news`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        body,
      });
  
      const result = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
        fetchNews(selectedConferenceId || undefined);
        resetForm();
        setIsDialogOpen(false);
      } else {
        showToast.error(result.message || "Failed to submit news.");
      }
    } catch (error) {
      console.error("Error submitting news:", error);
      showToast.error("An error occurred while submitting news.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId: string | number): Promise<void> => {
    setNewsToDelete(newsId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_news`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ news_id: newsToDelete }),
      });

      const result = await response.json();
      if (response.ok) {
        showToast.success("News deleted successfully!");
        fetchNews(selectedConferenceId || undefined);
      } else {
        showToast.error(result.message || "Failed to delete news.");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      showToast.error("An error occurred while deleting news.");
    } finally {
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleEdit = (newsItem: NewsItem): void => {
    setFormData({
      title: newsItem.title,
      date: newsItem.date || "",
      time: newsItem.time || "",
      social_media: newsItem.social_media || "",
      social_media_link: newsItem.social_media_link || "",
      description: newsItem.description,
      image: null, // Initialize as null, we'll track the existing image separately
    });
    setEditingNewsId(newsItem.id);
    setExistingImageUrl(newsItem.image || null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleView = (newsItem: NewsItem): void => {
    setViewingNews(newsItem);
    setViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingNewsId(null);
    setExistingImageUrl(null);
    setImagePreview(null);
  };

  if (isLoadingConferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-600">News Management</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button  
            className="bg-[#0E1A3D] text-white"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add News
          </Button>
        </div>
      </div>

      {/* News dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsDialogOpen(open);
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg z-50 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">
              {editingNewsId ? "Edit News" : "Add News"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="News title"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Social Media</label>
                <input
                  type="text"
                  name="social_media"
                  value={formData.social_media}
                  onChange={handleInputChange}
                  placeholder="Social Media Platform"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Social Media Link</label>
                <input
                  type="text"
                  name="social_media_link"
                  value={formData.social_media_link}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
                <ReactQuill
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write your news content here..."
                  className="border rounded-md"
                  theme="snow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Image</label>
                {existingImageUrl && editingNewsId && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img 
                      src={existingImageUrl} 
                      alt="Current news" 
                      className="h-32 object-contain border rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-news.jpg';
                      }}
                    />
                  </div>
                )}
                {imagePreview && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1">New Image Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 object-contain border rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded-md text-gray-600"
                />
                {editingNewsId && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.image 
                      ? "New image selected (will replace current image)"
                      : "Leave blank to keep current image"}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Dialog.Close asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingNewsId ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  editingNewsId ? "Update" : "Submit"
                )}
              </Button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* View News Modal */}
      <Dialog.Root open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              
              <Dialog.Close asChild>
                <button
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {viewingNews && (
              <div className="space-y-6">
                
                {viewingNews.image && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <img
                      src={viewingNews.image}
                      alt={viewingNews.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-news.jpg';
                        target.alt = 'News image not available';
                      }}
                    />
                  </div>
                )}
                <Dialog.Title className="text-2xl font-bold text-gray-800">
                {viewingNews?.title}
              </Dialog.Title>

                {(viewingNews.date || viewingNews.time) && (
                  <div className="flex items-center text-sm text-gray-500">
                    {viewingNews.date && (
                      <span>{new Date(viewingNews.date).toLocaleDateString()}</span>
                    )}
                    {viewingNews.date && viewingNews.time && (
                      <span className="mx-2">•</span>
                    )}
                    {viewingNews.time && (
                      <span>{viewingNews.time}</span>
                    )}
                  </div>
                )}

                {viewingNews.social_media && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Posted on:</span>
                    <span className="text-sm text-blue-600">
                      {viewingNews.social_media}
                      {viewingNews.social_media_link && (
                        <a 
                          href={viewingNews.social_media_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500 hover:underline"
                        >
                          (View Post)
                        </a>
                      )}
                    </span>
                  </div>
                )}

                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewingNews.description }} 
                />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Success Modal */}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg z-50">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <Dialog.Title className="text-center text-[#203a87] text-2xl mt-4 font-semibold">
                Success!
              </Dialog.Title>
              <Dialog.Description className="text-center text-gray-600 mt-2">
                {editingNewsId ? "News updated successfully!" : "News added successfully!"}
              </Dialog.Description>
              <div className="mt-6">
                <Button 
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">
              Delete News
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
              Are you sure you want to delete this News? This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* News listing */}
      <div className="mt-8">
        {isLoadingNews ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No news items available. Click "Add News" to create one.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {news.map((newsItem) => (
              <Card key={newsItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  {newsItem.image ? (
                    <img
                      src={newsItem.image}
                      alt={newsItem.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-news.jpg';
                        target.alt = 'News image not available';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{newsItem.title}</h3>
                  
                  {(newsItem.date || newsItem.time) && (
                    <p className="text-sm text-gray-500 mb-2">
                      {newsItem.date && new Date(newsItem.date).toLocaleDateString()}
                      {newsItem.date && newsItem.time && ' • '}
                      {newsItem.time && newsItem.time}
                    </p>
                  )}
                  
                  <div 
                    className="text-gray-600 mt-2 line-clamp-3" 
                    dangerouslySetInnerHTML={{ __html: newsItem.description }} 
                  />
                  
                  <div className="flex justify-end mt-4 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleView(newsItem)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(newsItem)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(newsItem.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;