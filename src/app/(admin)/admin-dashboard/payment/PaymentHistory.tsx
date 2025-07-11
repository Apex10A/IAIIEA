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
import { Search, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

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
  searchQuery: string;
}

const PaymentHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [paymentHistory, setPaymentHistory] = useState<PaymentDetail[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    paymentType: 'all',
    searchQuery: ''
  });

  const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<PaymentDetail | null>(null);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const USD_TO_NGN = 1528; // 1 USD = 1500 NGN (update as needed)
  const formatCurrency = (amount: number, currency: string) => {
    let nairaAmount = amount;
    if (currency === 'USD') {
      nairaAmount = amount * USD_TO_NGN;
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 2
    }).format(nairaAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const renderPagination = () => {
    const pageNumbers = [];
    const displayRange = 2;

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === 1 
              ? 'bg-primary text-primary-foreground' 
              : 'border border-input hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          1
        </button>
      );
    }

    if (currentPage > displayRange + 2) {
      pageNumbers.push(
        <span key="start-ellipsis" className="px-1">
          ...
        </span>
      );
    }

    const startPage = Math.max(2, currentPage - displayRange);
    const endPage = Math.min(totalPages - 1, currentPage + displayRange);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === i 
              ? 'bg-primary text-primary-foreground' 
              : 'border border-input hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - (displayRange + 1)) {
      pageNumbers.push(
        <span key="end-ellipsis" className="px-1">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === totalPages 
              ? 'bg-primary text-primary-foreground' 
              : 'border border-input hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

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

  const openPaymentDetails = (payment: PaymentDetail) => {
    setSelectedPaymentDetail(payment);
  };

  const closePaymentDetails = () => {
    setSelectedPaymentDetail(null);
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
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
          // Sort by date descending (most recent first)
          const sortedPayments = paymentData.slice().sort((a: PaymentDetail, b: PaymentDetail) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPaymentHistory(sortedPayments);
          setFilteredPayments(sortedPayments);
          
          const uniqueTypes = ([...new Set(paymentData.map((payment: PaymentDetail) => payment.payment_type))] as string[])
            .filter((type: string) => type.trim() !== '');
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

  const applyFilters = () => {
    let result = [...paymentHistory];

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

    if (filters.paymentType && filters.paymentType !== "all") {
      result = result.filter(payment => 
        payment.payment_type === filters.paymentType
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.name.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query) ||
        payment.payment_id.toLowerCase().includes(query) ||
        payment.payment_type.toLowerCase().includes(query)
      );
    }

    setFilteredPayments(result);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      paymentType: 'all',
      searchQuery: ''
    });
    setFilteredPayments(paymentHistory);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [filters.paymentType]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary text-black dark:text-white "></div>
        <p className="text-muted-foreground text-black dark:text-white">Loading payment history...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || error === 'Not authenticated') {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Please log in to view payment history.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <p className="text-destructive">Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Payment History</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'} found
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search payments..."
            className="pl-10 bg-white dark:bg-gray-900 text-black dark:text-white border-border w-full"
            value={filters.searchQuery}
            onChange={(e) => {
              setFilters(prev => ({...prev, searchQuery: e.target.value}));
              applyFilters();
            }}
          />
          {filters.searchQuery && (
            <X 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => {
                setFilters(prev => ({...prev, searchQuery: ''}));
                applyFilters();
              }}
            />
          )}
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-800 p-4 md:p-6">
        <h2 className="text-lg font-medium text-black dark:text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-white">Date Range</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input 
                type="date" 
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
                className="bg-white dark:bg-gray-900 text-black dark:text-white border-border w-full"
              />
              <Input 
                type="date" 
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))}
                className="bg-white dark:bg-gray-900 text-black dark:text-white border-border w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-white">Amount Range</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input 
                type="number" 
                value={filters.minAmount}
                onChange={(e) => setFilters(prev => ({...prev, minAmount: e.target.value}))}
                placeholder="Min"
                className="bg-white dark:bg-gray-900 text-black dark:text-white border-border w-full"
              />
              <Input 
                type="number" 
                value={filters.maxAmount}
                onChange={(e) => setFilters(prev => ({...prev, maxAmount: e.target.value}))}
                placeholder="Max"
                className="bg-white dark:bg-gray-900 text-black dark:text-white border-border w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-white">Payment Type</label>
            <Select 
              value={filters.paymentType}
              onValueChange={(value) => setFilters(prev => ({...prev, paymentType: value}))}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900 text-black dark:text-white border-border w-full">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900">
                <SelectItem value="all" className="text-black dark:text-white">All types</SelectItem>
                {paymentTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-black dark:text-white">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="text-black dark:text-white border-border dark:border-gray-600 w-full sm:w-auto"
          >
            Reset
          </Button>
          <Button 
            onClick={applyFilters}
            className="bg-primary hover:bg-primary/90 text-black dark:text-white w-full sm:w-auto"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Payment History Table */}
      {filteredPayments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center bg-white dark:bg-gray-900">
          <Info className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-black dark:text-white">No payments found</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700">
          <div className="overflow-x-auto min-w-[1200px]">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="w-[40px]">
                    <input 
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </TableHead>
                  <TableHead className="text-black dark:text-white">Name</TableHead>
                  <TableHead className="text-black dark:text-white">Email</TableHead>
                  <TableHead className="text-black dark:text-white">Type</TableHead>
                  <TableHead className="text-black dark:text-white">Payment ID</TableHead>
                  <TableHead className="text-right text-black dark:text-white">Amount</TableHead>
                  <TableHead className="text-right text-black dark:text-white">Date</TableHead>
                  <TableHead className="text-black dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.map((payment) => (
                  <TableRow key={payment.payment_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-border">
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedPayments.includes(payment.payment_id)}
                        onChange={() => handlePaymentSelect(payment.payment_id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-black dark:text-white">
                      {payment.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {payment.email}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-black dark:text-white">
                        {payment.payment_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 font-mono text-sm">
                      {payment.payment_id}
                    </TableCell>
                    <TableCell className="text-right font-medium text-black dark:text-white">
                      {formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(payment.date)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openPaymentDetails(payment)}
                        className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="border-t border-border px-4 py-3 bg-white dark:bg-gray-900">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing <span className="font-medium text-black dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium text-black dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)}</span> of{' '}
                <span className="font-medium text-black dark:text-white">{filteredPayments.length}</span> payments
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="text-black dark:text-white border-border"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {renderPagination()}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="text-black dark:text-white border-border"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Dialog */}
      <AnimatePresence>
        <Dialog open={!!selectedPaymentDetail} onOpenChange={closePaymentDetails}>
          <DialogContent className="max-w-xs sm:max-w-md bg-white dark:bg-gray-900 border border-border">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <DialogHeader>
                <DialogTitle className="text-black dark:text-white">Payment Details</DialogTitle>
              </DialogHeader>
              
              {selectedPaymentDetail && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
                      <p className="font-medium text-black dark:text-white">{selectedPaymentDetail.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                      <p className="font-medium text-black dark:text-white">{selectedPaymentDetail.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Payment Type</p>
                      <p className="font-medium text-black dark:text-white">{selectedPaymentDetail.payment_type}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Amount</p>
                      <p className="font-medium text-black dark:text-white">
                        {formatCurrency(selectedPaymentDetail.amount, selectedPaymentDetail.currency)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Payment ID</p>
                      <p className="font-medium font-mono text-sm text-black dark:text-white">
                        {selectedPaymentDetail.payment_id}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Date</p>
                      <p className="font-medium text-black dark:text-white">
                        {formatDate(selectedPaymentDetail.date)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </div>
  );
};

export default PaymentHistory;