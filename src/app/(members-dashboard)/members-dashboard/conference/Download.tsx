import React from 'react';
import { Download } from 'lucide-react';
import Image from 'next/image';

const DocumentGrid = () => {
  const documents = [
    {
      title: "AI in Assessment: Helping Hand or Pandora's Box",
      pages: "41 pages",
      size: "11.6MB",
      date: "07/11/2024",
      downloadUrl: "/pdfResources/One.pptx"
    },
    {
      title: "AI in Educational Assessment The Cybersecurity Perspective by Faith Ariyo",
      pages: "12 pages",
      size: "18.9MB",
      date: "12/07/2024",
      downloadUrl: "/pdfResources/Two.pptx"
    },
    {
      title: "Application of Artificial Intelligence in Research Writing by Christian I Amuche",
      pages: "32 pages",
      size: "87.5KB",
      date: "15/07/2024",
      downloadUrl: "/pdfResources/Three.pptx"
    },
    {
      title: "Enhance Large-Scale Educational Assessment Practices with the Advances in Artificial by Hong Jiao",
      pages: "28 pages",
      size: "10.2MB",
      date: "18/07/2024",
      downloadUrl: "/pdfResources/four.pdf"
    },
    {
      title: "Introduction to Big Data, Artificial Intelligence and Digitalised Assessment by Akinyele Ariyo",
      pages: "35 pages",
      size: "13.1MB",
      date: "20/07/2024",
      downloadUrl: "/pdfResources/Five.pptx"
    },
    {
      title: "Leveraging Big Data Analysis and Artificial Intelligence By Phebe Veronica Jatau",
      pages: "45 pages",
      size: "14.5MB",
      date: "22/07/2024",
      downloadUrl: "/pdfResources/fiverr.pptx"
    },
    {
      title: "Leveraging Big Data Analytics (BDA) and Artificial Intelligence (AI) for Ensuring Quality and Access in UBE Smart Schools in Nigeria by Dr. Hafsat Lawal Kontagora",
      pages: "38 pages",
      size: "11.8MB",
      date: "25/07/2024",
      downloadUrl: "/pdfResources/Seven.pptx"
    },
    {
      title: "Psychometrics Fundamentals",
      pages: "42 pages",
      size: "12.7MB",
      date: "28/07/2024",
      downloadUrl: "/pdfResources/Eight.pptx"
    },
    {
      title: "PRESENTATION by TONGSTON IAIIEA",
      pages: "30 pages",
      size: "10.5MB",
      date: "30/07/2024",
      downloadUrl: "/pdfResources/Nine.pptx"
    },
    {
      title: "Thinking Outside the Box 1",
      pages: "36 pages",
      size: "409.44KB",
      date: "01/08/2024",
      downloadUrl: "/pdfResources/Ten.pptx"
    }
  ];

  const handleDownload = (downloadUrl: string, title: string) => {
    // In a real application, you would implement the actual download logic here
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-5 py-10">
      {documents.map((doc, index) => (
        <div key={index} className="flex items-center">
          {/* <div className="bg-[#E9EBF3] rounded-l-3xl px-3 py-3">
            <div className="w-[150px] h-[150px] flex items-center justify-center">
            <Image src="/FilePpt.svg" width={100} height={100} alt="PPT icon" />,
            </div>
          </div> */}
          <div className="bg-[#fff] border rounded-r-3xl pl-5 py-3  w-full max-w-[500px] flex flex-col justify-between">
            <div>
              <p className="font-semibold pb-3 text-[16px] md:text-[18px] ">{doc.title}</p>
              {/* <a 
                href={doc.downloadUrl} 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Presentation
              </a> */}
            </div>
            
            <div className="flex items-center gap-2">
              <p className='text-[16px] md:text-[18px]'>{doc.pages}</p>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <p className='text-[16px] md:text-[18px]'>{doc.size}</p>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <p className='text-[16px] md:text-[18px]'>{doc.date}</p>
              <button
                onClick={() => handleDownload(doc.downloadUrl, doc.title)}
                className="ml-auto mr-4 p-2 text-[16px] md:text-[18px] hover:bg-gray-200 rounded-full transition-colors"
                aria-label={`Download ${doc.title}`}
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;