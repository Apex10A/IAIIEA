"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from '@/utils/toast';
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  social_media: string;
  social_media_link: string;
  description: string;
  image?: string;
  conference_id?: number;
  conference_title?: string;
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
  conference_id: number | null;
}

const initialFormData: FormData = {
  title: "",
  date: "",
  time: "",
  social_media: "",
  social_media_link: "",
  description: "",
  image: null,
  conference_id: null,
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
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

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
      // If specific conference is selected, fetch news for that conference
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleConferenceChange = (id: string) => {
    const conferenceId = parseInt(id, 10);
    setFormData(prev => ({ ...prev, conference_id: conferenceId }));
  };

  const handleFilterConferenceChange = (id: string) => {
    const conferenceId = parseInt(id, 10);
    setSelectedConferenceId(conferenceId);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.title || !formData.description || !formData.conference_id) {
      showToast.error("Please fill in all required fields and select a conference.");
      return;
    }

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) body.append(key, value.toString());
    });

    try {
      setLoading(true);
      const endpoint = editingNewsId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/edit_news` 
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/add_news`;
      
      if (editingNewsId) body.append("news_id", editingNewsId.toString());

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        body,
      });

      const result = await response.json();
      if (response.ok) {
        showToast.success(editingNewsId ? "News updated successfully!" : "News added successfully!");
        fetchNews(selectedConferenceId || undefined);
        setFormData(initialFormData);
        setEditingNewsId(null);
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
    if (!confirm("Are you sure you want to delete this news item?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_news`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ news_id: newsId }),
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
      image: null, // Image can't be prefilled
      conference_id: newsItem.conference_id || null,
    });
    setEditingNewsId(newsItem.id);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingNewsId(null);
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
          <div className="w-full sm:w-64">
            <Select 
              value={selectedConferenceId?.toString() || ""} 
              onValueChange={handleFilterConferenceChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Conference" />
              </SelectTrigger>
              <SelectContent>
                {conferences.map((conference) => (
                  <SelectItem key={conference.id} value={conference.id.toString()}>
                    {conference.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
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
                <label className="block text-sm font-medium mb-1 text-gray-600">Select Conference</label>
                <Select 
                  value={formData.conference_id?.toString() || ""} 
                  onValueChange={handleConferenceChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Conference" />
                  </SelectTrigger>
                  <SelectContent>
                    {conferences.map((conference) => (
                      <SelectItem key={conference.id} value={conference.id.toString()}>
                        {conference.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="News description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded-md text-gray-600"
                />
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit"}
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

      {/* News listing */}
      <div className="mt-8">
        {isLoadingNews ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No news items available for this conference. Click "Add News" to create one.</p>
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
                  
                  {/* Conference name if available */}
                  {newsItem.conference_title && (
                    <p className="text-sm text-gray-500 mb-2">
                      Conference: {newsItem.conference_title}
                    </p>
                  )}
                  
                  {/* Date and time if available */}
                  {(newsItem.date || newsItem.time) && (
                    <p className="text-sm text-gray-500 mb-2">
                      {newsItem.date && new Date(newsItem.date).toLocaleDateString()}
                      {newsItem.date && newsItem.time && ' • '}
                      {newsItem.time && newsItem.time}
                    </p>
                  )}
                  
                  {/* Description with truncation */}
                  <p className="text-gray-600 mt-2 line-clamp-3">{newsItem.description}</p>
                  
                  <div className="flex justify-end mt-4 gap-2">
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