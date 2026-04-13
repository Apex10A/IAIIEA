"use client";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { showToast } from '@/utils/toast';

interface AddMealModalProps {
  onMealAdded: () => void;
  conferenceId: number;
}

const AddMealModal: React.FC<AddMealModalProps> = ({ onMealAdded, conferenceId }) => {
  const [mealDetails, setMealDetails] = useState<{
    name: string;
    image: File | null;
    previewImage: string | null;
  }>({
    name: "",
    image: null,
    previewImage: null,
  });
    
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    if (!mealDetails.name || !mealDetails.image) {
      showToast.error('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', mealDetails.name);
    formData.append('image', mealDetails.image);
    formData.append('conference_id', conferenceId.toString());

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

      onMealAdded();
      setMealDetails({ 
        name: '', 
        image: null, 
        previewImage: null 
      });
      setIsOpen(false);
      showToast.success('Meal added successfully');
    } catch (error) {
      console.error('Error adding meal:', error);
      showToast.error('Failed to add meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
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
              className="gap-2 bg-[#203a87] text-white hover:bg-[#1a2f6d]"
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

export default AddMealModal;
