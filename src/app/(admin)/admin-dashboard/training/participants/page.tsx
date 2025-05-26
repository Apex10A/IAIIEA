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

// Types
interface UserData {
  token: string;
}

interface SessionUser {
  userData?: UserData;
  token?: string;
}

interface Session {
  user?: SessionUser;
}

interface Seminar {
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

interface SeminarDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

const SeminarParticipantsPage = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
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
  const bearerToken = (session?.user as SessionUser)?.userData?.token || (session?.user as SessionUser)?.token;

  // Sort seminars by year (newest first)
  const sortSeminars = (sems: Seminar[]) => {
    return [...sems].sort((a, b) => {
      const yearA = parseInt(a.title.match(/\d{4}/)?.[0] || "0");
      const yearB = parseInt(b.title.match(/\d{4}/)?.[0] || "0");
      return yearB - yearA;
    });
  };

  // Fetch seminars
  useEffect(() => {
    const fetchSeminars = async () => {
      if (!bearerToken) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/landing/seminars`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch seminars");

        const data = await response.json();
        const sortedSeminars = sortSeminars(data.data);
        setSeminars(sortedSeminars);
        
        // Automatically select the latest seminar (first in the sorted array)
        if (sortedSeminars.length > 0) {
          const latestSeminar = sortedSeminars[0];
          setSelectedSeminar(latestSeminar);
          fetchSeminarDetails(latestSeminar.id);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching seminars:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsLoading(false);
      }
    };

    fetchSeminars();
  }, [bearerToken, API_URL]);

  // Fetch seminar details including registration status
  const fetchSeminarDetails = async (seminarId: number) => {
    if (!bearerToken) return;
    
    setDetailsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/landing/seminar_details/${seminarId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch seminar details");

      const data = await response.json();
      setSeminarDetails(data.data);
    } catch (err) {
      console.error("Error fetching seminar details:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch seminar participants when a seminar is selected
  useEffect(() => {
    const fetchSeminarParticipants = async () => {
      if (!selectedSeminar || !bearerToken) return;

      setIsLoading(true);
      try {
        const participantsResponse = await fetch(
          `${API_URL}/admin/user_list/seminar_member/${selectedSeminar.id}`,
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
        console.error("Error fetching seminar data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeminarParticipants();
  }, [selectedSeminar, bearerToken, API_URL]);

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

  const handleBackToSeminars = () => {
    setSelectedSeminar(null);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {selectedSeminar 
                ? `${selectedSeminar.title} Participants` 
                : "Seminar Management"}
            </h1>
            {selectedSeminar && (
              <button
                onClick={handleBackToSeminars}
                className="flex items-center justify-center space-x-2 w-full md:w-auto mt-2 md:mt-0 bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span>Back to Seminars</span>
              </button>
            )}
          </div>

          {/* Main Content Area */}
          {!selectedSeminar ? (
            // Seminar List View
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Available Seminars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seminars.map((seminar) => (
                  <Card 
                    key={seminar.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedSeminar(seminar);
                      fetchSeminarDetails(seminar.id);
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src="/Meeting.png"
                          alt={seminar.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-4 left-4">
                          <span className={`${getStatusColor(seminar.status)} px-3 py-1 rounded-full text-xs font-medium`}>
                            {seminar.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {seminar.title}
                          </h3>
                          <span className="text-gray-700 dark:text-gray-400 text-sm">
                            {seminar.year}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {seminar.theme}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{seminar.date}</span>
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
            // Seminar Details and Participants View
            <div className="space-y-6">
              {/* Seminar Summary Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedSeminar.title}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-400 mt-1">
                        {selectedSeminar.theme}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedSeminar.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{filteredMembers.length} participants</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`${getStatusColor(selectedSeminar.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {selectedSeminar.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants Table */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                  </div>

                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        No participants found
                      </h3>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                        {searchTerm 
                          ? "No matching participants for your search."
                          : "This seminar doesn't have any participants yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Email</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Country</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Institution</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Role</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentMembers.map((member) => (
                            <TableRow key={member.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${member.name}`}
                                    alt={`${member.name}'s avatar`}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <span className="text-gray-900 dark:text-gray-100">{member.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-700 dark:text-gray-400">{member.email}</TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">{member.country}</TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">{member.institution}</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
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
                              <p className="text-sm text-gray-700 dark:text-gray-400">
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
                                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                ))}
                                <button
                                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                  disabled={currentPage === totalPages}
                                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeminarParticipantsPage;