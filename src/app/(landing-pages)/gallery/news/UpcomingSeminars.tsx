"use client";
import React, { useState, useEffect } from 'react';
import { Badge } from '@/modules/ui/badge';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Seminar {
    id: number;
    title: string;
    theme: string;
    venue: string;
    date: string;
    status: 'Ongoing' | 'Incoming' | 'Completed';
}

interface ApiResponse {
    status: string;
    message: string;
    data: Seminar[];
}

const RelatedSeminars = () => {
    const [seminars, setSeminars] = useState<Seminar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSeminars = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch seminars');
                }

                const { status, data }: ApiResponse = await response.json();
                
                if (status === "success") {
                    // Filter for only Incoming and Ongoing seminars and limit to 3
                    const activeSeminars = data
                        .filter(seminar => 
                            seminar.status === 'Incoming' || 
                            seminar.status === 'Ongoing'
                        )
                        .sort((a, b) => {
                            const dateA = new Date(a.date.split(' To ')[0]);
                            const dateB = new Date(b.date.split(' To ')[0]);
                            return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 3);
                    
                    setSeminars(activeSeminars);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeminars();
    }, []);

    const formatDate = (dateString: string) => {
        const [startDate] = dateString.split(' To ');
        return startDate;
    };

    const getStatusColor = (status: Seminar['status']) => {
        return status === 'Ongoing' ? 'text-green-600' : 'text-blue-600';
    };

    if (isLoading) {
        return (
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Upcoming Seminars</h2>
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
            <h2 className="text-xl font-semibold mb-4">Active Seminars</h2>
            {seminars.length > 0 ? (
                <div className="space-y-4">
                    {seminars.map((seminar) => (
                        <div
                            key={seminar.id}
                            onClick={() => router.push(`/seminars/${seminar.id}`)}
                            className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-sm line-clamp-1">
                                    {seminar.title}
                                </h3>
                                <span className={`text-xs font-medium ${getStatusColor(seminar.status)}`}>
                                    {seminar.status}
                                </span>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex items-center text-gray-500 text-xs">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    {formatDate(seminar.date)}
                                </div>
                                
                                <div className="flex items-center text-gray-500 text-xs">
                                    <MapPinIcon className="w-3 h-3 mr-1" />
                                    {seminar.venue || 'Venue TBA'}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button
                        onClick={() => router.push('/seminars')}
                        className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View All Seminars
                    </button>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No upcoming seminars</p>
            )}
        </div>
    );
};

export default RelatedSeminars;