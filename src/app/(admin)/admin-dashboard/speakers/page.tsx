"use client"
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { Phone, Mail, Edit, Trash, Plus, X } from 'lucide-react';
import { countries } from '@/utils/countries'; 
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface Speaker {
  id: number;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  role: string;
  type: string;
  image_url?: string;
}

interface SpeakerDetails {
  user_id: string;
  f_name: string;
  m_name: string;
  l_name: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  whatsapp_no: string;
  area_of_specialization: string;
  profession: string;
  postal_addr: string;
  residential_addr: string;
  role: string;
  type: string;
}

interface FormData {
  title: string;
  f_name: string;
  m_name: string;
  l_name: string;
  phone: string;
  email: string;
  country: string;
  institution: string;
  whatsapp_no: string;
  area_of_specialization: string;
  profession: string;
  postal_addr: string;
  residential_addr: string;
  image: File | null;
  imagePreview: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Speaker[] | SpeakerDetails;
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiM5Q0EzQUYiLz48cGF0aCBkPSJNMTYwIDE4MEg0MFYxNjBDNDAgMTI2Ljg2MyA2Ni44NjMgMTAwIDEwMCAxMDBDMTMzLjEzNyAxMDAgMTYwIDEyNi44NjMgMTYwIDE2MFYxODBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+';

export default function SpeakersManagement() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [viewingSpeaker, setViewingSpeaker] = useState<SpeakerDetails | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [speakerToDelete, setSpeakerToDelete] = useState<Speaker | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    f_name: '',
    m_name: '',
    l_name: '',
    phone: '',
    email: '',
    country: '',
    institution: '',
    whatsapp_no: '',
    area_of_specialization: '',
    profession: '',
    postal_addr: '',
    residential_addr: '',
    image: null,
    imagePreview: '',
  });

  // Fetch speakers data
  const fetchSpeakers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/speaker`, {
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
        setSpeakers(data.data as Speaker[]);
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

  // Fetch speaker details
  const fetchSpeakerDetails = async (speakerId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_details/${speakerId}`, {
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
        return data.data as SpeakerDetails;
      } else {
        throw new Error(data.message || 'Failed to fetch speaker details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching speaker details:', err);
      return null;
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchSpeakers();
    }
  }, [bearerToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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

  const openAddModal = () => {
    setEditingSpeaker(null);
    setFormData({
      title: '',
      f_name: '',
      m_name: '',
      l_name: '',
      phone: '',
      email: '',
      country: '',
      institution: '',
      whatsapp_no: '',
      area_of_specialization: '',
      profession: '',
      postal_addr: '',
      residential_addr: '',
      image: null,
      imagePreview: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (speaker: Speaker) => {
    if (!speaker.user_id) return;
    
    const details = await fetchSpeakerDetails(speaker.user_id);
    if (!details) return;

    setEditingSpeaker(speaker);
    setFormData({
      title: details.role,
      f_name: details.f_name,
      m_name: details.m_name,
      l_name: details.l_name,
      phone: details.phone,
      email: details.email,
      country: details.country,
      institution: details.institution,
      whatsapp_no: details.whatsapp_no,
      area_of_specialization: details.area_of_specialization,
      profession: details.profession,
      postal_addr: details.postal_addr,
      residential_addr: details.residential_addr,
      image: null,
      imagePreview: speaker.image_url || '',
    });
    setIsModalOpen(true);
  };

  const openViewModal = async (speaker: Speaker) => {
    if (!speaker.user_id) return;
    
    const details = await fetchSpeakerDetails(speaker.user_id);
    if (!details) return;

    setViewingSpeaker(details);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setViewingSpeaker(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('f_name', formData.f_name);
      form.append('m_name', formData.m_name);
      form.append('l_name', formData.l_name);
      form.append('phone', formData.phone);
      form.append('email', formData.email);
      form.append('country', formData.country);
      form.append('institution', formData.institution);
      form.append('whatsapp_no', formData.whatsapp_no);
      form.append('area_of_specialization', formData.area_of_specialization);
      form.append('profession', formData.profession);
      form.append('postal_addr', formData.postal_addr);
      form.append('residential_addr', formData.residential_addr);
      
      if (formData.image) {
        form.append('image', formData.image);
      }

      let url, method;
      if (editingSpeaker && editingSpeaker.user_id) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/admin/edit_user_info`;
        method = 'POST';
        form.append('id', editingSpeaker.user_id);
        form.append('type', 'speaker');
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/admin/register_speaker`;
        method = 'POST';
      }

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
        fetchSpeakers();
        
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

  const confirmDelete = (speaker: Speaker) => {
    setSpeakerToDelete(speaker);
  };

  const handleDeleteSpeaker = async () => {
    if (!speakerToDelete || !speakerToDelete.user_id) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_user`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: speakerToDelete.user_id,
          type: "speaker"
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setSpeakers(speakers.filter(speaker => speaker.id !== speakerToDelete.id));
        setSuccessMessage('Speaker deleted successfully');
        setSpeakerToDelete(null);
        
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
      <header className="bg-[#203A87] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Speakers Management</h1>
          <p className="text-xl text-center mt-4 max-w-2xl mx-auto">
            Manage speakers for your event - add, edit, or remove speakers.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-8">
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center bg-[#203A87] hover:bg-[#003B8E] text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors duration-300"
          >
            <Plus className="mr-2" size={20} />
            Add New Speaker
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : speakers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <div 
                key={speaker.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-64 w-full group">
                  <Image
                    src={speaker.image_url || PLACEHOLDER_IMAGE}
                    alt={speaker.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
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
                          onClick={() => confirmDelete(speaker)}
                        >
                          <Trash size={16} className="text-red-600" />
                        </button>
                      </AlertDialog.Trigger>
                    </AlertDialog.Root>
                  </div>
                </div>
                <div className="p-6">
                  <h2 
                    className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => openViewModal(speaker)}
                  >
                    {speaker.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{speaker.institution}</p>
                  
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

      {/* Add/Edit Speaker Modal */}
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
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Dr."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="f_name">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="f_name"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. John"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="m_name">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="m_name"
                    name="m_name"
                    value={formData.m_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Middle"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="l_name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="l_name"
                    name="l_name"
                    value={formData.l_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Smith"
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
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="whatsapp_no">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="whatsapp_no"
                    name="whatsapp_no"
                    value={formData.whatsapp_no}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="institution">
                    Institution
                  </label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="profession">
                    Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="area_of_specialization">
                    Area of Specialization
                  </label>
                  <input
                    type="text"
                    id="area_of_specialization"
                    name="area_of_specialization"
                    value={formData.area_of_specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="postal_addr">
                    Postal Address
                  </label>
                  <textarea
                    id="postal_addr"
                    name="postal_addr"
                    value={formData.postal_addr}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="residential_addr">
                    Residential Address
                  </label>
                  <textarea
                    id="residential_addr"
                    name="residential_addr"
                    value={formData.residential_addr}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
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
                  className="bg-[#0052CC] hover:bg-[#003B8E] text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
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

      {/* View Speaker Details Modal */}
      {viewingSpeaker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Speaker Details
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Name</h3>
                  <p className="text-gray-900">{viewingSpeaker.name}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Email</h3>
                  <p className="text-gray-900">{viewingSpeaker.email}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Phone</h3>
                  <p className="text-gray-900">{viewingSpeaker.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">WhatsApp</h3>
                  <p className="text-gray-900">{viewingSpeaker.whatsapp_no || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Country</h3>
                  <p className="text-gray-900">{viewingSpeaker.country || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Institution</h3>
                  <p className="text-gray-900">{viewingSpeaker.institution || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Profession</h3>
                  <p className="text-gray-900">{viewingSpeaker.profession || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Specialization</h3>
                  <p className="text-gray-900">{viewingSpeaker.area_of_specialization || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700">Postal Address</h3>
                  <p className="text-gray-900">{viewingSpeaker.postal_addr || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700">Residential Address</h3>
                  <p className="text-gray-900">{viewingSpeaker.residential_addr || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-[#0052CC] hover:bg-[#003B8E] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
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
              Are you sure you want to delete {speakerToDelete?.name}? This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => setSpeakerToDelete(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  onClick={handleDeleteSpeaker}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  )}
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