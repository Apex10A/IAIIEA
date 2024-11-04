import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface PaymentRecord {
  id: string;
  payment_id: string;
  payment_type: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!session?.access_token) return;
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment_history/`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          setPayments(data.data || []); // Access `data` directly and provide fallback
        } else {
          console.error("Failed to fetch payment history:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchPaymentHistory();
  }, [session?.access_token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">No payment history available yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment, index) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.payment_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.payment_type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.currency.toUpperCase()} {payment.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(payment.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
