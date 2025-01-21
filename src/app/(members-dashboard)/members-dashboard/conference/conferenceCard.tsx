import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

interface Conference {
  id: string; // or `number`, depending on your data
  title: string;
  date: string;
  venue: string;
}
interface ConferenceCardProps {
  conference: Conference;
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
  return (
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
      <Link 
        href={`/conferences/${conference.id}`}
        className="block bg-[#203a87] text-center text-white px-6 py-2 rounded-full hover:bg-[#162a61] transition-colors w-full"
      >
        View Details
      </Link>
    </div>
  );
}
