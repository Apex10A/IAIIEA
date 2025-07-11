import React, { useState, useEffect } from 'react';
import { listRooms, joinRoom } from '@/action/meeting';
import { useSession } from 'next-auth/react';

const MemberMeetingsPage = () => {
  const { data: session } = useSession();
  const token = session?.user?.token || session?.user?.userData?.token;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessCodes, setAccessCodes] = useState({});
  const [joining, setJoining] = useState({});
  const [error, setError] = useState('');

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

  const handleAccessCodeChange = (id, value) => {
    setAccessCodes({ ...accessCodes, [id]: value });
  };

  const handleJoin = async (room) => {
    if (!token) return;
    setJoining({ ...joining, [room.id]: true });
    setError('');
    try {
      const res = await joinRoom(token, {
        id: room.id,
        name: session.user.name,
        email: session.user.email,
        role: 'participant',
        access_code: accessCodes[room.id] || '',
      });
      if (res.data) {
        window.open(res.data, '_blank');
      } else {
        setError('Failed to join room');
      }
    } catch (e) {
      setError('Failed to join room');
    } finally {
      setJoining({ ...joining, [room.id]: false });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Join a Meeting</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
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
                <td className="p-2 border">
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={accessCodes[room.id] || ''}
                    onChange={e => handleAccessCodeChange(room.id, e.target.value)}
                    placeholder="Enter access code"
                  />
                </td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => handleJoin(room)}
                    disabled={joining[room.id]}
                  >
                    {joining[room.id] ? 'Joining...' : 'Join'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberMeetingsPage; 