import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface RegistrationMessageProps {
  conferenceTitle: string;
}

const RegistrationMessage: React.FC<RegistrationMessageProps> = ({ 
  conferenceTitle 
}) => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle 
            size={64} 
            className="text-yellow-500 animate-pulse"
          />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-white">
          Registration Required
        </h2>
        
        {session?.user?.name && (
          <p className="text-xl text-gray-300 mb-4">
            Hi, {session.user.name}
          </p>
        )}
        
        <p className="text-gray-300 mb-6">
          You are not registered for the conference: 
          <span className="block text-xl font-semibold text-yellow-400 mt-2">
            {conferenceTitle}
          </span>
          you can pay for the upcoming conferences
        </p>
        
        <div className="space-y-4">
          {/* <button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register Now
          </button> */}
          
          <p className="text-sm text-gray-400">
            Contact support if you believe this is an error
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationMessage;