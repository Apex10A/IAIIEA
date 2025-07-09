import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/modules/ui/card';
import { showToast } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table';
import { Button } from '@/modules/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/modules/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save } from 'lucide-react';

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

interface UserData {
  token?: string;
  userData?: {
    token?: string;
  };
}

const DuesSettings: React.FC = () => {
  const { data: session, status } = useSession();
  const [duesData, setDuesData] = useState<DuesData | null>(null);
  const [editData, setEditData] = useState<DuesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  const formatCurrency = (amount: number, currencyCode: 'USD' | 'NGN') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = (session?.user as UserData)?.token || (session?.user as UserData)?.userData?.token;

  const fetchDuesData = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/admin/dues_list`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      if (response.data.status === 'success') {
        setDuesData(response.data.data);
        setEditData(response.data.data);
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

  useEffect(() => {
    fetchDuesData();
  }, [session, status]);

  const handleInputChange = (field: keyof DuesData, value: string) => {
    if (!editData) return;
    
    const numValue = parseFloat(value) || 0;
    setEditData({
      ...editData,
      [field]: numValue
    });
  };

  const handleUpdateDues = async () => {
    if (!editData || !bearerToken) return;
    
    setIsUpdating(true);
    try {
      const response = await axios.post(`${API_URL}/admin/dues_update`, editData, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'success') {
        showToast.success('Dues information updated successfully');
        setDuesData(editData);
        setIsDialogOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to update dues information');
      }
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'An error occurred while updating dues');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary text-black dark:text-white"></div>
        <p className="text-muted-foreground ml-3 text-black dark:text-white">Loading dues information...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || error === 'Not authenticated') {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Please log in to view dues information.</p>
      </div>
    );
  }

  if (error || !duesData) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Error: {error || 'Unable to load dues information'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl font-semibold text-foreground dark:text-white text-gray-900">
              Membership & Dues Information
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={currency === 'USD' ? 'default' : 'outline'}
                onClick={() => setCurrency('USD')}
                size="sm"
              >
                USD
              </Button>
              <Button 
                variant={currency === 'NGN' ? 'default' : 'outline'}
                onClick={() => setCurrency('NGN')}
                size="sm"
              >
                NGN
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="membership" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="membership" className="text-sm data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-primary/30 data-[state=active]:text-primary dark:data-[state=active]:text-white">Membership Fees</TabsTrigger>
              <TabsTrigger value="additional" className="text-sm data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-primary/30 data-[state=active]:text-primary dark:data-[state=active]:text-white">Additional Fees</TabsTrigger>
            </TabsList>
            <TabsContent value="membership">
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="w-[50%] text-foreground">Type</TableHead>
                      <TableHead className="text-right text-foreground">Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-foreground">Individual Membership</TableCell>
                      <TableCell className="text-right text-foreground">
                        {currency === 'USD'
                          ? formatCurrency(duesData.individual_membership_fee_usd, 'USD')
                          : formatCurrency(duesData.individual_membership_fee_naira, 'NGN')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-foreground">Institutional Membership</TableCell>
                      <TableCell className="text-right text-foreground">
                        {currency === 'USD'
                          ? formatCurrency(duesData.institution_membership_fee_usd, 'USD')
                          : formatCurrency(duesData.institution_membership_fee_naira, 'NGN')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="additional">
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="w-[50%] text-foreground">Type</TableHead>
                      <TableHead className="text-right text-foreground">Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-foreground">Annual Dues</TableCell>
                      <TableCell className="text-right text-foreground">
                        {currency === 'USD'
                          ? formatCurrency(duesData.annual_dues_usd, 'USD')
                          : formatCurrency(duesData.annual_dues_naira, 'NGN')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-foreground">Vetting Fee</TableCell>
                      <TableCell className="text-right text-foreground">
                        {currency === 'USD'
                          ? formatCurrency(duesData.vetting_fee_usd, 'USD')
                          : formatCurrency(duesData.vetting_fee_naira, 'NGN')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-foreground">Publication Fee</TableCell>
                      <TableCell className="text-right text-foreground">
                        {currency === 'USD'
                          ? formatCurrency(duesData.publication_fee_usd, 'USD')
                          : formatCurrency(duesData.publication_fee_naira, 'NGN')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Edit className="h-4 w-4 mr-2" />
                Edit Dues
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background">
              <DialogHeader>
                <DialogTitle className="text-foreground">Update Dues Information</DialogTitle>
                <DialogDescription className="text-muted-foreground text-black dark:text-white">
                  Update the membership and dues information for both USD and NGN.
                </DialogDescription>
              </DialogHeader>
              {editData && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="mt-2">Fee Type</Label>
                    <Label className="mt-2 text-center">USD</Label>
                    <Label className="mt-2 text-center">NGN</Label>
                  </div>
                  
                  {/* Annual Dues */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="annual_dues_usd">Annual Dues</Label>
                    <Input
                      id="annual_dues_usd"
                      type="number"
                      value={editData.annual_dues_usd}
                      onChange={(e) => handleInputChange('annual_dues_usd', e.target.value)}
                    />
                    <Input
                      id="annual_dues_naira"
                      type="number"
                      value={editData.annual_dues_naira}
                      onChange={(e) => handleInputChange('annual_dues_naira', e.target.value)}
                    />
                  </div>
                  
                  {/* Vetting Fee */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="vetting_fee_usd">Vetting Fee</Label>
                    <Input
                      id="vetting_fee_usd"
                      type="number"
                      value={editData.vetting_fee_usd}
                      onChange={(e) => handleInputChange('vetting_fee_usd', e.target.value)}
                    />
                    <Input
                      id="vetting_fee_naira"
                      type="number"
                      value={editData.vetting_fee_naira}
                      onChange={(e) => handleInputChange('vetting_fee_naira', e.target.value)}
                    />
                  </div>
                  
                  {/* Publication Fee */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="publication_fee_usd">Publication Fee</Label>
                    <Input
                      id="publication_fee_usd"
                      type="number"
                      value={editData.publication_fee_usd}
                      onChange={(e) => handleInputChange('publication_fee_usd', e.target.value)}
                    />
                    <Input
                      id="publication_fee_naira"
                      type="number"
                      value={editData.publication_fee_naira}
                      onChange={(e) => handleInputChange('publication_fee_naira', e.target.value)}
                    />
                  </div>
                  
                  {/* Individual Membership Fee */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="individual_membership_fee_usd">Individual Membership</Label>
                    <Input
                      id="individual_membership_fee_usd"
                      type="number"
                      value={editData.individual_membership_fee_usd}
                      onChange={(e) => handleInputChange('individual_membership_fee_usd', e.target.value)}
                    />
                    <Input
                      id="individual_membership_fee_naira"
                      type="number"
                      value={editData.individual_membership_fee_naira}
                      onChange={(e) => handleInputChange('individual_membership_fee_naira', e.target.value)}
                    />
                  </div>
                  
                  {/* Institution Membership Fee */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="institution_membership_fee_usd">Institution Membership</Label>
                    <Input
                      id="institution_membership_fee_usd"
                      type="number"
                      value={editData.institution_membership_fee_usd}
                      onChange={(e) => handleInputChange('institution_membership_fee_usd', e.target.value)}
                    />
                    <Input
                      id="institution_membership_fee_naira"
                      type="number"
                      value={editData.institution_membership_fee_naira}
                      onChange={(e) => handleInputChange('institution_membership_fee_naira', e.target.value)}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                  onClick={handleUpdateDues}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DuesSettings;