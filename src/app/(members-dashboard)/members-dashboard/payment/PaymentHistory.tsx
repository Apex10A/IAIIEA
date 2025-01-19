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

// Interfaces
interface PaymentDetail {
  name: string;
  email: string;
  payment_type: string;
  payment_id: string;
  amount: number;
  currency: string;
  date: string;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  paymentType: string;
}

const PaymentHistory: React.FC = () => {
  // Session and authentication
  const { data: session, status } = useSession();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Number of items to display per page

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
    paymentType: ''
  });
  const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
  
  // Selection and details state
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Pagination rendering function
  const renderPagination = () => {
    const pageNumbers = [];
    const displayRange = 2; // Number of pages to show around the current page
  
    // Always show first page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-[#fef08a] text-black' 
              : 'border-2 border-[#fef08a] bg-transparent text-black'
          }`}
        >
          1
        </button>
      );
    }
  
    // Add ellipsis and surrounding pages before current page
    if (currentPage > displayRange + 2) {
      pageNumbers.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }
  
    // Calculate start and end for middle range
    const startPage = Math.max(2, currentPage - displayRange);
    const endPage = Math.min(totalPages - 1, currentPage + displayRange);
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 rounded ${
            currentPage === i 
              ? 'bg-[#fef08a] text-black' 
              : 'border-2 border-[#fef08a] bg-transparent text-black'
          }`}
        >
          {i}
        </button>
      );
    }
  
    // Add ellipsis and pages after current page
    if (currentPage < totalPages - (displayRange + 1)) {
      pageNumbers.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }
  
    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages 
              ? 'bg-[#fef08a] text-black' 
              : 'border-2 border-[#fef08a] bg-transparent text-black'
          }`}
        >
          {totalPages}
        </button>
      );
    }
  
    return pageNumbers;
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.payment_id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Details popup handlers
  const openPaymentDetails = (payment: PaymentDetail) => {
    setSelectedPaymentDetail(payment);
  };

  const closePaymentDetails = () => {
    setSelectedPaymentDetail(null);
  };

  // API configuration
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch payment history
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      // Check if session and token are available
      if (status !== 'authenticated' || !session?.user) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/admin/payment_history`, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        });
        
        if (response.data.status === 'success') {
          const paymentData = response.data.data;
          setPaymentHistory(paymentData);
          setFilteredPayments(paymentData);
          
          // Extract unique payment types
          const uniqueTypes = [...new Set(paymentData.map(payment => payment.payment_type))];
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

    // Date filter
    if (filters.dateFrom) {
      result = result.filter(payment => 
        new Date(payment.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      result = result.filter(payment => 
        new Date(payment.date) <= new Date(filters.dateTo)
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
        payment.payment_type === filters.paymentType
      );
    }

    setFilteredPayments(result);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      paymentType: ''
    });
    setFilteredPayments(paymentHistory);
    setCurrentPage(1); // Reset to first page
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading payment history...</p>
      </div>
    );
  }

  // Render authentication error
  if (status === 'unauthenticated' || error === 'Not authenticated') {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Please log in to view payment history.</p>
      </div>
    );
  }

  // Render other error states
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <h1 className='text-red-500 text-lg pb-3'>Filter by:</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date From</label>
          <Input 
            type="date" 
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date To</label>
          <Input 
            type="date" 
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <Select 
            value={filters.paymentType}
            onValueChange={(value) => setFilters(prev => ({...prev, paymentType: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Type" />
            </SelectTrigger>
            <SelectContent>
              {paymentTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Amount</label>
          <Input 
            type="number" 
            value={filters.minAmount}
            onChange={(e) => setFilters(prev => ({...prev, minAmount: e.target.value}))}
            placeholder="Minimum Amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Amount</label>
          <Input 
            type="number" 
            value={filters.maxAmount}
            onChange={(e) => setFilters(prev => ({...prev, maxAmount: e.target.value}))}
            placeholder="Maximum Amount"
          />
        </div>
        <div className="flex items-end space-x-2">
          <Button onClick={applyFilters} className='bg-[#fef08a]'>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </div>

      {/* Payment History Table */}
      {filteredPayments.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={selectedPayments.includes(payment.payment_id)}
                      onChange={() => handlePaymentSelect(payment.payment_id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </TableCell>
                  <TableCell className='text-slate-600'>{truncateText(payment.name)}</TableCell>
                  <TableCell className='text-slate-600'>{truncateText(payment.email)}</TableCell>
                  <TableCell className='text-slate-600'>{payment.payment_type}</TableCell>
                  <TableCell className='text-slate-600'>{truncateText(payment.payment_id)}</TableCell>
                  <TableCell className="text-right text-slate-600">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className='text-slate-600 border-slate-500 '
                      onClick={() => openPaymentDetails(payment)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button 
                      onClick={handlePrevPage} 
                      disabled={currentPage === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    {renderPagination()}
                    <Button 
                      onClick={handleNextPage} 
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

<AnimatePresence>
  <Dialog open={!!selectedPaymentDetail} onOpenChange={closePaymentDetails}>
    <DialogContent>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        <DialogHeader>
          <h1 className='text-2xl'>Payment Details</h1>
          <DialogDescription>
            {selectedPaymentDetail && (
              <div className="space-y-4 my-5">
                <div>
                  <span className='text-lg'>{selectedPaymentDetail.name}</span>
                </div>
                <div>
                  <span className='text-lg'>{selectedPaymentDetail.email}</span>
                </div>
                <div>
                 <span className='text-lg'>{selectedPaymentDetail.payment_type}</span>
                </div>
                <div>
                  <span className='text-lg'>{selectedPaymentDetail.payment_id}</span>
                </div>
                <div>
                 <span className='text-lg'>{formatCurrency(selectedPaymentDetail.amount, selectedPaymentDetail.currency)}</span>
                </div>
                <div>
                  <span className='text-lg'>{formatDate(selectedPaymentDetail.date)}</span>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </motion.div>
    </DialogContent>
  </Dialog>
</AnimatePresence>
    </div>
  );
};

export default PaymentHistory;