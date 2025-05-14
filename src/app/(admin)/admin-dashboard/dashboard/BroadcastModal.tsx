"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import dynamic from 'next/dynamic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from '@/components/ui/multi-select';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <textarea className="w-full h-32 px-3 py-2 border rounded-md" />
});

import 'react-quill/dist/quill.snow.css';

interface User {
  id: string;
  name: string;
  email: string;
  country: string | null;
  institution: string;
  role: string;
  type: string;
}

const BroadcastMail = () => {
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageToSend, setMessageToSend] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // User type and selection state
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  // Fetch users based on selected type
  const fetchUsers = async (type: string) => {
    if (!type) return;
    
    setIsLoadingUsers(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/${type}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      if (response.data.status === "success" && response.data.data) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUsers([]);
      showToast.error("Failed to fetch users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Handle user type selection change
  useEffect(() => {
    if (selectedUserType) {
      fetchUsers(selectedUserType);
      setSelectedEmails([]); // Reset selected emails when user type changes
    } else {
      setUsers([]);
    }
  }, [selectedUserType]);

  const handleSubmit = async () => {
    if (!organizationEmail || !selectedUserType || selectedEmails.length === 0 || !subject || !messageToSend) {
      showToast.error("Please fill in all required fields and select at least one recipient.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/send_broadcast_mail`,
        {
          organization_email: organizationEmail,
          recipients: selectedEmails.join(','),
          subject,
          message_to_send: messageToSend,
          recipient_type: selectedUserType
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      showToast.success("Broadcast mail sent successfully!");
      // Reset form
      setOrganizationEmail("");
      setSelectedUserType("");
      setSelectedEmails([]);
      setSubject("");
      setMessageToSend("");
    } catch (error) {
      console.error("Error sending broadcast mail:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while sending the mail.";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="bg-[#0E1A3D] hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md">
            <EnvelopeClosedIcon className="w-5 h-5" />
            Send Broadcast Mail
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Broadcast Email
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="organizationEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization's Email Address *
                </label>
                <input
                  id="organizationEmail"
                  type="email"
                  value={organizationEmail}
                  onChange={(e) => setOrganizationEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., contact@yourorg.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Recipient Type *
                </label>
                <Select 
                  value={selectedUserType}
                  onValueChange={setSelectedUserType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference_member">Conference Participants</SelectItem>
                    <SelectItem value="member">Members</SelectItem>
                    <SelectItem value="seminar_member">Seminar Participants</SelectItem>
                    <SelectItem value="speaker">Speakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedUserType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Recipients *
                  </label>
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-gray-500">Loading users...</div>
                  ) : users.length > 0 ? (
                    <MultiSelect
                      options={users.map(user => ({
                        value: user.email,
                        label: `${user.name} (${user.email})`
                      }))}
                      selected={selectedEmails}
                      onChange={setSelectedEmails}
                      placeholder="Select recipients..."
                      className="w-full"
                    />
                  ) : (
                    <div className="p-4 text-center text-gray-500">No users found for this type</div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email subject line"
                />
              </div>

              <div>
                <label htmlFor="messageToSend" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <ReactQuill
                  value={messageToSend}
                  onChange={setMessageToSend}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write your message here..."
                  className="border rounded-md"
                  theme="snow"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedUserType || selectedEmails.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <EnvelopeClosedIcon className="w-4 h-4" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default BroadcastMail;