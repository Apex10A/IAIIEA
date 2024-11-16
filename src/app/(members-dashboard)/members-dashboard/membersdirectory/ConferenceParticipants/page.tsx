"use client"
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/ui/table';

const Page = () => {
  // Sample data for registered members
  const members = [
    { id: 1, name: 'John Doe', role: 'Speaker', email: 'john.doe@example.com', country: 'Nigeria', institution: 'University of Nigeria' },
    { id: 2, name: 'Jane Smith', role: 'Event Speaker', email: 'jane.smith@example.com', country: 'Nigeria', institution: 'University of Nigeria' },
    { id: 3, name: 'Emily Johnson', role: 'Conference Participant', email: 'emily.johnson@example.com', country: 'Nigeria', institution: 'University of Nigeria' },
    { id: 4, name: 'Michael Brown', role: 'Volunteer', email: 'michael.brown@example.com', country: 'Nigeria', institution: 'University of Nigeria' },
    { id: 5, name: 'Sophia Davis', role: 'Workshop Participant', email: 'sophia.davis@example.com', country: 'Nigeria', institution: 'University of Nigeria' },
  ];

  // State to track which member's ':' icon was clicked
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);

  // Toggle the dropdown for edit and delete options
  const handleIconClick = (id: number) => {
    setActiveMemberId((prevId) => (prevId === id ? null : id)); // Toggle open/close of dropdown
  };

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-[24px] md:text-[28px] text-[#0B142F] font-[500] pb-1'>Conference Participants</h1>
        </div>
        
      </div>
      <p className='text-[16px] md:text-[18px] text-[#0B142F]'>See those who have registered  for the conference</p>

      {/* Table for registered members */}
      <div className='mt-6 w-full overflow-x-auto text-black'>
        <Table className='min-w-[800px] text-black'>
          <TableHeader>
            <TableRow>
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
            {members.map((member) => (
              <React.Fragment key={member.id}>
                <TableRow>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.country}</TableCell>
                  <TableCell>{member.institution}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {/* Colon icon acting as the action trigger */}
                    <button
                      onClick={() => handleIconClick(member.id)}
                      className='text-[24px] font-bold cursor-pointer'
                    >
                      :
                    </button>
                  </TableCell>
                </TableRow>

                {/* Show edit/delete options if the icon is clicked */}
                {activeMemberId === member.id && (
                  <div className=" absolute right-0 space-x-4 bg-gray-100 px-7 py-3 rounded shadow-lg border">
                  <div className='flex flex-col items-start '>
                  <div className=''>
                  <button className=" py-2 rounded">Edit</button>
                  </div>
                  <div>
                  <button className=" py-2 rounded text-red-500">Permanently Delete</button>
                  </div>
                  </div>
                </div>
                )}
              </React.Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="text-center">End of List</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default Page;
