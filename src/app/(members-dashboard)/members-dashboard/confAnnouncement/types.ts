// src/types/conference.ts
export interface Conference {
    id: number;
    title: string;
    theme: string;
    venue: string;
    date: string;
    status: 'Incoming' | 'Completed';
    resources: any[];
  }
  
  export interface Announcement {
    id: number;
    time: string;
    title: string;
    description: string;
    file: string | null;
    link: string;
  }
  
  export interface AnnouncementResponse {
    status: string;
    message: string;
    data: {
      [date: string]: Announcement[];
    };
  }
  
  export interface ConferenceResponse {
    status: string;
    message: string;
    data: Conference[];
  }