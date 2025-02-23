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
import { PencilIcon, TrashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMemberModal from "./AddMemberModal"
import { showToast } from '@/utils/toast';
import { Trash2 } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// Define the type for member data
interface Member {
  id: number;
  name: string;
  type: string;
  email: string;
  country: string;
  institution: string;
}

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Page = () => {
    // Dropdown animation variants
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
  
    // Mobile menu animation variants
    const mobileMenuVariants = {
      hidden: { 
        height: 0,
        opacity: 0
      },
      visible: { 
        height: 'auto',
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      },
      exit: { 
        height: 0,
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: "easeInOut"
        }
      }
    };
  // State for members and loading/error handling
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown and modal states
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Member>>({});

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 8;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Get session and API URL from environment
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch members function
const fetchMembers = async () => {
  if (!session || !bearerToken) {
    setError("No authentication token found");
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/user_list/member`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch members");
    }

    const responseData = await response.json();
    const membersData = responseData.data;

    setMembers(membersData);
    setFilteredMembers(membersData);
  } catch (err) {
    console.error("Error fetching members:", err);
    setError(err instanceof Error ? err.message : "An unknown error occurred");
  } finally {
    setIsLoading(false);
  }
};

// Fetch members on component mount or when dependencies change
useEffect(() => {
  fetchMembers();
}, [session, bearerToken, API_URL]);

// Search functionality
useEffect(() => {
  const filtered = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredMembers(filtered);
  setCurrentPage(1); // Reset to first page when search results change
}, [searchTerm, members]);

// Delete user function
const handleDelete = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_user/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        id: userId, // Changed from `news_id` to `id`
        type: "member", // Assuming it's always "member"; modify if dynamic
      }),
    });

    const result = await response.json();
    if (response.ok) {
      showToast.success("User deleted successfully!");
      await fetchMembers(); // Now it can be called directly
    } else {
      showToast.error("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    showToast.error("An error occurred while deleting user.");
  }
};



  // Edit member handler
  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bearerToken) {
      setError('No authentication token found');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/edit_user_info/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentMember?.id,
          ...editFormData
        })
      });
      if (!response.ok) {
        showToast.error('Failed to update member');
        throw new Error('Failed to update member');
      }
      // Show success message
    showToast.success('Member updated successfully!');
      

      // Update local state
      const updatedMembers = members.map(member => 
        member.id === currentMember?.id 
          ? { ...member, ...editFormData } 
          : member
      );

      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);

      // Close modal and reset states
      setIsEditModalOpen(false);
      setCurrentMember(null);
      setEditFormData({});
    } catch (err) {
      console.error('Error updating member:', err);
      showToast.error('Failed to update member');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Open edit modal
  const openEditModal = (member: Member) => {
    setCurrentMember(member);
    setEditFormData({
      name: member.name,
      email: member.email,
      type: member.type,
      institution: member.institution,
      country: member.country
    });
    setIsEditModalOpen(true);
  };

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  // Pagination change handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Member selection handlers
  const handleMemberSelect = (memberId: number) => {
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
      setSelectedMembers(currentMembers.map(member => member.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p>Loading members...</p>
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
        <p>No members found</p>
      </div>
    );
  }

  // Edit Member Modal Component (added)
  const EditMemberModal = () => {
    if (!isEditModalOpen || !currentMember) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white px-10 py-10 rounded-lg w-[30%]">
          <h2 className="text-xl font-bold mb-4">Edit Member</h2>
          <form onSubmit={handleEditMember}>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
            <label className="block mb-2">Country</label>
              <input
                type="text"
                value={editFormData.country || ''}
                onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                className="w-full border rounded p-2"
                required
              />

            </div>
            <div className="mb-4">
              <label className="block mb-2">Institution</label>
              <input
                type="text"
                value={editFormData.institution || ''}
                onChange={(e) => setEditFormData({...editFormData, institution: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Role</label>
              <input
                type="text"
                value={editFormData.type || ''}
                onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-[#203a87] text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className=''>
    <div className='lg:flex items-center justify-between mb-4'>
      <div>
        <h1 className='text-[20px] md:text-[28px] text-[#0B142F] font-[500] pb-1'>Registered Members</h1>
      </div>
      <div className='flex items-center space-x-4 w-full'>
        <input 
          type="text" 
          placeholder="Search members..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border text-sm sm:text-base rounded-md"
        />
        <AddMemberModal/>
      </div>
    </div>

    <div className='mt-6 w-full overflow-x-auto text-black'>
      <Table className='min-w-[1200px] text-black'>
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
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMembers.map((member) => (
              <React.Fragment key={member.id}>
                <TableRow
                className="relative" 
      onClick={() => {
        // Toggle dropdown or close if already open
        setActiveDropdownId(activeDropdownId === member.id ? null : member.id);
      }}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberSelect(member.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </TableCell>
                  <TableCell className='text-slate-600 text-sm sm:text-base'>{member.id}</TableCell>
                  <TableCell className="flex items-center space-x-2 text-slate-600">
                    <img 
                      src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${member.name}`} 
                      alt={`${member.name}'s avatar`} 
                      className="w-10 h-10 rounded-full mr-2"
                    />
                   <span className='text-sm sm:text-base'> {truncateText(member.name, 15)}</span>
                  </TableCell>
                  <TableCell className='text-slate-600 text-sm sm:text-base'>{truncateText(member.email, 20)}</TableCell>
                  <TableCell className='text-slate-600 text-sm sm:text-base'>Nigeria</TableCell>
                  <TableCell className='text-slate-600 text-sm sm:text-base'>{truncateText(member.institution, 15)}</TableCell>
                  <TableCell className='text-slate-600 text-sm sm:text-base'>{member.type}</TableCell>
<TableCell>
        <button
          className='text-[24px] font-bold cursor-pointer relative z-10'
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click event
            setActiveDropdownId(activeDropdownId === member.id ? null : member.id);
          }}
        >
          :
        </button>
      </TableCell>
                </TableRow>
<AnimatePresence>
                {/* Dropdown for edit/delete */}
                {activeDropdownId === member.id && (
      <motion.div 
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit" className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="py-1">
        <button 
  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
  onClick={(e) => {
    e.stopPropagation();
    openEditModal(member); // Pass the current member
  }}
>
  <PencilIcon className="w-4 h-4 text-gray-600" />
  <span>Edit</span>
</button>
<AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    <button  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
      <Trash2 className="w-4 h-4" />
      <span>Delete</span>
    </button>
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
    <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
      <AlertDialog.Title className="text-lg font-semibold">
        Delete User
      </AlertDialog.Title>
      <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
        Are you sure you want to delete this user? This action cannot be undone.
      </AlertDialog.Description>
      <div className="flex justify-end gap-4">
        <AlertDialog.Cancel asChild>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <button 
           onClick={() => handleDelete(member.id.toString())}  // Pass the correct `userId`
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
      </motion.div>
    )}
    </AnimatePresence>
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
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === index + 1 
                          ? 'bg-[#fef08a] text-black' 
                          : 'border-2 border-[#fef08a] bg-transparent text-black'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
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

    {/* Conditionally render the EditMemberModal */}
    {isEditModalOpen && <EditMemberModal />}
  </div>
  );
};

export default Page;