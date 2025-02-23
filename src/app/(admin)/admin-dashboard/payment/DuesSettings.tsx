import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/modules/ui/card';
import { showToast } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table';

// Interface for dues data
interface DuesData {
  annual_dues_usd: number;
  annual_dues_naira: number;
  vetting_fee_usd: number;
  vetting_fee_naira: number;
  publication_fee_usd: number;
  publication_fee_naira: number;
  individual_membership_fee_usd: number;
  individual_membership_fee_naira: number;
  institution_membership_fee_usd: number;
  institution_membership_fee_naira: number;
}

const DuesSettings: React.FC = () => {
  // Session hook for authorization
  const { data: session, status } = useSession();

  // State for managing dues data
  const [duesData, setDuesData] = useState<DuesData | null>(null);
  
  // State for managing loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for selected currency
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  // Utility function to format currency
  const formatCurrency = (amount: number, currencyCode: 'USD' | 'NGN') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch dues data
  useEffect(() => {
    const fetchDuesData = async () => {
      // Check if session and token are available
      if (status !== 'authenticated' || !session?.user) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/admin/dues_list`, {
          headers: {
            // Assuming Bearer token authentication
            'Authorization': `Bearer ${bearerToken}` // Adjust based on your actual token storage
          }
        });
        
        if (response.data.status === 'success') {
          setDuesData(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to fetch dues data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setDuesData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDuesData();
  }, [session, status]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading dues information...</p>
      </div>
    );
  }

  // Render authentication error
  if (status === 'unauthenticated' || error === 'Not authenticated') {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Please log in to view dues information.</p>
      </div>
    );
  }

  // Render other error states
  if (error || !duesData) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error || 'Unable to load dues information'}</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Membership & Dues Information</CardTitle>
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded ${
                  currency === 'USD' 
                    ? 'bg-[#203a87] text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setCurrency('USD')}
              >
                USD
              </button>
              <button 
                className={`px-4 py-2 rounded ${
                  currency === 'NGN' 
                    ? 'bg-[#203a87] text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setCurrency('NGN')}
              >
                NGN
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="membership">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="membership">Membership Fees</TabsTrigger>
              <TabsTrigger value="additional">Additional Fees</TabsTrigger>
            </TabsList>
            <TabsContent value="membership">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Individual Membership</TableCell>
                    <TableCell className="text-right">
                      {currency === 'USD'
                        ? formatCurrency(duesData.individual_membership_fee_usd, 'USD')
                        : formatCurrency(duesData.individual_membership_fee_naira, 'NGN')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Institutional Membership</TableCell>
                    <TableCell className="text-right">
                      {currency === 'USD'
                        ? formatCurrency(duesData.institution_membership_fee_usd, 'USD')
                        : formatCurrency(duesData.institution_membership_fee_naira, 'NGN')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="additional">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Annual Dues</TableCell>
                    <TableCell className="text-right">
                      {currency === 'USD'
                        ? formatCurrency(duesData.annual_dues_usd, 'USD')
                        : formatCurrency(duesData.annual_dues_naira, 'NGN')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vetting Fee</TableCell>
                    <TableCell className="text-right">
                      {currency === 'USD'
                        ? formatCurrency(duesData.vetting_fee_usd, 'USD')
                        : formatCurrency(duesData.vetting_fee_naira, 'NGN')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Publication Fee</TableCell>
                    <TableCell className="text-right">
                      {currency === 'USD'
                        ? formatCurrency(duesData.publication_fee_usd, 'USD')
                        : formatCurrency(duesData.publication_fee_naira, 'NGN')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DuesSettings;