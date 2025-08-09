"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast";
import AddSeminarModal from "./AddSeminarModal";
import SeminarDetailsView from "./SeminarDetailsView";
import SeminarList from "./SeminarList";
import { Seminar, SeminarDetails } from "./types";

const TrainingResourcesNew: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "details" | "resources">("list");
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`
      );
      const data = await response.json();
      if (data.status === "success") {
        const sortedSeminars = data.data.sort(
          (a: Seminar, b: Seminar) => {
            const yearA = a.title.match(/\d{4}/)?.[0] || "0";
            const yearB = b.title.match(/\d{4}/)?.[0] || "0";
            return parseInt(yearB) - parseInt(yearA);
          }
        );
        setSeminars(sortedSeminars);
        
        if (sortedSeminars.length > 0) {
          const latestSeminar = sortedSeminars[0];
          setSelectedSeminar(latestSeminar);
          fetchSeminarDetails(latestSeminar.id);
        }
      }
    } catch (error) {
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
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch seminar details: ${response.status}`);
      }

      const data = await response.json();
      setSeminarDetails(data.data);
    } catch (error) {
      showToast.error("Failed to load seminar details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteSeminar = async (seminarId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete_seminar/${seminarId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json"
          },
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to delete seminar: ${response.status}`);
      }
  
      await fetchSeminars();
      showToast.success("Seminar deleted successfully");
      
      if (selectedSeminar?.id === seminarId) {
        setViewMode("list");
        setSelectedSeminar(null);
      }
    } catch (error) {
      showToast.error("Failed to delete seminar");
    }
  };

  const handleViewDetails = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    setViewMode("details");
    fetchSeminarDetails(seminar.id);
  };

  const handleViewResources = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    setViewMode("resources");
  };

  const handleBackToList = () => {
    setViewMode("list");
    if (seminars.length > 0) {
      setSelectedSeminar(seminars[0]);
      fetchSeminarDetails(seminars[0].id);
    }
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {viewMode === "details" && selectedSeminar ? (
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
        ) : (
          <div className="space-y-8">
            {/* Header Section with Add Button */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Training Seminars</h1>
                  <p className="text-gray-600 dark:text-gray-300">Manage and view all your training seminars</p>
                </div>
                <AddSeminarModal onSuccess={fetchSeminars} />
              </div>
            </div>

            {/* Current Seminar Details */}
            {selectedSeminar && seminarDetails && (
              <div className="space-y-4">
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
            )}

            {/* Past Seminars List */}
            {seminars.length > 1 && (
              <SeminarList 
                seminars={seminars} 
                onViewDetails={handleViewDetails}
                selectedSeminar={selectedSeminar}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingResourcesNew;