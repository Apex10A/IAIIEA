// import React, { useState, useEffect } from 'react';
// import ButtonProp from '../notification/button';
// import PaymentHistory from './PaymentHistory';
// import { useFlutterwave } from 'flutterwave-react-v3';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { LoadingSpinner } from '@/components/ui/loading-spinner'; // Assuming you have this component

// interface PendingPayment {
//   title: string;
//   payment_id: string;
//   amount: number;
//   currency: string;
//   sub_payments: any[];
// }

// interface UserPaymentData {
//   status: string;
//   message: string;
//   data: PendingPayment[];
// }

// const Payment = () => {
//   const [selectedSection, setSelectedSection] = useState<'Payment' | 'Payment History'>('Payment');
//   const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const router = useRouter();
//   const { data: session } = useSession();

//   useEffect(() => {
//     fetchPendingPayments();
//   }, [session?.access_token]);

//   const fetchPendingPayments = async () => {
//     if (!session?.access_token) return;
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pending_payments/`, {
//         headers: {
//           'Authorization': `Bearer ${session.access_token}`,
//         },
//       });
  
//       if (response.ok) {
//         const data: UserPaymentData = await response.json();
//         setPendingPayments(data.data || []);
//       } else {
//         throw new Error(response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching pending payments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentCallback = async (transaction: any, payment: PendingPayment) => {
//     if (transaction.status === 'successful') {
//       setIsProcessing(true);
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify_payment/`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${session?.access_token}`
//           },
//           body: JSON.stringify({
//             transaction_id: transaction.transaction_id,
//             payment_id: payment.payment_id,
//             flw_ref: transaction.flw_ref,
//             tx_ref: transaction.tx_ref
//           }),
//         });

//         if (response.ok) {
//           await fetchPendingPayments(); // Refresh payments list
//           router.refresh();
//         } else {
//           throw new Error('Payment verification failed');
//         }
//       } catch (error) {
//         console.error('Error verifying payment:', error);
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };

//   const initiatePayment = (payment: PendingPayment) => {
//     if (!session?.user) {
//       router.push('/login');
//       return;
//     }

//     const config = {
//       public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
//       tx_ref: `${payment.payment_id}-${Date.now()}`,
//       currency: payment.currency,
//       amount: payment.amount,
//       customer: {
//         email: session.user.email || '',
//         phone_number: session.user.phone || '',
//         name: `${session.user.f_name || ''} ${session.user.l_name || ''}`,
//       },
//       payment_options: 'card,ussd,bank_transfer',
//       customizations: {
//         title: payment.title,
//         description: 'IAIIEA Membership Payment',
//         logo: '/logo.png', // Make sure to add your logo in public folder
//       },
//       meta: {
//         payment_id: payment.payment_id,
//       },
//     };

//     const handleFlutterPayment = useFlutterwave(config);

//     handleFlutterPayment({
//       callback: (transaction) => handlePaymentCallback(transaction, payment),
//       onClose: () => {
//         console.log('Payment modal closed');
//       },
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <LoadingSpinner className="w-8 h-8" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className='py-10'>
//         <p className='text-[18px]'>
//           Home {'>'} <span className='font-[600]'>Payment</span>
//         </p>
//       </div>
      
//       <ButtonProp
//         options={['Payment', 'Payment History']}
//         selectedSection={selectedSection}
//         setSelectedSection={setSelectedSection}
//       />
      
//       {selectedSection === 'Payment' ? (
//         <div className="space-y-6 mt-8">
//           <div className='text-center'>
//             <p className='text-gray-600 font-semibold'>
//               You currently have {pendingPayments.length} pending payment{pendingPayments.length !== 1 ? 's' : ''} to clear
//             </p>
//           </div>
          
//           <div className="space-y-6">
//             {pendingPayments.map((payment) => (
//               <div 
//                 key={payment.payment_id} 
//                 className='border p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200'
//               >
//                 <div className='space-y-4'>
//                   <h3 className='text-2xl font-semibold text-gray-900'>{payment.title}</h3>
//                   <p className='text-gray-600'>
//                     Complete your payment to access all membership features.
//                   </p>
//                   <div className='flex items-center justify-between pt-4'>
//                     <p className="text-lg font-medium">
//                       {payment.currency.toUpperCase()} {payment.amount.toLocaleString()}
//                     </p>
//                     <button
//                       onClick={() => initiatePayment(payment)}
//                       disabled={isProcessing}
//                       className={`
//                         inline-flex items-center px-6 py-3 rounded-full
//                         ${isProcessing 
//                           ? 'bg-gray-400 cursor-not-allowed' 
//                           : 'bg-[#203a87] hover:bg-[#152a61]'
//                         }
//                         text-white font-semibold transition-colors duration-200
//                       `}
//                     >
//                       {isProcessing ? (
//                         <>
//                           <LoadingSpinner className="w-4 h-4 mr-2" />
//                           Processing...
//                         </>
//                       ) : (
//                         'Make payment'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className='py-10'>
//           <PaymentHistory />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Payment;