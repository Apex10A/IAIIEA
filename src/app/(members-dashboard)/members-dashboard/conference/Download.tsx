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
      title: "Leveraging Digital Resources and Big Data Analytics to Enhance Teaching, Learning and Assessment in the Nigeria Basic Education System By Bashir Galandanci",
      pages: "42 pages",
      size: "37MB",
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
    },
    {
      title: "Assessment Dialogues in a Data-Driven World Rethinking Student Success By Tatiana Sango and Kate Kouch",
      pages: "36 pages",
      size: "409.44KB",
      date: "01/08/2024",
      downloadUrl: "/pdfResources/Eleven.pptx"
    },
    {
      title: "Transforming Assessment in the Era of EduTech The CQ-Tech USA Perspective By Kashyap Puroit and Sanjeev Kanda",
      pages: "36 pages",
      size: "409.44KB",
      date: "01/08/2024",
      downloadUrl: "/pdfResources/Twelve.pptx"
    },
    {
      title: "Welcome Address by the Executive Secretary UBEC",
      pages: "36 pages",
      size: "409.44KB",
      date: "01/08/2024",
      downloadUrl: "/pdfResources/Thirteen.pptx"
    },
    {
      title: "Workshop III - Assessment Gourmet v 2",
      pages: "36 pages",
      size: "409.44KB",
      date: "01/08/2024",
      downloadUrl: "/pdfResources/Fourteen.pptx"
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
    <div className='pt-5'>
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-black">Conference Documents</h1>
      </div>
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pb-10 pt-5">
      {documents.map((doc, index) => (
        <div key={index} className="flex items-center">
          {/* <div className="bg-[#E9EBF3] rounded-l-3xl px-3 py-3">
            <div className="w-[150px] h-[150px] flex items-center justify-center">
            <Image src="/FilePpt.svg" width={100} height={100} alt="PPT icon" />,
            </div>
          </div> */}
          <div className="bg-[#fff] border rounded-r-3xl pl-5 py-3 px-3 w-full flex flex-col justify-between">
            <div>
              <p className="font-semibold pb-3 text-[16px] md:text-[18px] text-black">{doc.title}</p>
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
              <p className='opacity-[0.6] text-[14px] text-black'>{doc.pages}</p>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <p className='opacity-[0.6] text-[14px] text-black'>{doc.size}</p>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <p className='text-[14px] opacity-[0.6] text-black'>{doc.date}</p>
              <button
                onClick={() => handleDownload(doc.downloadUrl, doc.title)}
                className="ml-auto mr-4 p-2 text-[16px] md:text-[18px] text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label={`Download ${doc.title}`}
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default DocumentGrid;