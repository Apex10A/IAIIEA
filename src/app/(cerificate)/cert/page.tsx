// components/Certificate.js
import React from 'react';

const Certificate = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white border-4 border-gray-800 p-8 shadow-lg">
        {/* Certificate Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Certificate of</h1>
          <h2 className="text-5xl font-bold uppercase text-blue-800 tracking-wider">Participation</h2>
        </div>

        <svg width="850" height="600" viewBox="0 0 850 600" xmlns="http://www.w3.org/2000/svg">

  <rect x="10" y="10" width="830" height="580" fill="white" stroke="#333" stroke-width="4"/>

  <text x="425" y="80" font-family="Times New Roman" font-size="36" font-weight="bold" text-anchor="middle" text-transform="uppercase">Certificate of</text>
  <text x="425" y="130" font-family="Times New Roman" font-size="48" font-weight="bold" fill="#1e3a8a" text-anchor="middle" text-transform="uppercase">Participation</text>
  

  <line x1="100" y1="150" x2="750" y2="150" stroke="#333" stroke-width="2"/>
  <line x1="100" y1="155" x2="750" y2="155" stroke="#333" stroke-width="2"/>
  

  <text x="425" y="200" font-family="Times New Roman" font-size="24" text-anchor="middle">THIS IS TO CERTIFY THAT</text>
  

  <text x="425" y="270" font-family="Times New Roman" font-size="36" font-weight="bold" text-anchor="middle" text-transform="uppercase">Osikoya Oladapo Olajide</text>
  <line x1="300" y1="280" x2="550" y2="280" stroke="#ccc" stroke-width="2"/>
  

  <text x="425" y="330" font-family="Times New Roman" font-size="24" text-anchor="middle">PARTICIPATED AT THE 2-DAY HAND-ON WORKSHOP ON ARTIFICIAL INTELLIGENCE (AI)</text>
  <text x="425" y="370" font-family="Times New Roman" font-size="24" text-anchor="middle">EMPLOYING ARTIFICIAL INTELLIGENCE (AI) TOOLS &amp;</text>
  <text x="425" y="410" font-family="Times New Roman" font-size="24" text-anchor="middle">ED-TECH SOFTWARE FOR INNOVATIVE LEARNING,</text>
  <text x="425" y="450" font-family="Times New Roman" font-size="24" text-anchor="middle">TEACHING,ASSESSMENT, AND RESEARCH</text>
  

  <text x="425" y="500" font-family="Times New Roman" font-size="28" font-weight="bold" text-anchor="middle">10TH-11TH APRIL 2025</text>
  

  <text x="425" y="540" font-family="Times New Roman" font-size="24" font-weight="bold" text-anchor="middle" text-transform="uppercase">International Association for Innovations</text>
  <text x="425" y="570" font-family="Times New Roman" font-size="20" text-anchor="middle">in Educational Assessment</text>
</svg>

        {/* Divider */}
        <div className="border-t-2 border-b-2 border-gray-800 py-1 my-6"></div>

        {/* Main Content */}
        <div className="text-center mb-10">
          <p className="text-xl mb-8">THIS IS TO CERTIFY THAT</p>
          
          <div className="mb-12">
            <p className="text-4xl font-bold uppercase tracking-wider py-2 px-4 border-b-2 border-gray-300 inline-block">
              Osikoya Oladapo Olajide
            </p>
          </div>
          
          <p className="text-xl leading-relaxed mb-6">
            PARTICIPATED AT THE 2-DAY HAND-ON WORKSHOP ON ARTIFICIAL INTELLIGENCE (AI)
          </p>
          
          <p className="text-xl leading-relaxed mb-6">
            EMPLOYING ARTIFICIAL INTELLIGENCE (AI) TOOLS &<br />
            ED-TECH SOFTWARE FOR INNOVATIVE LEARNING,
          </p>
          
          <p className="text-xl leading-relaxed mb-10">
            TEACHING,ASSESSMENT, AND RESEARCH
          </p>
          
          <p className="text-2xl font-semibold mb-12">
            10TH-11TH APRIL 2025
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xl uppercase tracking-wider">
            International Association for Innovations
          </p>
          <p className="text-lg mt-2">
            in Educational Assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;