"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import YearImage from "../../yearImage";

interface GalleryImage {
  gallery_id: number;
  date: string;
  year?: string;
  caption: string;
  image: string;
}

/** Activity row from GET landing/gallery/{year} */
interface GalleryActivity {
  activity: string;
  slug: string;
  cover: string;
}

type LegacyGalleryByEvent = Record<string, GalleryImage[]>;

function isGalleryActivity(value: unknown): value is GalleryActivity {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.slug === "string" &&
    typeof row.cover === "string" &&
    (typeof row.activity === "string" || typeof row.name === "string")
  );
}

function activityLabel(row: GalleryActivity): string {
  return row.activity || (row as GalleryActivity & { name?: string }).name || row.slug;
}

function parseYearActivities(payload: unknown): GalleryActivity[] {
  if (!Array.isArray(payload)) return [];

  return payload.filter(isGalleryActivity).map((row) => ({
    activity: activityLabel(row),
    slug: row.slug,
    cover: row.cover,
  }));
}

function parseLegacyEvents(payload: unknown): LegacyGalleryByEvent {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const result: LegacyGalleryByEvent = {};
  for (const [key, value] of Object.entries(payload)) {
    if (Array.isArray(value) && value.length > 0 && value[0]?.image) {
      result[key] = value as GalleryImage[];
    }
  }
  return result;
}

function parseSlugImages(payload: unknown): GalleryImage[] {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload.filter((item) => item && typeof item === "object" && "image" in item) as GalleryImage[];
  }

  if (typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.images)) {
      return data.images as GalleryImage[];
    }
  }

  return [];
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
  const selectedSlug = searchParams.get("event");

  const [activities, setActivities] = useState<GalleryActivity[]>([]);
  const [legacyEvents, setLegacyEvents] = useState<LegacyGalleryByEvent>({});
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYearGallery = async () => {
      if (!year) return;

      try {
        setLoadingActivities(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/gallery/${year}`
        );
        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch gallery");
        }

        const payload = data.data;
        const activityRows = parseYearActivities(payload);

        if (activityRows.length > 0) {
          setActivities(activityRows);
          setLegacyEvents({});
        } else if (Array.isArray(payload) && payload.length === 0) {
          setActivities([]);
          setLegacyEvents({});
        } else {
          setActivities([]);
          setLegacyEvents(parseLegacyEvents(payload));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setActivities([]);
        setLegacyEvents({});
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchYearGallery();
  }, [year]);

  useEffect(() => {
    const fetchSlugGallery = async () => {
      if (!selectedSlug) {
        setSelectedImages([]);
        return;
      }

      const legacy = legacyEvents[selectedSlug];
      if (legacy?.length) {
        setSelectedImages(legacy);
        return;
      }

      try {
        setLoadingImages(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/gallery/${encodeURIComponent(selectedSlug)}`
        );
        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch gallery images");
        }

        setSelectedImages(parseSlugImages(data.data));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setSelectedImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    if (!loadingActivities) {
      fetchSlugGallery();
    }
  }, [selectedSlug, legacyEvents, loadingActivities]);

  const legacyEntries = Object.entries(legacyEvents).filter(
    ([, images]) => Array.isArray(images) && images.length > 0
  );

  const selectedActivity = activities.find((a) => a.slug === selectedSlug);
  const eventTitle = selectedActivity
    ? selectedActivity.activity
    : selectedSlug
      ? selectedSlug
          .split(/[-_]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : `${year} Events`;

  const loading = loadingActivities || (Boolean(selectedSlug) && loadingImages);
  const hasActivities = activities.length > 0 || legacyEntries.length > 0;

  return (
    <div className="px-4 lg:px-10 py-10 bg-[#0e1a3d] text-white min-h-screen">
      <div className="text-center mb-10 mt-20">
        <p className="text-yellow-500 text-sm md:text-base">
          Gallery {" > "} Media {" > "}
          <Link href="/gallery/media" className="hover:underline text-yellow-400">
            Gallery
          </Link>
          {" > "}
          {selectedSlug ? (
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

      {!loading && !error && !selectedSlug && !hasActivities && (
        <p className="text-center text-gray-300">
          No activities found for {year}.
        </p>
      )}

      {!loading && !error && !selectedSlug && activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {activities.map((item) => (
            <YearImage
              key={item.slug}
              year={year}
              imageUrl={item.cover}
              title={item.activity}
              href={`/gallery/media/years/${year}?event=${encodeURIComponent(item.slug)}`}
            />
          ))}
        </div>
      )}

      {!loading && !error && !selectedSlug && activities.length === 0 && legacyEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {legacyEntries.map(([eventSlug, images]) => (
            <YearImage
              key={eventSlug}
              year={year}
              imageUrl={images[0].image}
              title={eventSlug
                .split(/[-_]/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              href={`/gallery/media/years/${year}?event=${encodeURIComponent(eventSlug)}`}
            />
          ))}
        </div>
      )}

      {!loading && !error && selectedSlug && selectedImages.length === 0 && (
        <p className="text-center text-gray-300">No images found for this activity.</p>
      )}

      {!loading && !error && selectedSlug && selectedImages.length > 0 && (
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
                {image.date && (
                  <p className="text-xs text-gray-300">
                    {new Date(image.date).toLocaleDateString()}
                  </p>
                )}
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
