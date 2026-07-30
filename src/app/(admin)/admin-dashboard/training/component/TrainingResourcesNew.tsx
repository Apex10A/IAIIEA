"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar, Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast";
import AddSeminarModal from "./AddSeminarModal";
import SeminarDetailsView from "./SeminarDetailsView";
import SeminarList from "./SeminarList";
import { Seminar, SeminarDetails } from "./types";
import { parseSeminarIdParam, sortSeminars } from "../utils/seminarNav";
import { BackLink } from "@/app/(admin)/admin-dashboard/components/BackLink";

const TrainingResourcesNew: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const seminarIdParam = searchParams.get("id");
  const seminarId = parseSeminarIdParam(seminarIdParam);
  const viewParam = searchParams.get("view");
  const viewMode =
    seminarId !== null
      ? viewParam === "resources"
        ? "resources"
        : "details"
      : "list";

  const selectedSeminar = useMemo(() => {
    if (seminarId === null) return null;
    return seminars.find((seminar) => seminar.id === seminarId) ?? null;
  }, [seminarId, seminars]);

  const setSeminarUrl = (id: number, view: "details" | "resources" = "details") => {
    const params = new URLSearchParams();
    params.set("id", String(id));
    if (view === "resources") {
      params.set("view", "resources");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSeminarUrl = () => {
    router.replace(pathname);
  };

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`
      );
      const data = await response.json();
      if (data.status === "success") {
        setSeminars(sortSeminars(data.data));
      }
    } catch (error) {
      console.error("Error fetching seminars:", error);
      showToast.error("Failed to load seminars");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeminarDetails = async (id: number) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch seminar details: ${response.status}`);
      }

      const data = await response.json();
      setSeminarDetails(data.data);
    } catch (error) {
      console.error("Error fetching seminar details:", error);
      showToast.error("Failed to load seminar details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteSeminar = async (deletedSeminarId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete_seminar`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: deletedSeminarId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete seminar: ${response.status}`);
      }

      await fetchSeminars();
      showToast.success("Seminar deleted successfully");

      if (
        deletedSeminarId === seminarId ||
        deletedSeminarId === Number.parseInt(seminarIdParam ?? "", 10)
      ) {
        clearSeminarUrl();
        setSeminarDetails(null);
      }
    } catch (error) {
      console.error("Error deleting seminar:", error);
      showToast.error("Failed to delete seminar");
    }
  };

  const handleViewDetails = (seminar: Seminar) => {
    setSeminarUrl(seminar.id, "details");
  };

  const handleViewResources = (seminar: Seminar) => {
    setSeminarUrl(seminar.id, "resources");
  };

  const handleBackToList = () => {
    setSeminarDetails(null);
    clearSeminarUrl();
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  useEffect(() => {
    if (seminarId === null) {
      setSeminarDetails(null);
      return;
    }

    fetchSeminarDetails(seminarId);
  }, [seminarId, bearerToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const hasInvalidSeminarId = seminarId !== null && !selectedSeminar;

  if (hasInvalidSeminarId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Seminar not found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No seminar matches id {seminarId}. It may have been removed.
            </p>
            <BackLink
              variant="button"
              label="Back to seminars"
              onClick={handleBackToList}
            />
          </div>
        </div>
      </div>
    );
  }

  if (
    (viewMode === "details" || viewMode === "resources") &&
    selectedSeminar
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-8 px-4">
          <SeminarDetailsView
            seminar={selectedSeminar}
            seminarDetails={seminarDetails}
            loading={detailsLoading}
            onBack={handleBackToList}
            onViewResources={handleViewResources}
            onEdit={() => fetchSeminarDetails(selectedSeminar.id)}
            onDelete={() => handleDeleteSeminar(selectedSeminar.id)}
            handleDeleteSeminar={handleDeleteSeminar}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Training Seminars
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Select a seminar to view details and manage resources.
                </p>
              </div>
              <AddSeminarModal onSuccess={fetchSeminars} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            {seminars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No seminars yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
                  Create your first seminar to manage speakers, pricing, and
                  resources from one place.
                </p>
                <AddSeminarModal onSuccess={fetchSeminars} />
              </div>
            ) : (
              <SeminarList seminars={seminars} onViewDetails={handleViewDetails} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingResourcesNew;
