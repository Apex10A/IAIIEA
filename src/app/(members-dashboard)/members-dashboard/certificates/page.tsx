"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";
import { showToast } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import iaiieaLogo from "@/assets/auth/images/IAIIEA Logo I.png";
import FingerPrint from "./fingerprint.png"
import BlueBg from "./blue.png"
import YellowBg from "./yellowBg.png"
import "../../../index.css"
import Gold from "./gold-celebration.png"

interface UserProfile {
  user_id: string;
  f_name: string;
  m_name: string;
  l_name: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  whatsapp_no: string;
  area_of_specialization: string;
  profession: string;
  postal_addr: string;
  residential_addr: string;
  type: string;
}

interface CertificateData {
  name: string;
  membership_id: string;
  award_date: string;
  president_name: string;
  sec_name: string;
  down_text: string;
}

const dummyData = {
  name: "Loading...",
  membershipId: "Loading...",
  awardDate: "Loading...",
};

const GoldSeal = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', left: '50%', top: 60, transform: 'translateX(-50%)', zIndex: 2 }}>
    <circle cx="40" cy="40" r="28" fill="#D5B93C" stroke="#B89B2B" strokeWidth="6" />
    <circle cx="40" cy="40" r="18" fill="#F7E7A6" />
    <rect x="36" y="60" width="8" height="18" rx="2" fill="#D5B93C" stroke="#B89B2B" strokeWidth="2" />
    <polygon points="40,58 44,70 36,70" fill="#B89B2B" />
  </svg>
);

const BottomBorder = () => (
  <div style={{
    width: '100%',
    height: 24,
    background: 'repeating-linear-gradient(90deg, #1e3a8a 0 32px, #D5B93C 32px 48px)',
    marginTop: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  }} />
);

const CertificatesPage = () => {
  const certRef = useRef<HTMLDivElement>(null);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch user profile to get membership ID
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/view_profile_details`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setUserProfile(data.data);
        return data.data;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showToast.error("Failed to load user profile");
    }
    return null;
  };

  // Fetch certificate details
  const fetchCertificateDetails = async (membershipId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificate/membership/${membershipId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch certificate: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setCertificateData(data.data);
        return data.data;
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      showToast.error("Failed to load certificate details");
    }
    return null;
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!bearerToken) return;
      
      setLoading(true);
      try {
        const profile = await fetchUserProfile();
        if (profile?.user_id) {
          await fetchCertificateDetails(profile.user_id);
        }
      } catch (error) {
        console.error("Error loading certificate data:", error);
        showToast.error("Failed to load certificate data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bearerToken]);

  const handleDownload = async () => {
    if (certRef.current) {
      const canvas = await html2canvas(certRef.current, { backgroundColor: null });
      const link = document.createElement("a");
      link.download = "certificate.jpg";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Loading...";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Get display data (real data or loading placeholders)
  const displayData = {
    name: certificateData?.name || dummyData.name,
    membershipId: certificateData?.membership_id || dummyData.membershipId,
    awardDate: certificateData?.award_date ? formatDate(certificateData.award_date) : dummyData.awardDate,
    presidentName: certificateData?.president_name || "President",
    secretaryName: certificateData?.sec_name || "Secretary",
    validityText: certificateData?.down_text || "This certificate is only valid for one year"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-lg font-medium text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 ">
      <h1 className="text-2xl font-bold mb-8 text-center">Membership Certificate</h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!certificateData}
          title={!certificateData ? "Certificate data is still loading or not available" : "Download Certificate"}
        >
          Download Certificate
        </button>
      </div>

      {!certificateData && !loading && (
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
            <p className="text-yellow-800 text-sm text-center">
              Certificate data is not available yet. Please contact support if this persists.
            </p>
          </div>
        </div>
      )}
      {/* Certificate Section */}
      <div className="flex justify-center ">
        <div className="bg-white "
          ref={certRef}
          style={{
            width: "1188px",
            height: "918px",
         
          }}
        >
          <div className="relative w-full h-[300px]">
            <Image
              src={BlueBg}
              alt="Blue Background"
              className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
            />
            <Image
              src={YellowBg}
              alt="Yellow Background"
              className="absolute top-[5px] left-0 w-full h-full object-cover z-[1]"
            />
            <Image
              src={Gold}
              alt="Gold Seal"
              width={200}
              height={200}
              className="absolute left-1/2 top-[200px] z-[3] object-contain"
              style={{ transform: "translateX(-50%)" }}
            />
          </div>
          {/* Certificate Content */}
          <div className="relative z-10 w-full flex flex-col items-center px-8 py-6 mt-8">
            <div className="absolute -top-[270px] text-center">
              <h1><span className="cert text-7xl text-white tracking-widest mb-2">CERTIFICATE OF</span></h1>
              <h1 className="text-4xl text-[#e5c029] tracking-[5px] mem font-[500]">MEMBERSHIP</h1>
            </div>
            <div className="flex flex-col items-center w-full mb-4 mt-4">
              <div className="text-2xl opacity-[0.6] font-normal mb-2 tracking-wider">THIS CERTIFICATE IS AWARDED TO</div>
              <div className="text-5xl cert font-bold text-[#1e3a8a]">{displayData.name.toUpperCase()}</div>
              <div className="w-[500px] h-[2px] bg-[#D5B93C] rounded mb-2" />
              <div className="text-2xl font-medium mb-4 tracking-wider  opacity-[0.6] ">AS A MEMBER OF IAIIEA</div>
            </div>
            <div className="flex items-center gap-12 mb-8">
              <div className="flex flex-col items-center">
                <div className="font-semibold">Membership ID</div>
                <div className="border-b-2 border-[#D5B93C] w-[180px] text-[18px] text-center mt-1">{displayData.membershipId}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold">Date of award</div>
                <div className="border-b-2 border-[#D5B93C] w-[180px] text-[18px] text-center mt-1">{displayData.awardDate}</div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-16 mt-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="border-b-2 border-[#1e3a8a] w-[120px] h-6" />
                <div className="mt-1 text-[14px]">{displayData.presidentName}</div>
              </div>
              <div className="flex flex-col items-center">
                <Image src={iaiieaLogo} alt="IAIIEA Logo" width={80} height={80} className="object-contain" />
                <div className="text-[12px] text-[#1e3a8a] font-bold mt-1 tracking-widest">IAIIEA</div>
                <div className="text-[10px] text-[#1e3a8a] -mt-1">International Association for Innovations<br />in Educational Assessment</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-b-2 border-[#1e3a8a] w-[120px] h-6" />
                <div className="mt-1 text-[14px]">{displayData.secretaryName}</div>
              </div>
            </div>
            <div className="absolute bottom-10 left-0 w-full text-center text-[12px] text-[#888] tracking-wider">
              {displayData.validityText}
            </div>
            {/* <div className="absolute bottom-0 left-0 w-full">
              <BottomBorder />
            </div> */}
            <Image
              src={FingerPrint}
              alt="Gold Seal"
            
              style={{
                position: "absolute",
                left: "50%",
                top: "-80px", // Adjust as needed
                transform: "translateX(-50%)",
                zIndex: 3,
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage; 