"use client"
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { Phone, Mail, Edit, Trash, Plus, X } from 'lucide-react';
import { countries } from '@/utils/countries'; 
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// TypeScript interfaces
interface Speaker {
  speaker_id: string;
  speaker_image: string;
  speaker_name: string;
  speaker_institution: string;
  email?: string;
  phone?: string;
  country?: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Speaker[];
}

export default function SpeakersManagement() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [speakerToDelete, setSpeakerToDelete] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    speaker_name: '',
    speaker_institution: '',
    phone: '',
    email: '',
    country: '',
    image: null as File | null,
    imagePreview: '',
  });

  // Fetch speakers data
  const fetchSpeakers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speakers_list`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.status === 'success') {
        setSpeakers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch speakers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching speakers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchSpeakers();
    }
  }, [bearerToken]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: event.target?.result as string
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Open modal for adding a new speaker
  const openAddModal = () => {
    setEditingSpeaker(null);
    setFormData({
      speaker_name: '',
      speaker_institution: '',
      phone: '',
      email: '',
      country: '',
      image: null,
      imagePreview: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a speaker
  const openEditModal = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setFormData({
      speaker_name: speaker.speaker_name,
      speaker_institution: speaker.speaker_institution,
      phone: speaker.phone || '',
      email: speaker.email || '',
      country: speaker.country || '',
      image: null,
      imagePreview: speaker.speaker_image || '',
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const form = new FormData();
      form.append('speaker_name', formData.speaker_name);
      form.append('speaker_institution', formData.speaker_institution);
      form.append('phone', formData.phone);
      form.append('email', formData.email);
      form.append('country', formData.country);
      
      if (formData.image) {
        form.append('image', formData.image);
      }

      const url = editingSpeaker
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/update_speaker/${editingSpeaker.speaker_id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/register_speaker`;
      
      const method = editingSpeaker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccessMessage(editingSpeaker ? 'Speaker updated successfully' : 'Speaker added successfully');
        fetchSpeakers(); // Refresh the speakers list
        
        // Close modal after 2 seconds
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle speaker deletion confirmation
  const confirmDelete = (speakerId: string) => {
    setSpeakerToDelete(speakerId);
  };

  // Handle speaker deletion
  const handleDeleteSpeaker = async () => {
    if (!speakerToDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_speaker/${speakerToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        // Remove the deleted speaker from the state
        setSpeakers(speakers.filter(speaker => speaker.speaker_id !== speakerToDelete));
        setSuccessMessage('Speaker deleted successfully');
        setSpeakerToDelete(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to delete speaker');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting speaker:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-[#203a87] to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Speakers Management</h1>
          <p className="text-xl text-center mt-4 max-w-2xl mx-auto">
            Manage speakers for your event - add, edit, or remove speakers.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Add speaker button */}
        <div className="mb-8">
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center bg-[#203a87] hover:bg-indigo-800 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors duration-300"
          >
            <Plus className="mr-2" size={20} />
            Add New Speaker
          </button>
        </div>

        {/* Speakers list */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : speakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <div 
                key={speaker.speaker_id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-64 w-full group">
                  <Image
                    src={speaker.speaker_image}
                    alt={speaker.speaker_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-speaker.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button 
                      onClick={() => openEditModal(speaker)}
                      className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                      aria-label="Edit speaker"
                    >
                      <Edit size={16} className="text-gray-700" />
                    </button>
                    
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <button 
                          className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                          aria-label="Delete speaker"
                          onClick={() => confirmDelete(speaker.speaker_id)}
                        >
                          <Trash size={16} className="text-red-600" />
                        </button>
                      </AlertDialog.Trigger>
                    </AlertDialog.Root>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{speaker.speaker_name}</h2>
                  <p className="text-gray-600 mb-4">{speaker.speaker_institution}</p>
                  
                  <div className="flex space-x-3 mt-4">
                    {speaker.email && (
                      <a 
                        href={`mailto:${speaker.email}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Mail size={18} className="mr-1" />
                        <span>Email</span>
                      </a>
                    )}
                    {speaker.phone && (
                      <a 
                        href={`tel:${speaker.phone}`}
                        className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
                      >
                        <Phone size={18} className="mr-1" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No speakers found. Add some speakers to get started.</p>
          </div>
        )}
      </main>

      {/* Modal for adding/editing speaker */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="speaker_name">
                    Speaker Name
                  </label>
                  <input
                    type="text"
                    id="speaker_name"
                    name="speaker_name"
                    value={formData.speaker_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Dr. John Doe"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="speaker_institution">
                    Institution/Position
                  </label>
                  <input
                    type="text"
                    id="speaker_institution"
                    name="speaker_institution"
                    value={formData.speaker_institution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Professor at University of Example"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="country">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                    Speaker Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        style={{ display: 'none' }}
                      />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Choose Image
                        </button>
                        <span className="ml-3 text-gray-600">
                          {formData.image ? formData.image.name : 'No file chosen'}
                        </span>
                      </div>
                    </div>
                    
                    {formData.imagePreview && (
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={formData.imagePreview}
                          alt="Speaker preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingSpeaker ? 'Upload a new image or leave empty to keep the current one.' : 'Please upload a professional photo of the speaker.'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg mr-4 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#203a87] hover:bg-indigo-800 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  )}
                  {editingSpeaker ? 'Update Speaker' : 'Add Speaker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog.Root open={!!speakerToDelete}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">
              Delete Speaker
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
              Are you sure you want to delete this speaker? This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => setSpeakerToDelete(null)}
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  onClick={handleDeleteSpeaker}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
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
}