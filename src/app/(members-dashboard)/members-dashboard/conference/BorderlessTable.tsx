import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/modules/ui/table';

const BorderlessTable = () => {
  return (
    <div className="w-full overflow-x-auto text-black">
      <Table className="min-w-[800px] text-black"> {/* Adjust min-w-[800px] as needed */}
        <TableHeader>
          <TableRow>
            <TableHead>Activities</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Facilitator</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Morning Yoga</TableCell>
            <TableCell>6:00 AM - 7:00 AM</TableCell>
            <TableCell>Central Park</TableCell>
            <TableCell>Sarah Johnson</TableCell>
            <TableCell>September 10, 2024</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Business Workshop</TableCell>
            <TableCell>10:00 AM - 12:00 PM</TableCell>
            <TableCell>Hall A</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>September 11, 2024</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Lunch Networking</TableCell>
            <TableCell>12:30 PM - 2:00 PM</TableCell>
            <TableCell>Dining Room</TableCell>
            <TableCell>Emma Brown</TableCell>
            <TableCell>September 11, 2024</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tech Seminar</TableCell>
            <TableCell>3:00 PM - 5:00 PM</TableCell>
            <TableCell>Conference Room B</TableCell>
            <TableCell>David Lee</TableCell>
            <TableCell>September 12, 2024</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default BorderlessTable;
