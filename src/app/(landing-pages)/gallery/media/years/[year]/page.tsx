"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import YearImage from "../../yearImage";

interface GalleryItem {
  gallery_id: number;
  date: string;
  year: string;
  caption: string;
  image: string;
}

type GalleryByEvent = Record<string, GalleryItem[]>;

function formatEventTitle(slug: string, year: string): string {
  const label = slug
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return `${label} ${year}`;
}

const LoadingUI = () => (
  <div className="px-4 lg:px-10 py-10 bg-[#0e1a3d] text-white min-h-screen">
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-4">Loading events...</p>
      </div>
    </div>
  </div>
);

const YearEventsContent = () => {
  const { year } = useParams<{ year: string }>();
  const [events, setEvents] = useState<GalleryByEvent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/gallery/${year}`
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          const payload = data.data;

          if (Array.isArray(payload)) {
            setEvents({ gallery: payload });
          } else if (payload && typeof payload === "object") {
            setEvents(payload as GalleryByEvent);
          } else {
            setEvents({});
          }
        } else {
          throw new Error(data.message || "Failed to fetch gallery events");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (year) fetchGallery();
  }, [year]);

  const eventEntries = Object.entries(events).filter(
    ([, images]) => Array.isArray(images) && images.length > 0
  );

  return (
    <div className="px-4 lg:px-10 py-10 bg-white min-h-screen">
      <div className="text-center mb-10 mt-20">
        <p className="text-yellow-600 text-sm md:text-base">
          Gallery {" > "} Media {" > "}
          <Link href="/gallery/media" className="hover:underline">
            Gallery
          </Link>
          {" > "}
          <span className="text-[#0e1a3d] font-medium">{year}</span>
        </p>
        <h1 className="font-bold text-3xl md:text-5xl text-[#0e1a3d] mt-2">
          {year} Events
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Select an event to view its photo gallery.
        </p>
      </div>

      {loading && (
        <p className="text-center text-gray-600">Loading events...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Error: {error}</p>
      )}

      {!loading && !error && eventEntries.length === 0 && (
        <p className="text-center text-gray-500">No events found for {year}.</p>
      )}

      {!loading && !error && eventEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {eventEntries.map(([eventSlug, images]) => (
            <YearImage
              key={eventSlug}
              year={year}
              imageUrl={images[0].image}
              title={formatEventTitle(eventSlug, year)}
              href={`/gallery/media/years/${year}/${encodeURIComponent(eventSlug)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const YearPage = () => (
  <Suspense fallback={<LoadingUI />}>
    <YearEventsContent />
  </Suspense>
);

export default YearPage;
