// src/utils/api.ts
import { Conference, ConferenceResponse, AnnouncementResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = (token: string | undefined) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const fetchConferences = async (token: string | undefined): Promise<Conference[]> => {
  const response = await fetch(`${API_URL}/landing/events`, {
    headers: getAuthHeader(token)
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conferences');
  }
  
  const data: ConferenceResponse = await response.json();
  return data.data;
};

export const fetchConferenceAnnouncements = async (
  conferenceId: number, 
  token: string | undefined
): Promise<AnnouncementResponse['data']> => {
  const response = await fetch(`${API_URL}/announcements/conference/${conferenceId}`, {
    headers: getAuthHeader(token)
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch announcements');
  }
  
  const data: AnnouncementResponse = await response.json();
  return data.data;
};