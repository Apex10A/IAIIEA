"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/ui/table';
import { PencilIcon, TrashIcon, Search, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMemberModal from "./components/AddMemberModal"
import { showToast } from '@/utils/toast';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useTheme } from 'next-themes';

interface Member {
  user_id: string;
  f_name: string;
  m_name: string;
  l_name: string;
  role?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  whatsapp_no: string;
  area_of_specialization: string;
  profession: string;
  postal_addr: string;
  residential_addr: string;
  type: string;
}

const truncateText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Page = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // States
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const membersPerPage = 8;

  // Session and API
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch members
  const fetchMembers = async () => {
    if (!session || !bearerToken) {
      setError("No authentication token found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/user_list/member`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch members");

      const responseData = await response.json();
      setMembers(responseData.data);
      setFilteredMembers(responseData.data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/admin/delete_user/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          id: userId,
          type: "member",
        }),
      });

      if (response.ok) {
        showToast.success("User deleted successfully!");
        await fetchMembers();
      } else {
        showToast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast.error("An error occurred while deleting user.");
    }
  };



  // Effects
  useEffect(() => {
    fetchMembers();
  }, [session, bearerToken, API_URL]);

  useEffect(() => {
    const filtered = members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [searchTerm, members]);

  // Pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Selection handlers
  const handleMemberSelect = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(currentMembers.map(member => member.user_id));
    }
    setIsAllSelected(!isAllSelected);
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Registered Members
              </h1>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none">
                  <input 
                    type="text" 
                    placeholder="Search members..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <AddMemberModal />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700">
            <Table className="w-full ">
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="w-[50px]">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </TableHead>
                  <TableHead className='text-sm md:text-md'>ID</TableHead>
                  <TableHead className='text-sm md:text-md'>Name</TableHead>
                  <TableHead className='text-sm md:text-md'>Email</TableHead>
                  <TableHead className='text-sm md:text-md'>Country</TableHead>
                  <TableHead className='text-sm md:text-md'>Institution</TableHead>
                  <TableHead className='text-sm md:text-md'>Type</TableHead>
                  <TableHead className='text-sm md:text-md'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMembers.map((member) => (
                  <TableRow 
                    key={member.user_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors "
                    onClick={() => router.push(`/admin-dashboard/membership/${member.user_id}`)}
                  >
                    <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedMembers.includes(member.user_id)}
                        onChange={() => handleMemberSelect(member.user_id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 "
                      />
                    </TableCell>
                    <TableCell className='text-sm md:text-md'>{truncateText(member.user_id, 15)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${member.name}`} 
                          alt={`${member.name}'s avatar`} 
                          className="w-8 h-8 rounded-full text-sm md:text-md"
                        />
                        <span className='text-sm md:text-md'>{truncateText(member.name, 15)}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-sm md:text-md'>{truncateText(member.email, 20)}</TableCell>
                    <TableCell className='text-sm md:text-md'>{member.country || 'Nigeria'}</TableCell>
                    <TableCell className='text-sm md:text-md'>{truncateText(member.institution, 15)}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-sm md:text-md font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {member.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        
                        <AlertDialog.Root>
                          <AlertDialog.Trigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <TrashIcon className="w-4 h-4 text-sm md:text-md" />
                            </button>
                          </AlertDialog.Trigger>
                          <AlertDialog.Portal>
                            <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                            <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
                              <AlertDialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                                Delete User
                              </AlertDialog.Title>
                              <AlertDialog.Description className="mt-3 text-gray-600 dark:text-gray-300">
                                Are you sure you want to delete this user? This action cannot be undone.
                              </AlertDialog.Description>
                              <div className="mt-6 flex justify-end gap-4">
                                <AlertDialog.Cancel asChild>
                                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 text-white rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    Cancel
                                  </button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                  <button
                                    onClick={() => handleDelete(member.user_id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </AlertDialog.Action>
                              </div>
                            </AlertDialog.Content>
                          </AlertDialog.Portal>
                        </AlertDialog.Root>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Page;