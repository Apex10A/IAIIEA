import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, X } from 'lucide-react';
import Spinner from "@/app/spinner";

interface Schedule {
  schedule_id: string;
  day: string;
  activity: string;
  facilitator: string;
  venue: string;
}

interface Meal {
  meal_id: string;
  name: string;
  image?: string;
}

interface Conference {
  id: string;
  title: string;
  date: string;
  venue: string;
  theme?: string;
}

interface ConferenceDetails extends Conference {
  is_registered: boolean;
  theme: string;
  schedule: Schedule[];
  meals: Meal[];
}
interface ConferenceCardProps {
  conference: Conference;
  onViewDetails: (id: string) => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
  </div>
);

const SkeletonDetails: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
    </div>
    
    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
    
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const ConferenceCard: React.FC<ConferenceCardProps> = ({ conference, onViewDetails }) => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <h2 className="text-xl font-semibold text-[#0B142F]">{conference.title}</h2>
    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5 text-gray-600" />
      <p className="text-gray-600">{conference.date}</p>
    </div>
    <div className="flex items-start gap-2">
      <MapPin className="w-5 h-5 text-gray-600" />
      <p className="text-gray-600">{conference.venue}</p>
    </div>
    <button
      onClick={() => onViewDetails(conference.id)}
      className="bg-[#203a87] text-white px-6 py-2 rounded-full hover:bg-[#162a61] transition-colors w-full"
    >
      View Details
    </button>
  </div>
);

const ScheduleTable: React.FC<{ schedules: Schedule[] }> = ({ schedules }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left">Day</th>
          <th className="px-4 py-2 text-left">Activity</th>
          <th className="px-4 py-2 text-left">Facilitator</th>
          <th className="px-4 py-2 text-left">Venue</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => (
          <tr key={schedule.schedule_id} className="border-b">
            <td className="px-4 py-2">{schedule.day}</td>
            <td className="px-4 py-2">{schedule.activity}</td>
            <td className="px-4 py-2">{schedule.facilitator}</td>
            <td className="px-4 py-2">{schedule.venue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MealsSection: React.FC<{ meals: Meal[] }> = ({ meals }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {meals.map((meal) => (
      <div key={meal.meal_id} className="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={meal.image || "/api/placeholder/300/200"}
          alt={meal.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{meal.name}</h3>
        </div>
      </div>
    ))}
  </div>
);

const ConferenceDetails: React.FC<{ 
  conference: ConferenceDetails;
  onClose: () => void;
}> = ({ conference, onClose }) => {
  if (!conference.is_registered) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">You must be registered for this conference to view its details.</p>
        <button
          onClick={onClose}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Conferences
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold text-[#0B142F]">{conference.title}</h1>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <p className="text-xl text-[#0B142F] mb-6">{conference.theme}</p>
      
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <p className="text-gray-600">{conference.date}</p>
      </div>
      
      <div className="flex items-start gap-2 mb-6">
        <MapPin className="w-5 h-5 text-gray-600" />
        <p className="text-gray-600">{conference.venue}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Daily Conference Schedule</h2>
      <ScheduleTable schedules={conference.schedule} />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Available Meals</h2>
      <MealsSection meals={conference.meals} />
    </div>
  );
};

const ConferenceDashboard: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<ConferenceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://iaiiea.org/api/sandbox/landing/events');
      const data = await response.json();
      setConferences(data.data || []);
    } catch (error) {
      console.error('Error fetching conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConferenceDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(`https://iaiiea.org/api/sandbox/landing/event_details/${id}`);
      const data = await response.json();
      setSelectedConference(data.data);
    } catch (error) {
      console.error('Error fetching conference details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-gray-200 px-5 py-3">
        <h1 className="text-2xl text-[#0B142F]">Conference Portal</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : selectedConference ? (
        detailsLoading ? (
          <SkeletonDetails />
        ) : (
          <ConferenceDetails 
            conference={selectedConference} 
            onClose={() => setSelectedConference(null)} 
          />
        )
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Available Conferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conferences.map((conference) => (
              <ConferenceCard 
                key={conference.id} 
                conference={conference}
                onViewDetails={() => fetchConferenceDetails(conference.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceDashboard;