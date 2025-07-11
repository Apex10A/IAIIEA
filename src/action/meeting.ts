import { CallsWithBearer } from './axios';

const BASE_URL = 'https://konn3ct.com/api';

// Create a new meeting room
export async function createRoom(token: string, data: {
  name: string;
  logout_url: string;
  access_code: string;
  welcome_message: string;
}) {
  const api = CallsWithBearer(BASE_URL, token);
  const res = await api.post('/create-room', data);
  return res.data;
}

// List all meeting rooms
export async function listRooms(token: string) {
  const api = CallsWithBearer(BASE_URL, token);
  const res = await api.get('/list-rooms');
  return res.data;
}

// Start a meeting room
export async function startRoom(token: string, data: { id: number; access_code: string; }) {
  const api = CallsWithBearer(BASE_URL, token);
  const res = await api.post('/start-room', data);
  return res.data;
}

// Join a meeting room
export async function joinRoom(token: string, data: {
  id: number;
  name: string;
  email: string;
  role: string;
  access_code: string;
}) {
  const api = CallsWithBearer(BASE_URL, token);
  const res = await api.post('/join-room', data);
  return res.data;
} 