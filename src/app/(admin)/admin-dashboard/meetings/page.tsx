"use client"
import React, { useState, useEffect } from 'react';
import { createRoom, listRooms, startRoom } from '@/action/meeting';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play, Link2 } from 'lucide-react';

// Room type for type safety
interface MeetingRoom {
  id: number;
  name: string;
  url: string;
  logout_url: string;
  welcome_message: string;
  access_code: string;
  [key: string]: any;
}

const AdminMeetingsPage = () => {
  const { data: session } = useSession();
  const token = `NdoagJUETZLuQsXdkzmVIFvgRG5DYdCYf7qFeReg`;
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    logout_url: '',
    access_code: '',
    welcome_message: '',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRooms = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await listRooms(token);
      setRooms(res.data || []);
    } catch (e) {
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setError('');
    setSuccess('');
    try {
      await createRoom(token, form);
      setSuccess('Room created!');
      setForm({ name: '', logout_url: '', access_code: '', welcome_message: '' });
      fetchRooms();
    } catch (e) {
      setError('Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  // Updated handleStart to send full payload
  const handleStart = async (room: MeetingRoom) => {
    if (!token) return;
    setError('');
    setSuccess('');
    try {
      await startRoom(token, {
        id: room.id,
        name: room.name,
        logout_url: room.logout_url,
        message: room.welcome_message || 'Welcome to the meeting',
        started_by: session?.user?.name || 'admin',
        keyword: session?.user?.name || 'admin',
        access_code: room.access_code,
      });
      setSuccess('Room started!');
      fetchRooms();
    } catch (e) {
      setError('Failed to start room');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plus className="w-6 h-6 text-[#203A87]" /> Create New Meeting Room
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleCreate}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Room Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full focus:ring-2 focus:ring-[#203A87]" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Logout URL</label>
              <input name="logout_url" value={form.logout_url} onChange={handleChange} className="border p-2 rounded w-full focus:ring-2 focus:ring-[#203A87]" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Access Code</label>
              <input name="access_code" value={form.access_code} onChange={handleChange} className="border p-2 rounded w-full focus:ring-2 focus:ring-[#203A87]" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Welcome Message</label>
              <input name="welcome_message" value={form.welcome_message} onChange={handleChange} className="border p-2 rounded w-full focus:ring-2 focus:ring-[#203A87]" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 pt-0">
            <Button type="submit" className="mt-2" disabled={creating}>
              {creating ? 'Creating...' : 'Create Room'}
            </Button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {success && <div className="text-green-600 mt-2">{success}</div>}
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Meeting Rooms</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading rooms...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-[#203A87]">{room.name}</td>
                    <td className="px-6 py-4">{room.access_code || ''}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button size="sm" onClick={() => handleStart(room)} variant="secondary" className="flex items-center gap-1">
                        <Play className="w-4 h-4" /> Start
                      </Button>
                      <a href={`https://konn3ct.com/room/${room.url}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Link2 className="w-4 h-4" /> Open
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMeetingsPage; 