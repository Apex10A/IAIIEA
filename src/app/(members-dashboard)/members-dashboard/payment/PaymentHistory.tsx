import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/modules/ui/table';
import { Input } from '@/modules/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select';
import { Button } from '@/modules/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/modules/ui/dialog';
import { Badge } from '@/modules/ui/badge';
import { Calendar, Search, Filter, X } from 'lucide-react';

// Interfaces
interface PaymentDetail {
  title: string;
  payment_id: string;
  amount: number;
  currency: string;
  sub_payments: Record<string, number> | [];
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  paymentType: string;
  searchQuery: string;
}

const PaymentHistory: React.FC = () => {
  // Session and authentication
  const { data: session, status } = useSession();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // State for payments and filtering
  const [paymentHistory, setPaymentHistory] = useState<PaymentDetail[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    paymentType: '',
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
  
  // Selection and details state
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<PaymentDetail | null>(null);

  // Memoized pagination logic
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  // Utility functions
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (title: string) => {
    if (title.toLowerCase().includes('conference')) {
      return 'bg-blue-100 text-blue-800';
    } else if (title.toLowerCase().includes('membership')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch payment history
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (status !== 'authenticated' || !session?.user) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payment_history`, {
          headers: {
            'Authorization': `Bearer ${session.user.token}`
          }
        });
        
        if (response.data.status === 'success') {
          const paymentData = response.data.data;
          setPaymentHistory(paymentData);
          setFilteredPayments(paymentData);
          
          // Extract unique payment types
          const uniqueTypes = [...new Set(paymentData.map((payment: PaymentDetail) => payment.title))];
          setPaymentTypes(uniqueTypes);
          
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to fetch payment history');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setPaymentHistory([]);
        setFilteredPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [session, status]);

  // Apply filters
  const applyFilters = () => {
    let result = [...paymentHistory];

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.title.toLowerCase().includes(query) ||
        payment.payment_id.toLowerCase().includes(query)
      );
    }

    // Amount filter
    if (filters.minAmount) {
      result = result.filter(payment => 
        payment.amount >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      result = result.filter(payment => 
        payment.amount <= parseFloat(filters.maxAmount)
      );
    }

    // Payment type filter
    if (filters.paymentType) {
      result = result.filter(payment => 
        payment.title === filters.paymentType
      );
    }

    setFilteredPayments(result);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      paymentType: '',
      searchQuery: ''
    });
    setFilteredPayments(paymentHistory);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D5B93C]"></div>
      </div>
    );
  }

  // Error states
  if (status === 'unauthenticated' || error === 'Not authenticated') {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Please log in to view payment history.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search payments..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <Select 
                  value={filters.paymentType}
                  onValueChange={(value) => setFilters(prev => ({...prev, paymentType: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                <Input 
                  type="number" 
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({...prev, minAmount: e.target.value}))}
                  placeholder="Minimum Amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                <Input 
                  type="number" 
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({...prev, maxAmount: e.target.value}))}
                  placeholder="Maximum Amount"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={applyFilters} className="bg-[#D5B93C] text-[#0E1A3D] hover:bg-[#D5B93C]/90">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment History Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No payment history found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell className="font-medium">{payment.title}</TableCell>
                  <TableCell className="font-mono text-sm">{payment.payment_id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.title)}>
                      {payment.title}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedPaymentDetail(payment)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPaymentDetail} onOpenChange={() => setSelectedPaymentDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPaymentDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Title</p>
                  <p className="mt-1">{selectedPaymentDetail.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <Badge className={`mt-1 ${getStatusColor(selectedPaymentDetail.title)}`}>
                    {selectedPaymentDetail.title}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="mt-1 font-medium">
                    {formatCurrency(selectedPaymentDetail.amount, selectedPaymentDetail.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment ID</p>
                  <p className="mt-1 font-mono text-sm">{selectedPaymentDetail.payment_id}</p>
                </div>
              </div>
              {selectedPaymentDetail.sub_payments && 
               typeof selectedPaymentDetail.sub_payments === 'object' && 
               Object.keys(selectedPaymentDetail.sub_payments).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Sub Payments</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {Object.entries(selectedPaymentDetail.sub_payments).map(([plan, amount]) => (
                      <div key={plan} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="font-medium">{plan}</span>
                        <span className="text-gray-600">
                          {formatCurrency(amount, selectedPaymentDetail.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;