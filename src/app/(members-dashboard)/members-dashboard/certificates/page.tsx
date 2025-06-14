"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { showToast } from "@/utils/toast";
import { Download, FileText } from 'lucide-react';

interface Certificate {
  id: string;
  conferenceTitle: string;
  conferenceDate: string;
  issueDate: string;
  status: 'available' | 'pending';
}

const CertificatesPage = () => {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!session?.user?.token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates/user`, {
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.status === 'success') {
          setCertificates(data.data);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
        showToast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [session]);

  const handleDownload = async (certificateId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates/${certificateId}/download`, {
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to download certificate');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate_${certificateId}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      showToast.error('Failed to download certificate');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Certificates</h1>
      
      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't earned any certificates yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {certificate.conferenceTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Issued on {new Date(certificate.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  certificate.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {certificate.status === 'available' ? 'Available' : 'Pending'}
                </span>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Conference Date: {new Date(certificate.conferenceDate).toLocaleDateString()}
                </p>
              </div>

              {certificate.status === 'available' && (
                <button
                  onClick={() => handleDownload(certificate.id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Certificate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage; 