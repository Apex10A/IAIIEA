"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, Search, Calendar, Users, ChevronRight, ChevronLeftIcon } from "lucide-react";
import { showToast } from "@/utils/toast";

interface Conference {
  date: string;
  theme: string;
  status: string;
  id: number;
  title: string;
  description: string;
  year: string;
  is_registered: boolean;
  venue: string;
}

interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  country: string;
  institution: string;
}

interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

const ConferenceParticipantsPage = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [conferenceDetails, setConferenceDetails] = useState<ConferenceDetails | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const membersPerPage = 8;
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Sort conferences by year (newest first)
  const sortConferences = (confs: Conference[]) => {
    return [...confs].sort((a, b) => {
      // const yearA = parseInt(a.title.match(/\d{4}/)?.[0] || "0";
      // const yearB = parseInt(b.title.match(/\d{4}/)?.[0] || "0";
      // return yearB - yearA;
    });
  };

  // Fetch conferences
  useEffect(() => {
    const fetchConferences = async () => {
      if (!bearerToken) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/landing/events`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch conferences");

        const data = await response.json();
        const sortedConferences = sortConferences(data.data);
        setConferences(sortedConferences);
        
        // Automatically select the latest conference (first in the sorted array)
        if (sortedConferences.length > 0) {
          const latestConference = sortedConferences[0];
          setSelectedConference(latestConference);
          fetchConferenceDetails(latestConference.id);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching conferences:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsLoading(false);
      }
    };

    fetchConferences();
  }, [bearerToken, API_URL]);

  // Fetch conference details including registration status
  const fetchConferenceDetails = async (conferenceId: number) => {
    if (!bearerToken) return;
    
    setDetailsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/landing/event_details/${conferenceId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch conference details");

      const data = await response.json();
      setConferenceDetails(data.data);
    } catch (err) {
      console.error("Error fetching conference details:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch conference participants when a conference is selected
  useEffect(() => {
    const fetchConferenceParticipants = async () => {
      if (!selectedConference || !bearerToken) return;

      setIsLoading(true);
      try {
        const participantsResponse = await fetch(
          `${API_URL}/admin/user_list/conference_member/${selectedConference.id}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!participantsResponse.ok) throw new Error("Failed to fetch participants");

        const participantsData = await participantsResponse.json();
        setMembers(participantsData.data);
        setFilteredMembers(participantsData.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching conference data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConferenceParticipants();
  }, [selectedConference, bearerToken, API_URL]);

  // Search functionality
  useEffect(() => {
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [searchTerm, members]);

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleBackToConferences = () => {
    setSelectedConference(null);
    setMembers([]);
    setFilteredMembers([]);
    setSelectedMembers([]);
    setSearchTerm("");
  };

  const handleMemberSelect = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(currentMembers.map((member) => member.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming": return "bg-blue-100 text-blue-800";
      case "Ongoing": return "bg-green-100 text-green-800";
      case "Completed": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Page header */}
          <div className="md:flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedConference 
                ? `${selectedConference.title} Participants` 
                : "Conference Management"}
            </h1>
            {selectedConference && (
              <button
                onClick={handleBackToConferences}
                className="flex items-center justify-center space-x-2 mt-2 md:mt-0 text-center w-full md:w-auto bg-white px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="text-center">Back to Conferences</span>
              </button>
            )}
          </div>

          {/* Main Content Area */}
          {!selectedConference ? (
            // Conference List View
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Available Conferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conferences.map((conference) => (
                  <Card 
                    key={conference.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedConference(conference);
                      fetchConferenceDetails(conference.id);
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src="/Meeting.png"
                          alt={conference.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-4 left-4">
                          <span className={`${getStatusColor(conference.status)} px-3 py-1 rounded-full text-xs font-medium`}>
                            {conference.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {conference.title}
                          </h3>
                          <span className="text-gray-500 text-sm">
                            {conference.year}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {conference.theme}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{conference.date}</span>
                          </div>
                        </div>
                        <button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          View Participants
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Conference Details and Participants View
            <div className="space-y-6">
              {/* Conference Summary Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedConference.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {selectedConference.theme}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedConference.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{filteredMembers.length} participants</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`${getStatusColor(selectedConference.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {selectedConference.status}
                      </span>
                    </div>
                  </div>

                  {/* Registration Status Message */}
                  {conferenceDetails && !conferenceDetails.is_registered && (
                    <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            You need to register for this conference to view all participant details.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Participants Table - Only show if registered */}
              {conferenceDetails?.is_registered ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Participant List
                      </h3>
                      <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search participants..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {filteredMembers.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No participants found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm 
                            ? "No matching participants for your search."
                            : "This conference doesn't have any participants yet."}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto ">
                        <Table className="min-w-[1200px]">
                          <TableHeader>
                            <TableRow>
                              {/* <TableHead className="w-12">
                                <input
                                  type="checkbox"
                                  checked={isAllSelected}
                                  onChange={handleSelectAll}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </TableHead> */}
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Country</TableHead>
                              <TableHead>Institution</TableHead>
                              <TableHead>Role</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentMembers.map((member) => (
                              <TableRow key={member.id} className="hover:bg-gray-50">
                                {/* <TableCell>
                                  <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.id)}
                                    onChange={() => handleMemberSelect(member.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </TableCell> */}
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${member.name}`}
                                      alt={`${member.name}'s avatar`}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <span>{member.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">{member.email}</TableCell>
                                <TableCell>{member.country}</TableCell>
                                <TableCell>{member.institution}</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {member.role}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                              <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Next
                              </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm text-gray-700">
                                  Showing <span className="font-medium">{indexOfFirstMember + 1}</span> to{' '}
                                  <span className="font-medium">{Math.min(indexOfLastMember, filteredMembers.length)}</span> of{' '}
                                  <span className="font-medium">{filteredMembers.length}</span> results
                                </p>
                              </div>
                              <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                  <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                  >
                                    <ChevronLeft className="h-5 w-5" />
                                  </button>
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                      key={page}
                                      onClick={() => paginate(page)}
                                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        currentPage === page
                                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                  </button>
                                </nav>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                // Show message if not registered
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Participant List Restricted
                    </h3>
                    <p className="text-gray-500">
                      Please register for this conference to view the participant list.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConferenceParticipantsPage;