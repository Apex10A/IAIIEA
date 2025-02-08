"use client";
import React, { useState, useEffect } from 'react';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Conference {
    id: number;
    title: string;
    theme: string;
    venue: string;
    date: string;
    status: 'Ongoing' | 'Incoming' | 'Completed';
    resources: any[];
}

interface ApiResponse {
    status: string;
    message: string;
    data: Conference[];
}

const RelatedConferences = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch conferences');
                }

                const { status, data }: ApiResponse = await response.json();
                
                if (status === "success") {
                    // Filter for only Incoming and Ongoing conferences and limit to 3
                    const activeConferences = data
                        .filter(conference => 
                            conference.status === 'Incoming' || 
                            conference.status === 'Ongoing'
                        )
                        .sort((a, b) => {
                            const dateA = new Date(a.date.split(' To ')[0]);
                            const dateB = new Date(b.date.split(' To ')[0]);
                            return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 3);
                    
                    setConferences(activeConferences);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchConferences();
    }, []);

    const formatDate = (dateString: string) => {
        const [startDate] = dateString.split(' To ');
        return startDate;
    };

    const getStatusColor = (status: Conference['status']) => {
        return status === 'Ongoing' ? 'text-green-600' : 'text-blue-600';
    };

    if (isLoading) {
        return (
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Upcoming Conferences</h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upcoming Conferences</h2>
            {conferences.length > 0 ? (
                <div className="space-y-4">
                    {conferences.map((conference) => (
                        <div
                            key={conference.id}
                            onClick={() => router.push(`/conferences/${conference.id}`)}
                            className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-sm line-clamp-1">
                                    {conference.title}
                                </h3>
                                <span className={`text-xs font-medium ${getStatusColor(conference.status)}`}>
                                    {conference.status}
                                </span>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex items-center text-gray-500 text-xs">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    {formatDate(conference.date)}
                                </div>
                                
                                <div className="flex items-center text-gray-500 text-xs">
                                    <MapPinIcon className="w-3 h-3 mr-1" />
                                    {conference.venue || 'Venue TBA'}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button
                        onClick={() => router.push('/conferences')}
                        className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View All Conferences
                    </button>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No upcoming conferences</p>
            )}
        </div>
    );
};

export default RelatedConferences;