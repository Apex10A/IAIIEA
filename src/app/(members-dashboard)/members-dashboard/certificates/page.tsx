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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
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
      <div className="flex justify-center">
        <div
          ref={certRef}
          style={{
            width: "792px",
            height: "712px",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            background: "white",
            overflow: "hidden",
            position: "relative",
            fontFamily: 'serif',
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "200px" }}>

            <Image
              src={BlueBg}
              alt="Blue Background"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 2,
              }}
            />

            <Image
              src={YellowBg}
              alt="Yellow Background"
              style={{
                position: "absolute",
                top: "5px", 
                left: 0,
                width: "100%",
                height: "100%", 
                objectFit: "cover",
                zIndex: 1,
              }}
            />
           
            <Image
              src={Gold}
              alt="Gold Seal"
              width={140}
              height={140}
              style={{
                position: "absolute",
                left: "50%",
                top: "120px", // Adjust as needed
                transform: "translateX(-50%)",
                zIndex: 3,
                objectFit: "contain",
              }}
            />
          </div>
          {/* Certificate Content */}
          <div className="relative z-10 w-full flex flex-col items-center px-8 py-6" style={{ marginTop: 32 }}>

            <div className="absolute top-[-185px] text-center">
              <h1><span className="cert text-5xl text-white">CERTIFICATE OF</span></h1>
              <h1 className=" text-2xl text-[#cfa64c] tracking-widest">MEMBERSHIP</h1>
            </div>

            <div className="flex flex-col items-center w-full mb-4 mt-4">
              <div style={{ fontSize: 18, fontWeight: 400, marginBottom: 8, letterSpacing: 1 }}>THIS CERTIFICATE IS AWARDED TO</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a8a', marginBottom: 2, letterSpacing: 2 }}>{dummyData.name.toUpperCase()}</div>
              <div style={{ width: 320, height: 2, background: '#D5B93C', borderRadius: 2, marginBottom: 8 }} />
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, letterSpacing: 1 }}>AS A MEMBER OF IAIIEA</div>
            </div>
            <div className="flex items-center gap-12 mb-8">
              <div className="flex flex-col items-center">
                <div style={{ fontWeight: 600 }}>Membership ID</div>
                <div style={{ borderBottom: '2px solid #D5B93C', width: 180, fontSize: 18, textAlign: 'center', marginTop: 2 }}>{dummyData.membershipId}</div>
              </div>
              <div className="flex flex-col items-center">
                <div style={{ fontWeight: 600 }}>Date of award</div>
                <div style={{ borderBottom: '2px solid #D5B93C', width: 180, fontSize: 18, textAlign: 'center', marginTop: 2 }}>{dummyData.awardDate}</div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-16 mt-8" style={{ marginBottom: 32 }}>
              <div className="flex flex-col items-center">
                <div style={{ borderBottom: '2px solid #1e3a8a', width: 120, height: 24 }}></div>
                <div style={{ marginTop: 4, fontSize: 14 }}>President</div>
              </div>
              <div className="flex flex-col items-center">
                <Image src={iaiieaLogo} alt="IAIIEA Logo" width={80} height={80} style={{ objectFit: 'contain' }} />
                <div style={{ fontSize: 12, color: '#1e3a8a', fontWeight: 700, marginTop: 2, letterSpacing: 2 }}>IAIIEA</div>
                <div style={{ fontSize: 10, color: '#1e3a8a', marginTop: -2 }}>International Association for Innovations<br />in Educational Assessment</div>
              </div>
              <div className="flex flex-col items-center">
                <div style={{ borderBottom: '2px solid #1e3a8a', width: 120, height: 24 }}></div>
                <div style={{ marginTop: 4, fontSize: 14 }}>Secretary</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 40, left: 0, width: '100%', textAlign: 'center', fontSize: 12, color: '#888', letterSpacing: 1 }}>
              This certificate is only valid for one year
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
              <BottomBorder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage; 