"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  social_media: string;
  social_media_link: string;
  description: string;
  image?: File | null;
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

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingNewsId, setEditingNewsId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchNews = async (): Promise<void> => {
    try {
      const response = await fetch("https://iaiiea.org/api/sandbox/admin/list_news", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setNews(result.data || []);
      } else {
        alert(result.message || "Failed to fetch news.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("An error occurred while fetching news.");
    }
  };

  useEffect(() => {
    fetchNews();
  }, [bearerToken]); // Added bearerToken as dependency

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.title || !formData.time || !formData.description || !formData.image) {
      alert("Please fill in all required fields.");
      return;
    }

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) body.append(key, value);
    });

    try {
      setLoading(true);
      const endpoint = editingNewsId 
        ? "https://iaiiea.org/api/sandbox/admin/edit_news" 
        : "https://iaiiea.org/api/sandbox/admin/add_news";
      
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
        alert(editingNewsId ? "News updated successfully!" : "News added successfully!");
        fetchNews();
        setFormData(initialFormData);
        setEditingNewsId(null);
      } else {
        alert(result.message || "Failed to submit news.");
      }
    } catch (error) {
      console.error("Error submitting news:", error);
      alert("An error occurred while submitting news.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId: string | number): Promise<void> => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    try {
      const response = await fetch("https://iaiiea.org/api/sandbox/admin/delete_news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ news_id: newsId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("News deleted successfully!");
        fetchNews();
      } else {
        alert(result.message || "Failed to delete news.");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("An error occurred while deleting news.");
    }
  };

  const handleEdit = (newsItem: NewsItem): void => {
    setFormData({
      title: newsItem.title,
      date: newsItem.date,
      time: newsItem.time,
      social_media: newsItem.social_media,
      social_media_link: newsItem.social_media_link,
      description: newsItem.description,
      image: null, // Image can't be prefilled
    });
    setEditingNewsId(newsItem.id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">News Management</h1>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
            {editingNewsId ? "Edit News" : "Add News"}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg z-50">
            <h2 className="text-xl font-semibold mb-4">
              {editingNewsId ? "Edit News" : "Add News"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title (required)"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date (optional)"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="Time (required)"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                name="social_media"
                value={formData.social_media}
                onChange={handleInputChange}
                placeholder="Social Media (optional)"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                name="social_media_link"
                value={formData.social_media_link}
                onChange={handleInputChange}
                placeholder="Social Media Link (optional)"
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description (required)"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-200 rounded-md">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">News List</h2>
        <ul>
          {news.map((newsItem) => (
            <li key={newsItem.id} className="mb-4 border p-4 rounded-md">
              <h3 className="text-lg font-bold">{newsItem.title}</h3>
              <p>{newsItem.description}</p>
              <div className="mt-2 space-x-4">
                <button
                  onClick={() => handleEdit(newsItem)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(newsItem.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsManagement;