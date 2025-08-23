"use client";
import { Check } from "lucide-react";
import { SeminarDetails, RegistrationType } from "../types";
import { getPaymentInfo, hasPaidPlans } from "../utils";

interface PricingSectionProps {
  seminar: SeminarDetails;
  attendanceType: "virtual" | "physical";
  selectedPlan: string;
  onRegisterClick: () => void;
  onPlanSelect: (plan: string) => void;
  onAttendanceTypeChange: (type: "virtual" | "physical") => void;
}

export const PricingSection = ({
  seminar,
  attendanceType,
  selectedPlan,
  onRegisterClick,
  onPlanSelect,
  onAttendanceTypeChange,
}: PricingSectionProps) => {
  // Don't show pricing section for free seminars
  if (!seminar) {
    return null;
  }

  // Hide entire pricing section if seminar is free
  if (seminar?.is_free === "free") {
    return null;
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 pb-2 border-b border-[#D5B93C] inline-block">
        Seminar Fees
      </h2>
      
      {seminar?.is_registered && (
        <div className="mb-6 p-4 bg-[#D5B93C]/20 rounded-lg border border-[#D5B93C]">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-[#D5B93C] flex-shrink-0" />
            <div>
              <p className="font-bold text-white">You're registered for this seminar!</p>
              <p className="text-white">Access to all seminar content and materials</p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing structure based on seminar mode */}
      {(() => {
        // Check for new structure (virtual_fee_naira, physical_fee_naira)
        const hasVirtualFee = seminar?.payments?.virtual_fee_naira !== undefined || seminar?.payments?.virtual_fee_usd !== undefined;
        const hasPhysicalFee = seminar?.payments?.physical_fee_naira !== undefined || seminar?.payments?.physical_fee_usd !== undefined;
        
        // Check for direct virtual/physical structure (like your data)
        const hasDirectVirtual = seminar?.payments?.virtual !== undefined;
        const hasDirectPhysical = seminar?.payments?.physical !== undefined;
        
        const virtualFee = hasVirtualFee ? {
          naira: seminar?.payments?.virtual_fee_naira || 0,
          usd: seminar?.payments?.virtual_fee_usd || 0
        } : hasDirectVirtual ? {
          naira: seminar?.payments?.virtual?.naira || 0,
          usd: seminar?.payments?.virtual?.usd || 0
        } : { naira: 0, usd: 0 };
        
        const physicalFee = hasPhysicalFee ? {
          naira: seminar?.payments?.physical_fee_naira || 0,
          usd: seminar?.payments?.physical_fee_usd || 0
        } : hasDirectPhysical ? {
          naira: seminar?.payments?.physical?.naira || 0,
          usd: seminar?.payments?.physical?.usd || 0
        } : { naira: 0, usd: 0 };

        // If using new structure or direct virtual/physical structure, show virtual/physical cards
        if (hasVirtualFee || hasPhysicalFee || hasDirectVirtual || hasDirectPhysical) {
          const showVirtual = (seminar?.mode === 'Virtual' || seminar?.mode === 'Virtual_Physical') && 
                             ((hasVirtualFee || hasDirectVirtual) && (Number(virtualFee.usd) > 0 || Number(virtualFee.naira) > 0));
          const showPhysical = (seminar?.mode === 'Physical' || seminar?.mode === 'Virtual_Physical') && 
                              ((hasPhysicalFee || hasDirectPhysical) && (Number(physicalFee.usd) > 0 || Number(physicalFee.naira) > 0));
          
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Virtual Attendance Card */}
              {showVirtual && (
                <VirtualAttendanceCard
                  seminar={seminar}
                  virtualFee={virtualFee}
                  onRegisterClick={() => {
                    onAttendanceTypeChange('virtual');
                    onRegisterClick();
                  }}
                />
              )}

              {/* Physical Attendance Card */}
              {showPhysical && (
                <PhysicalAttendanceCard
                  seminar={seminar}
                  physicalFee={physicalFee}
                  onRegisterClick={() => {
                    onAttendanceTypeChange('physical');
                    onRegisterClick();
                  }}
                />
              )}
            </div>
          );
        }

        // Fallback to legacy structure
        return (
          <LegacyPricingCards
            seminar={seminar}
            attendanceType={attendanceType}
            selectedPlan={selectedPlan}
            onPlanSelect={onPlanSelect}
            onRegisterClick={onRegisterClick}
          />
        );
      })()}
    </div>
  );
};

const VirtualAttendanceCard = ({ seminar, virtualFee, onRegisterClick }: any) => (
  <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
    seminar?.is_registered ? 'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : 'border-[#D5B93C]/30'
  } relative`}>
    {seminar?.is_registered && (
      <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
        REGISTERED
      </div>
    )}
    <div className={`p-6 ${seminar?.is_registered ? 'pt-16' : ''}`}>
      <h3 className="text-xl font-bold text-[#0E1A3D] mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
        Virtual Attendance
      </h3>
      
      <div className="space-y-4">
        <div className="text-center">
          {Number(virtualFee.usd) > 0 || Number(virtualFee.naira) > 0 ? (
            <>
              <p className="text-3xl font-bold text-[#0E1A3D]">
                ${virtualFee.usd}
              </p>
              <p className="text-lg text-gray-700">
                ₦{Number(virtualFee.naira).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-[#0E1A3D]">Free</p>
          )}
        </div>
        
        {/* <div className="pt-2">
          <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Live virtual access to all sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Digital seminar materials</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Certificate of attendance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Access to recorded sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Virtual networking opportunities</span>
            </li>
          </ul>
        </div> */}

        {seminar?.is_registered ? (
          <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>Registered</span>
          </div>
        ) : (
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md mt-4 transition-colors"
            onClick={onRegisterClick}
          >
            {Number(virtualFee.usd) > 0 || Number(virtualFee.naira) > 0 
              ? "Register Virtual" 
              : "Join Virtual (Free)"
            }
          </button>
        )}
      </div>
    </div>
  </div>
);

const PhysicalAttendanceCard = ({ seminar, physicalFee, onRegisterClick }: any) => (
  <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
    seminar?.is_registered ? 'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : 'border-[#D5B93C]'
  } relative ${seminar?.mode === 'Virtual_Physical' ? '' : 'md:transform md:-translate-y-2'}`}>
    {seminar?.is_registered && (
      <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
        REGISTERED
      </div>
    )}
    <div className={`p-6 relative ${seminar?.is_registered ? 'pt-16' : ''}`}>
      {!seminar?.is_registered && seminar?.mode === 'Virtual_Physical' && (
        <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
          PREMIUM
        </div>
      )}
      <h3 className="text-xl font-bold text-[#0E1A3D] mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Physical Attendance
      </h3>
      
      <div className="space-y-4">
        <div className="text-center">
          {Number(physicalFee.usd) > 0 || Number(physicalFee.naira) > 0 ? (
            <>
              <p className="text-3xl font-bold text-[#0E1A3D]">
                ${physicalFee.usd}
              </p>
              <p className="text-lg text-gray-700">
                ₦{Number(physicalFee.naira).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-[#0E1A3D]">Free</p>
          )}
        </div>
        
        {/* <div className="pt-2">
          <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>In-person attendance at venue</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Physical seminar materials</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Certificate of attendance</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Lunch & refreshments</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>In-person networking opportunities</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
              <span>Direct interaction with speakers</span>
            </li>
          </ul>
        </div> */}

        {seminar?.is_registered ? (
          <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>Registered</span>
          </div>
        ) : (
          <button 
            className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 transition-colors"
            onClick={onRegisterClick}
          >
            {Number(physicalFee.usd) > 0 || Number(physicalFee.naira) > 0 
              ? "Register Physical" 
              : "Join Physical (Free)"
            }
          </button>
        )}
      </div>
    </div>
  </div>
);

const LegacyPricingCards = ({ seminar, attendanceType, selectedPlan, onPlanSelect, onRegisterClick }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Basic Plan */}
    <PricingCard
      plan="basic"
      title={seminar?.is_free === "free" ? "Basic Premium Add-ons" : "Basic Access"}
      seminar={seminar}
      attendanceType={attendanceType}
      selectedPlan={selectedPlan}
      onPlanSelect={onPlanSelect}
      onRegisterClick={onRegisterClick}
      isPopular={false}
    />
    
    {/* Standard Plan */}
    <PricingCard
      plan="standard"
      title="Standard Access"
      seminar={seminar}
      attendanceType={attendanceType}
      selectedPlan={selectedPlan}
      onPlanSelect={onPlanSelect}
      onRegisterClick={onRegisterClick}
      isPopular={true}
      className="transform md:-translate-y-2"
    />
    
    {/* Premium Plan */}
    <PricingCard
      plan="premium"
      title="Premium Access"
      seminar={seminar}
      attendanceType={attendanceType}
      selectedPlan={selectedPlan}
      onPlanSelect={onPlanSelect}
      onRegisterClick={onRegisterClick}
      isPopular={false}
    />
  </div>
);

const PricingCard = ({ plan, title, seminar, attendanceType, selectedPlan, onPlanSelect, onRegisterClick, isPopular, className = "" }: any) => {
  const isActive = seminar?.is_registered && seminar?.current_plan === plan;
  const paymentInfo = getPaymentInfo(seminar?.payments, plan, attendanceType);
  const planData = seminar?.payments?.[plan] as RegistrationType;

  return (
    <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
      isActive ? 'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : 
      isPopular ? 'border-[#D5B93C]' : 'border-[#D5B93C]/30'
    } relative ${className}`}>
      {isActive && (
        <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
          ACTIVE ACCESS
        </div>
      )}
      <div className={`p-6 relative ${isActive ? 'pt-16' : ''}`}>
        {!seminar?.is_registered && isPopular && (
          <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
        )}
        <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">{title}</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            {paymentInfo ? (
              <>
                <p className="text-3xl font-bold text-[#0E1A3D]">
                  ${paymentInfo.usd}
                </p>
                <p className="text-lg text-gray-700">
                  ₦{paymentInfo.naira}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-[#0E1A3D]">Free</p>
            )}
          </div>
          
          <div className="pt-2">
            <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {/* {plan === 'basic' && (
                <>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>Seminar materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{attendanceType === 'virtual' ? 'Virtual' : 'Physical'} access to sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>Digital certificate</span>
                  </li>
                </>
              )} */}
              {/* {plan === 'standard' && (
                <>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{attendanceType === 'virtual' ? 'Enhanced virtual experience' : 'Physical attendance'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{attendanceType === 'physical' ? 'Lunch & refreshments' : 'Exclusive virtual networking'}</span>
                  </li>
                </>
              )} */}
              {/* {plan === 'premium' && (
                <>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>Everything in Standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{attendanceType === 'virtual' ? 'VIP virtual lounge' : 'VIP seating'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{attendanceType === 'virtual' ? 'One-on-one speaker sessions' : 'Networking dinner'}</span>
                  </li>
                </>
              )} */}
              {planData?.package?.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {seminar?.is_registered ? (
            isActive ? (
              <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Your Active Plan</span>
              </div>
            ) : (
              <button 
                className="w-full bg-gray-400 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 cursor-not-allowed"
                disabled
              >
                Already Registered
              </button>
            )
          ) : (
            <button 
              className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 transition-colors"
              onClick={() => {
                onPlanSelect(plan);
                onRegisterClick();
              }}
            >
              {seminar?.is_free === "free" ? `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}` : `Register ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};