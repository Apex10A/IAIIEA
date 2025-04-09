import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, Image as ImageIcon, Loader2 } from 'lucide-react';
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { showToast } from '@/utils/toast';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

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
    previewImage: string | null;
  }>({
    name: "",
    image: null,
    conferenceId: null,
    previewImage: null,
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
        previewImage: URL.createObjectURL(file)
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
      setMealDetails({ 
        name: '', 
        image: null, 
        conferenceId: null,
        previewImage: null 
      });
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Meal
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800">Add New Meal</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-sm opacity-70 hover:opacity-100">
                <Cross2Icon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Conference</label>
              <Select 
                value={mealDetails.conferenceId?.toString() || ""} 
                onValueChange={handleConferenceChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a conference" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
              <input
                type="text"
                value={mealDetails.name}
                onChange={(e) => setMealDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter meal name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Image</label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  {mealDetails.previewImage ? (
                    <img 
                      src={mealDetails.previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <span className="text-sm">Click to upload image</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Meal
                </>
              )}
            </Button>
          </div>
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
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <AspectRatio.Root ratio={16 / 9}>
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              </AspectRatio.Root>
              <CardContent className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </CardContent>
              <CardFooter className="flex justify-end p-4 pt-0">
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={fetchConferences} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Conference Meals</h2>
          <p className="text-sm text-gray-500">Manage meals for your conferences</p>
        </div>
        
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <AspectRatio.Root ratio={16 / 9}>
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              </AspectRatio.Root>
              <CardContent className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </CardContent>
              <CardFooter className="flex justify-end p-4 pt-0">
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : selectedConferenceId ? (
        <>
          {meals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No meals yet</h3>
                <p className="text-sm text-gray-500 mb-4">Get started by adding a new meal</p>
                <MealsModal 
                  onMealAdded={(id) => {
                    fetchMeals(id);
                    setSelectedConferenceId(id);
                  }} 
                  conferences={conferences} 
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <Card key={meal.meal_id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <AspectRatio.Root ratio={16 / 9}>
                    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-meal.jpg';
                            target.alt = 'Meal image not available';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </AspectRatio.Root>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      Meal ID: {meal.meal_id}
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-end p-4 pt-0">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this meal?')) {
                          handleDeleteMeal(meal.meal_id);
                        }
                      }}
                      disabled={isDeleting === meal.meal_id}
                      className="gap-1"
                    >
                      {isDeleting === meal.meal_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
              <ChevronDown className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Select a conference</h3>
            <p className="text-sm text-gray-500">Choose a conference to view its meals</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConferenceMeals;