'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Resource, ResourcesPage } from './resources';
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import Image from 'next/image';

interface Meal {
  id: number;
  image: string;
  meal: string;
}

const Page = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);
  const [isSelectingMeal, setIsSelectingMeal] = useState(false);
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/member_resources`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Transform API response to match the Resource interface
      const formattedResources: Resource[] = response.data.data.map((item: any) => ({
        resource_id: item.resource_id.toString(),
        resource_type: item.resource_type,
        resource: item.file,
        caption: item.caption,
        created_at: item.date
      }));

      setResources(formattedResources);
    } catch (error) {
      console.error('Fetch error:', error);
      showToast.error('Failed to fetch resources');
    }
  };

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list_meal`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        setMeals(response.data.data);
      }
    } catch (error) {
      console.error('Fetch meals error:', error);
      showToast.error('Failed to fetch meals');
    }
  };

  const handleMealSelection = async (mealId: number) => {
    setIsSelectingMeal(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/SelectMeal`,
        { meal_id: mealId },
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSelectedMeal(mealId);
      showToast.success('Meal selected successfully');
    } catch (error) {
      console.error('Meal selection error:', error);
      showToast.error('Failed to select meal');
    } finally {
      setIsSelectingMeal(false);
    }
  };

  const handleUpload = async (resource: Resource) => {
    const formData = new FormData();
    formData.append('resource_type', resource.resource_type);
    formData.append('caption', resource.caption);
    formData.append('date', resource.created_at || new Date().toISOString());

    if (Array.isArray(resource.resource)) {
      resource.resource.forEach((file) => {
        formData.append('resources[]', file);
      });
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/upload_member_resource`, formData, {
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

      showToast.success('Resource upload complete');
      setUploadProgress(0);
      await fetchResources();
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Resource upload failed');
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
      showToast.success('Resource deleted');
      await fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      showToast.error('Failed to delete resource');
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchResources();
      fetchMeals();
    }
  }, [bearerToken]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Meal Selection Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Meal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`relative rounded-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105 ${
                selectedMeal === meal.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => !isSelectingMeal && handleMealSelection(meal.id)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={meal.image}
                  alt={meal.meal}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">{meal.meal}</h3>
                {selectedMeal === meal.id && (
                  <span className="text-sm text-green-600">✓ Selected</span>
                )}
              </div>
              {isSelectingMeal && selectedMeal === meal.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <ResourcesPage
        initialResources={resources}
        onUpload={handleUpload}
        onDelete={handleDelete}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default Page;