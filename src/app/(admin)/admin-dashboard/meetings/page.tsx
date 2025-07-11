"use client"
import React, { useState, useEffect } from 'react';
import { createRoom, listRooms, startRoom } from '@/action/meeting';
import { useSession } from 'next-auth/react';

const AdminMeetingsPage = () => {
  const { data: session } = useSession();
  const token = session?.user?.token || session?.user?.userData?.token;
  const [rooms, setRooms] = useState([]);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
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

  const handleStart = async (id, access_code) => {
    if (!token) return;
    setError('');
    setSuccess('');
    try {
      await startRoom(token, { id, access_code });
      setSuccess('Room started!');
      fetchRooms();
    } catch (e) {
      setError('Failed to start room');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Meetings</h1>
      <form onSubmit={handleCreate} className="mb-8 space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-medium">Room Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block font-medium">Logout URL</label>
          <input name="logout_url" value={form.logout_url} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block font-medium">Access Code</label>
          <input name="access_code" value={form.access_code} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block font-medium">Welcome Message</label>
          <input name="welcome_message" value={form.welcome_message} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded" disabled={creating}>{creating ? 'Creating...' : 'Create Room'}</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
      <h2 className="text-xl font-semibold mb-4">Rooms</h2>
      {loading ? <div>Loading rooms...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Access Code</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="p-2 border">{room.name}</td>
                <td className="p-2 border">{room.access_code || ''}</td>
                <td className="p-2 border">
                  <button className="bg-green-700 text-white px-3 py-1 rounded mr-2" onClick={() => handleStart(room.id, room.access_code)}>Start</button>
                  <a href={`https://konn3ct.com/room/${room.url}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-3 py-1 rounded">Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMeetingsPage; 