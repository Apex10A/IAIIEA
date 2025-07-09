"use client";
import React, { useRef } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import fingerprint from "./fingerprint.png";

const certificate = {
  id: "1",
  conferenceTitle: "CERTIFICATE OF MEMBERSHIP",
  conferenceDate: "2023-06-15",
  issueDate: "2023-06-20",
  status: "available",
};

const CertificatesPage = () => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (certRef.current) {
      const canvas = await html2canvas(certRef.current, { backgroundColor: null });
      const link = document.createElement("a");
      link.download = "certificate.png";
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
            height: "612px",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            background: "white",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Watermark */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <Image
              src={fingerprint}
              alt="Certificate Fingerprint"
              width={300}
              height={300}
              style={{
                opacity: 0.07,
                objectFit: "contain",
              }}
            />
          </div>
          {/* Blue Header */}
          <div
            style={{
              background: "#1e3a8a",
              width: "100%",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              zIndex: 1,
              position: "relative",
            }}
          >
            <h1 className="text-3xl font-bold py-8 text-center text-white tracking-widest">
              {certificate.conferenceTitle}
            </h1>
          </div>
          {/* Certificate Content */}
          <div className="relative z-10 w-full flex flex-col items-center px-8 py-6">
            <div className="flex flex-col items-center w-full mb-6">
              <h2 className="text-lg font-semibold mb-2">THIS CERTIFICATE WAS AWARDED TO</h2>
              <h1 className="text-2xl font-bold mb-2">AUGUSTA EGWUAGU</h1>
              <h2 className="text-lg font-semibold mb-4">AS A MEMBER OF IAIIEA</h2>
            </div>
            <div className="flex items-center gap-8 mb-8">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Membership ID</p>
                <p className="border-b border-gray-400 w-32 h-6"></p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold">Date of Award</p>
                <p className="border-b border-gray-400 w-32 h-6"></p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-12 mt-8">
              <div className="flex flex-col items-center">
                <p className="border-b border-gray-400 w-32 h-6"></p>
                <p className="mt-1 text-sm">President</p>
              </div>
              <div>
                {/* Place for IAIIEA Logo if needed */}
              </div>
              <div className="flex flex-col items-center">
                <p className="border-b border-gray-400 w-32 h-6"></p>
                <p className="mt-1 text-sm">Secretary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage; 