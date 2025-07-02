"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { showToast } from '@/utils/toast';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface GalleryImage {
  gallery_id: number;
  date: string;
  year: string;
  caption: string;
  image: string;
}

export default function GalleryYearPage() {
  const { year } = useParams();
  const { data: session } = useSession();
  const [gallery, setGallery] = useState<Record<string, GalleryImage[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const router = useRouter();

  useEffect(() => {
    if (year) fetchYearGallery(year as string);
    // eslint-disable-next-line
  }, [year]);

  const fetchYearGallery = async (year: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/landing/gallery/${year}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      if (data.status === 'success') {
        setGallery(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch gallery');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally, add edit/delete logic here (reuse from main page if needed)

  return (
    <div className="p-6">
      <Button variant="outline" className="mb-4" onClick={() => router.push('/admin-dashboard/gallery')}>
        ← Back to Gallery Years
      </Button>
      <h1 className="text-2xl font-bold mb-6">Gallery {year}</h1>
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {gallery && Object.keys(gallery).length > 0 ? (
        Object.entries(gallery).map(([activityName, images]) => (
          <div key={activityName} className="mb-8">
            <h3 className="text-lg font-bold mb-3">{activityName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.gallery_id}>
                  <CardContent className="pt-6">
                    <img
                      src={image.image}
                      alt={image.caption}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-gray-600">{image.caption}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        // onClick={...} // Add edit logic if needed
                      >
                        <Pencil size={16} />
                      </Button>
                      <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </AlertDialog.Trigger>
                        {/* Add AlertDialog.Portal and delete logic here if needed */}
                      </AlertDialog.Root>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        !isLoading && <div className="text-gray-500">No images found for this year.</div>
      )}
    </div>
  );
} 