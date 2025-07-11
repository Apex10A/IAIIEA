"use client";
import React, { useRef } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import iaiieaLogo from "@/assets/auth/images/IAIIEA Logo I.png";
import FingerPrint from "./fingerprint.png"
import BlueBg from "./blue.png"
import YellowBg from "./yellowBg.png"
import "../../../index.css"
import Gold from "./gold-celebration.png"


const dummyData = {
  name: "Onoja Inalegwu Moses",
  membershipId: "MN118790308",
  awardDate: "30-Jan-2025",
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

  const handleDownload = async () => {
    if (certRef.current) {
      const canvas = await html2canvas(certRef.current, { backgroundColor: null });
      const link = document.createElement("a");
      link.download = "certificate.jpg";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 ">
      <h1 className="text-2xl font-bold mb-8 text-center">Membership Certificate</h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition"
        >
          Download Certificate
        </button>
      </div>
      {/* Certificate Section */}
      <div className="flex justify-center ">
        <div className="bg-white "
          ref={certRef}
          style={{
            width: "792px",
            height: "712px",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            overflow: "hidden",
            position: "relative",
            fontFamily: 'serif',
          }}
        >
          <div className="relative w-full h-[200px]">
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
              width={140}
              height={140}
              className="absolute left-1/2 top-[120px] z-[3] object-contain"
              style={{ transform: "translateX(-50%)" }}
            />
          </div>
          {/* Certificate Content */}
          <div className="relative z-10 w-full flex flex-col items-center px-8 py-6 mt-8">
            <div className="absolute -top-[185px] text-center">
              <h1><span className="cert text-5xl text-white tracking-widest">CERTIFICATE OF</span></h1>
              <h1 className="text-2xl text-[#e5c029] tracking-[5px] mem font-[500]">MEMBERSHIP</h1>
            </div>
            <div className="flex flex-col items-center w-full mb-4 mt-4">
              <div className="text-[16px] opacity-[0.6] font-normal mb-2 tracking-wider">THIS CERTIFICATE IS AWARDED TO</div>
              <div className="text-[32px] cert font-bold text-[#1e3a8a]">{dummyData.name.toUpperCase()}</div>
              <div className="w-[500px] h-[2px] bg-[#D5B93C] rounded mb-2" />
              <div className="text-[16px] font-medium mb-4 tracking-wider  opacity-[0.6] ">AS A MEMBER OF IAIIEA</div>
            </div>
            <div className="flex items-center gap-12 mb-8">
              <div className="flex flex-col items-center">
                <div className="font-semibold">Membership ID</div>
                <div className="border-b-2 border-[#D5B93C] w-[180px] text-[18px] text-center mt-1">{dummyData.membershipId}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold">Date of award</div>
                <div className="border-b-2 border-[#D5B93C] w-[180px] text-[18px] text-center mt-1">{dummyData.awardDate}</div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-16 mt-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="border-b-2 border-[#1e3a8a] w-[120px] h-6" />
                <div className="mt-1 text-[14px]">President</div>
              </div>
              <div className="flex flex-col items-center">
                <Image src={iaiieaLogo} alt="IAIIEA Logo" width={80} height={80} className="object-contain" />
                <div className="text-[12px] text-[#1e3a8a] font-bold mt-1 tracking-widest">IAIIEA</div>
                <div className="text-[10px] text-[#1e3a8a] -mt-1">International Association for Innovations<br />in Educational Assessment</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-b-2 border-[#1e3a8a] w-[120px] h-6" />
                <div className="mt-1 text-[14px]">Secretary</div>
              </div>
            </div>
            <div className="absolute bottom-10 left-0 w-full text-center text-[12px] text-[#888] tracking-wider">
              This certificate is only valid for one year
            </div>
            <div className="absolute bottom-0 left-0 w-full">
              <BottomBorder />
            </div>
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