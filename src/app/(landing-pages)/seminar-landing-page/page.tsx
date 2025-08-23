"use client"
import React from 'react';
import { MapPin, Calendar, Clock, Check, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '../seminars/[id]/components/PaymentModal';
import { SeminarDetails } from '../seminars/[id]/types';
import { hasPaidPlans, isValidImageUrl } from '../seminars/[id]/utils';
import { showToast } from '@/utils/toast';
import "@/app/index.css"

// Remove local types/helpers; reuse shared ones from seminars/[id] modules

const SeminarLandingPage = () => {
  const [seminarDetails, setSeminarDetails] = React.useState<SeminarDetails | null>(null);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [attendanceType, setAttendanceType] = React.useState<'virtual' | 'physical'>('virtual');
  const [paymentProcessing, setPaymentProcessing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const seminarId = searchParams.get('id');
  const { data: session } = useSession();

  React.useEffect(() => {
    const fetchSeminarDetails = async () => {
      if (!seminarId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${seminarId}`,
          {
            headers: session?.user?.token
              ? { Authorization: `Bearer ${session.user.token}` }
              : {},
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setSeminarDetails(data.data);
        } else {
          setError(data.message || 'Failed to load seminar');
        }
      } catch (error: any) {
        setError('Failed to fetch seminar details');
      } finally {
        setLoading(false);
      }
    };

    fetchSeminarDetails();
  }, [seminarId, session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center conference-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D5B93C] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading seminar details...</p>
        </div>
      </div>
    );
  }

  if (error || !seminarDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center conference-bg px-4">
        <div className="text-center max-w-md">
          <p className="text-white text-lg mb-4">{error || 'Unable to load seminar'}</p>
          <a href="/" className="inline-block bg-[#D5B93C] text-[#0E1A3D] px-4 py-2 rounded font-bold">Back to seminars</a>
        </div>
      </div>
    );
  }

  const handleRegisterClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!seminarDetails) return;
    if (!session) {
      showToast.error('Please login to continue');
      return;
    }
    try {
      setPaymentProcessing(true);
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seminar/initiate_pay/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ id: (seminarDetails as any).id, mode: attendanceType }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.message || 'Failed to initiate payment');

      if (data?.status === 'success') {
        const link = data?.data?.link;
        if (seminarDetails.is_free === 'free') {
          showToast.success("Registration completed. You're in!");
          window.location.reload();
        } else {
          showToast.info('Registration initiated. Go to Dashboard → Payments to complete your payment under Pending Payments.');
        }
        if (link) {
          window.location.href = link;
          return;
        }
        setShowPaymentModal(false);
      } else {
        throw new Error(data?.message || 'Unable to initiate payment');
      }
    } catch (e: any) {
      showToast.error(e?.message || 'Failed to process payment');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="min-h-screen conference-bg">
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full pt-16 md:pt-24">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D5B93C] mb-4 leading-tight">
              {seminarDetails?.title}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
              {seminarDetails?.theme}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5" />
                <span>{seminarDetails?.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span>{seminarDetails?.date}</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span>{seminarDetails?.start_time}</span>
              </div>

              {/* Mode */}
              {(seminarDetails as any)?.mode && (
                <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20">Mode</span>
                  <span>{((seminarDetails as any).mode as string).replace(/_/g, ' ')}</span>
                </div>
              )}

              {/* Type (Free or Paid) */}
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <span className="text-xs px-2 py-1 rounded-full bg-white/20">Type</span>
                <span>{seminarDetails?.is_free === 'free' ? 'Free' : 'Paid'}</span>
              </div>
            </div>

            {/* Register actions */}
            <div className="mt-8 flex items-center justify-center gap-3">
              {(seminarDetails as any)?.mode !== 'Physical' && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={() => { setAttendanceType('virtual'); handleRegisterClick(); }}>
                  {seminarDetails?.is_free === 'free' ? 'Join Virtual' : 'Register (Virtual)'}
                </Button>
              )}
              {((seminarDetails as any)?.mode === 'Physical' || (seminarDetails as any)?.mode === 'Virtual_Physical') && (
                <Button className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold" onClick={() => { setAttendanceType('physical'); handleRegisterClick(); }}>
                  {seminarDetails?.is_free === 'free' ? 'Join Physical' : 'Register (Physical)'}
                </Button>
              )}
            </div>

          </div>
        </div>
      </section>

      {seminarDetails?.speakers && seminarDetails?.speakers?.length > 0 && (
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 pb-2 border-b border-[#D5B93C] inline-block">
              Featured Speakers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {seminarDetails.speakers.map((speaker, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="relative h-48 w-full bg-gradient-to-br from-[#D5B93C]/20 to-[#0E1A3D]/20 flex items-center justify-center">
                    {(() => {
                      const pictureUrl = speaker?.picture;
                      const valid = isValidImageUrl(pictureUrl);
                      if (valid) {
                        return (
                          <img
                            src={pictureUrl}
                            alt={speaker?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.speaker-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                        );
                      }
                      return null;
                    })()}
                    <div className="speaker-fallback flex items-center justify-center w-full h-full" style={{ display: isValidImageUrl(speaker?.picture) ? 'none' : 'flex' }}>
                      <User className="w-16 h-16 text-[#D5B93C]/50" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{speaker?.name}</h3>
                    <p className="text-[#D5B93C] text-sm mb-2">{speaker?.title}</p>
                    <p className="text-white/70 text-sm">{speaker?.portfolio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing/Packages retain existing rendering (legacy structure lists) */}
      {seminarDetails?.is_free !== 'free' && seminarDetails?.payments && Object.keys(seminarDetails?.payments)?.length > 0 && (
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 pb-2 border-b border-[#D5B93C] inline-block">Registration Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(seminarDetails?.payments as any).map(([tier, details]: any, index) => (
                details && (
                  <div key={tier} className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${index === 1 ? 'border-[#D5B93C] transform md:-translate-y-2' : 'border-[#D5B93C]/30'}`}>
                    <div className="p-6 relative">
                      {index === 1 && (
                        <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">POPULAR</div>
                      )}
                      <h3 className="text-xl font-bold text-[#0E1A3D] mb-4 capitalize">{tier}</h3>
                      <div className="space-y-4">
                        {details?.virtual && (
                          <div className="text-center">
                            <h4 className="text-lg font-semibold mb-2 text-[#0E1A3D]">Virtual</h4>
                            <p className="text-3xl font-bold text-[#0E1A3D]">${details?.virtual?.usd || '-'}</p>
                            <p className="text-lg text-gray-700">₦{details?.virtual?.naira || '-'}</p>
                          </div>
                        )}
                        {details?.physical && (
                          <div className="text-center">
                            <h4 className="text-lg font-semibold mb-2 text-[#0E1A3D]">Physical</h4>
                            <p className="text-3xl font-bold text-[#0E1A3D]">${details?.physical?.usd || '-'}</p>
                            <p className="text-lg text-gray-700">₦{details?.physical?.naira || '-'}</p>
                          </div>
                        )}
                        {details?.package && details?.package?.length > 0 && (
                          <div className="pt-2">
                            <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {details?.package?.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentSubmit}
        seminar={seminarDetails as any}
        attendanceType={attendanceType}
        paymentProcessing={paymentProcessing}
      />
    </div>
  );
};

export default SeminarLandingPage;