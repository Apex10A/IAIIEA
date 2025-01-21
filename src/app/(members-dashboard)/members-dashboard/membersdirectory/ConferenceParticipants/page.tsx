"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/ui/table';

// Define the type for member data
interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  country: string;
  institution: string;
}

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Page = () => {
  // State for members and loading/error handling
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 8;

  const renderPagination = () => {
    const pageNumbers = [];
    const displayRange = 2; // Number of pages to show around the current page
  
    // Always show first page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-[#fef08a] text-black' 
              : 'border-2 border-[#fef08a] bg-transparent text-black'
          }`}
        >
          1
        </button>
      );
    }
  
    // Add ellipsis and surrounding pages before current page
    if (currentPage > displayRange + 2) {
      pageNumbers.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }
  
    // Calculate start and end for middle range
    const startPage = Math.max(2, currentPage - displayRange);
    const endPage = Math.min(totalPages - 1, currentPage + displayRange);
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-4 py-2 rounded ${
            currentPage === i 
              ? 'bg-[#fef08a] text-black' 
              : 'border-2 border-[#fef08a] bg-transparent text-black'
          }`}
        >
          {i}
        </button>
      );
    }
  
    // Add ellipsis and pages after current page
    if (currentPage < totalPages - (displayRange + 1)) {
      pageNumbers.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }
  
    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages 
              ? 'bg-[#fef08a] text-black' 
              : 'border-2 border-[#fef08a] bg-transparent text-black'
          }`}
        >
          {totalPages}
        </button>
      );
    }
  
    return pageNumbers;
  };

  // Search and selection states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // State to track which member's ':' icon was clicked
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);

  // Get session and API URL from environment
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      if (!session || !bearerToken) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/user_list/conference_member`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const responseData = await response.json();
        const membersData = responseData.data;

        setMembers(membersData);
        setFilteredMembers(membersData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [session, bearerToken, API_URL]);

  // Search functionality
  useEffect(() => {
    const filtered = members.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1); // Reset to first page when search results change
  }, [searchTerm, members]);

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  // Calculate total pages
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle member selection
  const handleMemberSelect = (memberId: number) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(currentMembers.map(member => member.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p>Loading Conference participants...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className='text-red-500 text-center'>
        <p>Error: {error}</p>
        <p>Please check the console for more details</p>
      </div>
    );
  }

  // Render no members state
  if (filteredMembers.length === 0) {
    return (
      <div className='text-center'>
        <p>No Conference participants found</p>
      </div>
    );
  }

  return (
    <div className=''>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='text-[24px] md:text-[28px] text-[#0B142F] font-[500] pb-1'>Conference Participants</h1>
        </div>
        <div className='flex items-center space-x-4'>
          {/* Search Input */}
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          {/* <button className='bg-[#203a87] font-semibold text-white px-5 py-3 rounded-lg text-[17px]'>
            Add Members
          </button> */}
        </div>
      </div>

      {/* Table for registered members */}
      <div className='mt-6 w-full overflow-x-auto text-black'>
        <Table className='min-w-[800px] text-black'>
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
              <React.Fragment key={member.id}>
                <TableRow>
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
                    {truncateText(member.name, 15)}
                  </TableCell>
                  <TableCell>{truncateText(member.email, 20)}</TableCell>
                  <TableCell>Nigeria</TableCell>
                  <TableCell>{truncateText(member.institution, 15)}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => setActiveMemberId(member.id)}
                      className='text-[24px] font-bold cursor-pointer'
                    >
                      :
                    </button>
                  </TableCell>
                </TableRow>

                {/* Dropdown for edit/delete */}
                {activeMemberId === member.id && (
                  <div className="absolute right-0 space-x-4 bg-gray-100 px-7 py-3 rounded shadow-lg border">
                    <div className='flex flex-col items-start'>
                      <button className="py-2 rounded">Edit</button>
                      <button 
                        className="py-2 rounded text-red-500"
                      >
                        Permanently Delete
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                {/* Pagination Controls */}
                <div className="flex justify-center items-center space-x-2 mt-4">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-4 py-2 border-2 border-[#fef08a] bg-transparent text-black rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {renderPagination()}
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#fef08a] text-black rounded disabled:opacity-50"
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
  );
};

export default Page;