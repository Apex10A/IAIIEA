'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Conference, AnnouncementResponse } from './types';
import { fetchConferences, fetchConferenceAnnouncements } from './api';

const ConferencePage = () => {
  const { data: session, status } = useSession();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementResponse['data']>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConferences = async () => {
      try {
        const token = session?.user?.token || session?.user?.userData?.token;
        const data = await fetchConferences(token);
        setConferences(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conferences');
        setLoading(false);
      }
    };

    if (session) {
      loadConferences();
    }
  }, [session]);

  const handleConferenceSelect = async (conference: Conference) => {
    setSelectedConference(conference);
    setLoading(true);
    try {
      const token = session?.user?.token || session?.user?.userData?.token;
      const data = await fetchConferenceAnnouncements(conference.id, token);
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view conference announcements</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Conference Announcements</h1>
        <p className="text-lg text-gray-600">
          Select a conference to view its announcements
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Conference List */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Conferences</h2>
          <div className="space-y-3">
            {conferences.map((conference) => (
              <button
                key={conference.id}
                onClick={() => handleConferenceSelect(conference)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedConference?.id === conference.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-medium text-lg">{conference.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{conference.theme}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{conference.date}</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    conference.status === 'Completed' 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {conference.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Display */}
        <div className="md:col-span-8">
          {selectedConference ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedConference.title}</h2>
                <p className="text-gray-600 mt-2">{selectedConference.theme}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{selectedConference.venue}</p>
                  <p className="mt-1">{selectedConference.date}</p>
                </div>
              </div>
              
              {Object.entries(announcements).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">No announcements available for this conference</p>
                </div>
              ) : (
                Object.entries(announcements).map(([date, dayAnnouncements]) => (
                  <div key={date} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">{date}</h3>
                    {dayAnnouncements.length === 0 ? (
                      <p className="text-gray-500">No announcements for this day</p>
                    ) : (
                      <div className="space-y-4">
                        {dayAnnouncements.map((announcement) => (
                          <div
                            key={announcement.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-medium text-gray-900">
                                {announcement.title}
                              </h4>
                              <span className="text-sm text-gray-500">{announcement.time}</span>
                            </div>
                            <p className="mt-2 text-gray-600">{announcement.description}</p>
                            {announcement.link && (
                              <a
                                href={announcement.link}
                                className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Resource
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-lg">
              <p className="text-gray-500">Select a conference to view its announcements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;