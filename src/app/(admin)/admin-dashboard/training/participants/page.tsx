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
import { ChevronLeft } from "lucide-react"; // Import back arrow icon

// Types
interface Conference {
  date: string;
  theme: string;
  status: string;
  id: number;
  title: string;
  description: string;
  year: string;
  is_registered: boolean;
}

interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  country: string;
  institution: string;
}

const ConferenceParticipantsPage = () => {
  // States for conferences
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] =
    useState<Conference | null>(null);

  // States from previous implementation
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);

  const membersPerPage = 8;

  // Get session and API URL
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch conferences
  useEffect(() => {
    const fetchConferences = async () => {
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

        if (!response.ok) throw new Error("Failed to fetch conferences");

        const data = await response.json();
        setConferences(data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching conferences:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchConferences();
  }, [bearerToken, API_URL]);

  // Fetch conference details and participants when a conference is selected
  useEffect(() => {
    const fetchConferenceParticipants = async () => {
      if (!selectedConference || !bearerToken) return;

      setIsLoading(true);
      try {
        // Fetch conference details first
        const detailsResponse = await fetch(
          `${API_URL}/landing/seminar_details/${selectedConference.id}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!detailsResponse.ok)
          throw new Error("Failed to fetch conference details");

        // Then fetch participants for this conference
        const participantsResponse = await fetch(
          `${API_URL}/admin/user_list/conference_member/${selectedConference.id}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!participantsResponse.ok)
          throw new Error("Failed to fetch participants");

        const participantsData = await participantsResponse.json();
        setMembers(participantsData.data);
        setFilteredMembers(participantsData.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching conference data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
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
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go back to conference list view
  const handleBackToConferences = () => {
    setSelectedConference(null);
    setMembers([]);
    setFilteredMembers([]);
    setSelectedMembers([]);
    setSearchTerm("");
  };

  // Selection handlers
  const handleMemberSelect = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  // Function to get background color based on index
  const getBgColor = (index: number) => {
    const colors = ["bg-blue-50", "bg-amber-50", "bg-emerald-50"];
    return colors[index % colors.length];
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(currentMembers.map((member) => member.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-5 py-3 mb-6 mt-10">
      <div className="flex flex-col space-y-6">
        {/* Page header - always visible */}
        <div className="bg-gray-200 px-4 sm:px-5 py-3 mb-6 mt-10 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl">
            {selectedConference 
              ? `${selectedConference.title} - Participants` 
              : "Conference Participants"}
          </h1>
          {selectedConference && (
            <button
              onClick={handleBackToConferences}
              className="flex items-center bg-[#203A87] px-4 py-2 rounded-lg text-white hover:bg-[#152a61] transition-colors duration-300"
            >
              <ChevronLeft className="mr-1" size={18} />
              Back to Conferences
            </button>
          )}
        </div>

        {/* Conferences List - Only show if no conference is selected */}
        {!selectedConference ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conferences.map((conference, index) => (
              <div
                key={conference.id}
                className={`${getBgColor(
                  index
                )} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
              >
                <div className="relative">
                  <div className="absolute z-20 bottom-5 left-5">
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
                        conference.status === "Completed"
                          ? "bg-[#f2e9c3] text-[#0B142F] hover:bg-[#e9dba3]"
                          : "bg-[#203A87] text-white hover:bg-[#152a61]"
                      }`}
                    >
                      {conference.status}
                    </button>
                  </div>
                  <Image
                    src="/Meeting.png"
                    alt={conference.title}
                    width={600}
                    height={400}
                    className="w-full h-[250px] object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="text-[#0B142F] text-2xl lg:text-4xl font-semibold">
                      {conference.title}
                    </h1>
                    <span className="text-[#203A87] font-bold text-lg">
                      {conference.title.split(" ")[1]}{" "}
                      {/* Extract year from title */}
                    </span>
                  </div>
                  <p className="text-[#0B142F] text-base lg:text-lg font-medium mb-4 line-clamp-2">
                    {conference.theme}
                  </p>
                  <p className="text-gray-600 text-sm lg:text-base font-medium mb-6">
                    {conference.date}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedConference(conference)}
                      className="bg-[#203A87] px-4 py-3 rounded-lg text-white font-medium hover:bg-[#152a61] transition-colors duration-300 flex-grow sm:flex-grow-0"
                    >
                      View Participants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Participants Table - Only show if a conference is selected */
          <div>
            {/* Conference Card Summary */}
            <Card className={`${getBgColor(0)} mb-6`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0B142F]">
                      {selectedConference.title}
                    </h2>
                    <p className="text-[#0B142F] font-medium">
                      {selectedConference.theme}
                    </p>
                    <p className="text-gray-600 mt-2">{selectedConference.date}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      selectedConference.status === "Completed"
                        ? "bg-[#f2e9c3] text-[#0B142F]"
                        : "bg-[#203A87] text-white"
                    }`}>
                      {selectedConference.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl text-[#0B142F] font-medium">
                  Participants ({filteredMembers.length})
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <p>No participants found for this conference</p>
              </div>
            ) : (
              <div>
                <div className="mt-6 w-full overflow-x-auto">
                  <Table className="min-w-[1200px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                        </TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => handleMemberSelect(member.id)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                          </TableCell>
                          <TableCell>{member.id}</TableCell>
                          <TableCell className="flex items-center space-x-2">
                            <img
                              src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${member.name}`}
                              alt={`${member.name}'s avatar`}
                              className="w-10 h-10 rounded-full mr-2"
                            />
                            {member.name}
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>Nigeria</TableCell>
                          <TableCell>{member.institution}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => setActiveMemberId(member.id)}
                              className="text-[24px] font-bold cursor-pointer"
                            >
                              :
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <div className="flex justify-center items-center space-x-2 mt-4">
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-4 py-2 border-2 border-[#fef08a] bg-transparent rounded disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span>
                              Page {currentPage} of {totalPages}
                            </span>
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="px-4 py-2 bg-[#fef08a] rounded disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceParticipantsPage;