import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { showToast } from '@/utils/toast';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  resources: any[];
}

interface Meal {
  meal_id: string;
  name: string;
  image?: string;
}

interface ConferenceMealsProps {
  onMealAdded: (conferenceId: number) => void;
  conferences: Conference[];
}

const MealsModal: React.FC<ConferenceMealsProps> = ({ onMealAdded, conferences }) => {
  const [mealDetails, setMealDetails] = useState<{
    name: string;
    image: File | null;
    conferenceId: number | null;
  }>({
    name: "",
    image: null,
    conferenceId: null,
  });
    
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setMealDetails((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };
  
  const handleSubmit = async () => {
    if (!mealDetails.name || !mealDetails.image || !mealDetails.conferenceId) {
      showToast.error('Please fill in all fields and select a conference');
      return;
    }

    const formData = new FormData();
    formData.append('name', mealDetails.name);
    formData.append('image', mealDetails.image);
    formData.append('conference_id', mealDetails.conferenceId.toString());

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/add_meal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to add meal');

      onMealAdded(mealDetails.conferenceId);
      setMealDetails({ name: '', image: null, conferenceId: null });
      showToast.success('Meal added successfully');
    } catch (error) {
      console.error('Error adding meal:', error);
      showToast.error('Failed to add meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConferenceChange = (id: string) => {
    const conferenceId = parseInt(id, 10);
    setMealDetails(prev => ({ ...prev, conferenceId }));
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-[#203a87] font-semibold text-white px-5 py-3 rounded-lg text-sm md:text-[17px]">
          Add Meal
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50">
          <Dialog.Title className="text-md md:text-xl text-gray-600 font-bold mb-4">Add New Meal</Dialog.Title>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Select Conference</label>
              <Select 
                value={mealDetails.conferenceId?.toString() || ""} 
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
              <label className="block text-sm font-medium mb-1">Meal Name</label>
              <input
                type="text"
                value={mealDetails.name}
                onChange={(e) => setMealDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md text-gray-600"
                placeholder="Enter meal name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">Meal Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md text-gray-600"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#203a87] rounded-md hover:bg-[#152a61] disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Meal'}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const ConferenceMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMeals, setIsFetchingMeals] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchConferences = async () => {
    if (!bearerToken) {
      setError("No authorization token available");
      setIsLoading(false);
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
        if (data.data.length > 0) {
          setSelectedConferenceId(data.data[0].id);
        }
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      console.error('Error fetching conferences:', err);
      setError('Failed to load conferences. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMeals = async (conferenceId: number) => {
    if (!bearerToken || !conferenceId) {
      return;
    }

    setIsFetchingMeals(true);
    setMeals([]); // Clear previous meals

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch meals: ${response.status}`);

      const data = await response.json();
      setMeals(data.data.meals || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching meals:', err);
      showToast.error('Failed to load meals. Please try again later.');
    } finally {
      setIsFetchingMeals(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!bearerToken) {
      showToast.error("Please login again to perform this action");
      return;
    }

    setIsDeleting(mealId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_meal`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: mealId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete meal: ${response.status}`);
      }

      // Remove the deleted meal from the state
      setMeals(meals.filter(meal => meal.meal_id !== mealId));
      showToast.success("Meal deleted successfully");
    } catch (err) {
      console.error('Error deleting meal:', err);
      showToast.error('Failed to delete meal. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleConferenceChange = (id: string) => {
    const conferenceId = parseInt(id, 10);
    setSelectedConferenceId(conferenceId);
  };

  useEffect(() => {
    fetchConferences();
  }, [bearerToken]);

  useEffect(() => {
    if (selectedConferenceId) {
      fetchMeals(selectedConferenceId);
    }
  }, [selectedConferenceId, bearerToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-600">Conference Meals</h2>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select 
              value={selectedConferenceId?.toString() || ""} 
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
          
          <MealsModal 
            onMealAdded={(id) => {
              fetchMeals(id);
              setSelectedConferenceId(id);
            }} 
            conferences={conferences} 
          />
        </div>
      </div>

      {isFetchingMeals ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : selectedConferenceId ? (
        <>
          {meals.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">No meals available for this conference yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <Card key={meal.meal_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    {meal.image ? (
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-meal.jpg';
                          target.alt = 'Meal image not available';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{meal.name}</h3>
                  </CardContent>
                  <CardFooter className="flex justify-end p-4 pt-0">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteMeal(meal.meal_id)}
                      disabled={isDeleting === meal.meal_id}
                    >
                      {isDeleting === meal.meal_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Please select a conference to view meals.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConferenceMeals;