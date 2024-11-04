import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Link as LinkIcon, Download } from 'lucide-react';

const DocumentGrid = () => {
  const documents = [
    {
      icon: <LinkIcon size={150} />,
      title: "Use of Digital Item Bank Platform for Development of Paper and Online Assessments Dr. Mohamed Abdel-Latif",
      type: "link",
      pages: null,
      size: null,
      date: null,
    },
    {
      icon: <Image src="/FilePpt.svg" width={150} height={150} alt="PPT icon" />,
      title: "Use of Digital Item Bank Platform for Development of Paper and Online Assessments Dr. Mohamed Abdel-Latif",
      type: "ppt",
      pages: "24 pages",
      size: "12MB",
      date: "12/07/2024",
    },
    {
      icon: <Image src="/MicrosoftWordLogo.svg" width={150} height={150} alt="Word icon" />,
      title: "Use of Digital Item Bank Platform for Development of Paper and Online Assessments Dr. Mohamed Abdel-Latif",
      type: "word",
      pages: "15 pages",
      size: "8MB",
      date: "12/07/2024",
    },
    {
      icon: <Image src="/FilePdf.svg" width={150} height={150} alt="PDF icon" />,
      title: "Use of Digital Item Bank Platform for Development of Paper and Online Assessments Dr. Mohamed Abdel-Latif",
      type: "pdf",
      pages: "18 pages",
      size: "10MB",
      date: "12/07/2024",
    },
  ];

  const handleDownload = (type: string) => {
    console.log(`Downloading ${type} document`);
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
      {documents.map((doc, index) => (
        <div key={index} className="flex items-center">
          <div className="bg-[#E9EBF3] rounded-l-3xl px-3 py-3">
            <div className="w-[150px] h-[150px] flex items-center justify-center">
              {doc.icon}
            </div>
          </div>
          <div className="bg-[#F5F4F3] rounded-r-3xl pl-5 py-3 h-[175px] max-w-[500px] flex flex-col justify-between">
            <div>
              <p className="font-semibold pb-3 text-xl">{doc.title}</p>
              <Link href="/" className="max-w-[300px] underline">
                Link{'->'}
              </Link>
            </div>
           
            {doc.pages && (
              <div className="flex items-center gap-2">
                <p>{doc.pages}</p>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <p>{doc.size}</p>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <p>{doc.date}</p>
                <button
                  onClick={() => handleDownload(doc.type)}
                  className="ml-auto mr-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Download size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;