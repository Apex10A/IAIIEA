import React, { useState, useEffect } from 'react';
import { PlusIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Dialog from '@radix-ui/react-dialog';
import { useSession } from "next-auth/react";

const GalleryPage = () => {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newGallery, setNewGallery] = useState({
    year: '',
    gallery: [],
    caption: []
  });

  // Fetch all galleries
  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/landing/gallery`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === "success") {
        setGalleries(data.data);
      }
    } catch (err) {
      setError("Failed to fetch galleries");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific gallery
// Fetch specific gallery
const fetchGalleryByYear = async (year: any) => {
  try {
    const response = await fetch(`${API_URL}/landing/gallery/${year}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (data.status === "success") {
      // Transform the API response to match the expected format
      const transformedData = {
        year: year,
        images: data.data.map((item: { image: any; caption: any; }) => ({
          url: item.image,
          caption: item.caption
        }))
      };
      setSelectedGallery(transformedData);
    }
  } catch (err) {
    console.error("Failed to fetch gallery details:", err);
  }
};

useEffect(() => {
  fetchGalleries();
}, []);

  const handleYearChange = (e: { target: { value: any; }; }) => {
    setNewGallery(prev => ({
      ...prev,
      year: e.target.value
    }));
  };

  const handleImagesChange = (e: { target: { files: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
    const files = Array.from(e.target.files);
    
    // Create empty captions array of the same length
    const newCaptions = Array(files.length).fill('');
    
    setNewGallery(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...files],
      caption: [...prev.caption, ...newCaptions]
    }));
  };

  const handleCaptionChange = (index: number, value: string) => {
    setNewGallery(prev => {
      const newCaptions = [...prev.caption];
      newCaptions[index] = value;
      return {
        ...prev,
        caption: newCaptions
      };
    });
  };

  const removeImage = (index: number) => {
    setNewGallery(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
      caption: prev.caption.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('year', newGallery.year);
      
      newGallery.gallery.forEach((file, index) => {
        formData.append('gallery[]', file);
        formData.append('caption[]', newGallery.caption[index]);
      });

      const response = await fetch(`${API_URL}/admin/upload_gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData
      });
      
      const data = await response.json();

      if (data.status === "success") {
        setIsModalOpen(false);
        fetchGalleries();
        setNewGallery({ year: '', gallery: [], caption: [] });
      }
    } catch (err) {
      console.error("Failed to create gallery:", err);
    }
  };

  return (
    <div>
      <div className='bg-gray-200 px-5 py-5 mb-5 flex items-center justify-between'>
        <h1 className="text-2xl font-bold text-black">Gallery</h1>
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none">
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Year</Label>
                  <Input
                    type="text"
                    value={newGallery.year}
                    onChange={handleYearChange}
                    placeholder="Enter year"
                    required
                  />
                </div>

                <div>
                  <Label>Gallery Images</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {newGallery.gallery.map((file, index) => (
                      <div key={index} className="relative border p-4 rounded-lg">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <Input
                          placeholder="Image caption"
                          value={newGallery.caption[index]}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Dialog.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.Close>
                 
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {galleries.map((gallery) => (
            <div
              key={gallery.year}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => fetchGalleryByYear(gallery.year)}
            >
              <img
                src={gallery.cover}
                alt={`Gallery ${gallery.year}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center opacity-[0.8]">Conference {gallery.year}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGallery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Gallery {selectedGallery.year}</h2>
              <Button variant="outline" onClick={() => setSelectedGallery(null)}>
                Close
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedGallery.images?.map((image, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {image.caption && (
                    <p className="text-sm text-gray-600 text-center">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;