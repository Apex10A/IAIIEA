"use client"
import React from 'react';
import { useSession } from "next-auth/react";
import { Card, CardContent } from '@/components/ui/card';
import { LockIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { redirect } from 'next/navigation';

interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  // ... other conference details as needed
}

interface PortalAccessWrapperProps {
  portalType: 'membership' | 'conference' | 'webinar' | string;
  children: React.ReactNode;
  conferenceDetails?: ConferenceDetails | null; // Optional for conference portal
}

const PortalAccessWrapper: React.FC<PortalAccessWrapperProps> = ({ 
  portalType, 
  children,
  conferenceDetails 
}) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    }
  });

  const getPortalName = () => {
    const names = {
      membership: 'Membership Portal',
      conference: 'Conference Portal',
      webinar: 'Webinar Portal'
    };
    
    return names[portalType as keyof typeof names] || portalType;
  };

  // Loading state
  if (status === 'loading' || (portalType === 'conference' && conferenceDetails === undefined)) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>Loading access information...</p>
        </CardContent>
      </Card>
    );
  }

  // Check access based on portal type
  const checkAccess = () => {
    switch (portalType) {
      case 'membership':
        return session?.user?.userData?.registration === 'complete';
      
      case 'conference':
        return conferenceDetails?.is_registered || false;
      
      case 'webinar':
        return session?.user?.userData?.registration === 'complete';
      
      default:
        return false;
    }
  };

  const handlePurchaseAccess = () => {
    switch (portalType) {
      case 'membership':
        window.location.href = '/payment';
        break;
      
      case 'conference':
        if (conferenceDetails) {
          window.location.href = `/payment/conference/${conferenceDetails.id}`;
        }
        break;
      
      case 'webinar':
        window.location.href = '/payment';
        break;
      
      default:
        window.location.href = '/payment';
    }
  };

  // Get appropriate message based on portal type
  const getAccessMessage = () => {
    switch (portalType) {
      case 'membership':
        return {
          title: 'Membership Access Required',
          message: 'Please complete registration for the Membership Portal to view this content.',
          action: 'Complete Registration'
        };
      
      case 'conference':
        return {
          title: 'Conference Access Required',
          message: conferenceDetails 
            ? `You need to complete payment for ${conferenceDetails.title} to access this content.`
            : 'Conference registration required to access this content.',
          action: 'Make Conference Payment'
        };
      
      case 'webinar':
        return {
          title: 'Webinar Access Required',
          message: 'Please complete registration for the Webinar Portal to view this content.',
          action: 'Complete Registration'
        };
      
      default:
        return {
          title: 'Access Required',
          message: 'Please complete registration to view this content.',
          action: 'Complete Registration'
        };
    }
  };

  // No access state
  if (!checkAccess()) {
    const accessMessage = getAccessMessage();
    
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <Alert variant="error">
            <LockIcon className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-bold">{accessMessage.title}</h3>
                <p>{accessMessage.message}</p>
                <p>Visit the payment section to complete your registration.</p>
              </div>
            </AlertDescription>
          </Alert>
          <button 
            onClick={handlePurchaseAccess}
            className="w-full bg-primary text-primary-foreground p-2 rounded"
          >
            {accessMessage.action}
          </button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default PortalAccessWrapper;