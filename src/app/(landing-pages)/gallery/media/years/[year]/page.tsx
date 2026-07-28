"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
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
        <p className="mt-4">Loading gallery...</p>
      </div>
    </div>
  </div>
);

const GalleryContent = () => {
  const { year } = useParams<{ year: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedEvent = searchParams.get("event");

  const [events, setEvents] = useState<GalleryByEvent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
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
          throw new Error(data.message || "Failed to fetch gallery");
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

  const selectedImages = selectedEvent ? events[selectedEvent] ?? [] : [];
  const eventTitle = selectedEvent ? formatEventTitle(selectedEvent, year) : `${year} Events`;

  return (
    <div className="px-4 lg:px-10 py-10 bg-[#0e1a3d] text-white min-h-screen">
      <div className="text-center mb-10 mt-20">
        <p className="text-yellow-500 text-sm md:text-base">
          Gallery {" > "} Media {" > "}
          <Link href="/gallery/media" className="hover:underline text-yellow-400">
            Gallery
          </Link>
          {" > "}
          {selectedEvent ? (
            <>
              <button
                type="button"
                onClick={() => router.push(`/gallery/media/years/${year}`)}
                className="hover:underline text-yellow-400"
              >
                {year}
              </button>
              {" > "}
              <span className="text-white">{eventTitle}</span>
            </>
          ) : (
            <span className="text-white">{year}</span>
          )}
        </p>
        <h1 className="font-bold text-3xl md:text-5xl">{eventTitle}</h1>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-400">Error: {error}</p>}

      {!loading && !error && !selectedEvent && eventEntries.length === 0 && (
        <p className="text-center text-gray-300">No events found for {year}.</p>
      )}

      {!loading && !error && !selectedEvent && eventEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {eventEntries.map(([eventSlug, images]) => (
            <YearImage
              key={eventSlug}
              year={year}
              imageUrl={images[0].image}
              title={formatEventTitle(eventSlug, year)}
              href={`/gallery/media/years/${year}?event=${encodeURIComponent(eventSlug)}`}
            />
          ))}
        </div>
      )}

      {!loading && !error && selectedEvent && selectedImages.length === 0 && (
        <p className="text-center text-gray-300">No images found for this event.</p>
      )}

      {!loading && !error && selectedEvent && selectedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {selectedImages.map((image) => (
            <div
              key={image.gallery_id ?? `${image.image}-${image.date}`}
              className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg"
            >
              <Image
                src={image.image}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 w-full p-2 text-sm">
                <p>{image.caption}</p>
                <p className="text-xs text-gray-300">
                  {new Date(image.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const YearPage = () => (
  <Suspense fallback={<LoadingUI />}>
    <GalleryContent />
  </Suspense>
);

export default YearPage;
