"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Search, 
  Calendar, 
  Award, 
  FileText, 
  Eye,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import Image from 'next/image';

// Mock data for certificates
const mockCertificates = [
  {
    id: 1,
    title: "IAIIEA Membership Certificate",
    type: "membership",
    status: "active",
    issueDate: "2024-01-15",
    expiryDate: "2025-01-15",
    description: "Official membership certificate for IAIIEA",
    downloadUrl: "/certificates/membership-2024.pdf"
  },
  {
    id: 2,
    title: "Conference Participation Certificate",
    type: "participation",
    status: "completed",
    issueDate: "2023-11-20",
    expiryDate: null,
    description: "Certificate for attending the Annual Educational Assessment Conference 2023",
    downloadUrl: "/certificates/conference-2023.pdf"
  },
  {
    id: 3,
    title: "Workshop Completion Certificate",
    type: "completion",
    status: "completed",
    issueDate: "2023-09-10",
    expiryDate: null,
    description: "Certificate for completing the Advanced Assessment Techniques Workshop",
    downloadUrl: "/certificates/workshop-2023.pdf"
  },
  {
    id: 4,
    title: "Training Module Certificate",
    type: "training",
    status: "pending",
    issueDate: null,
    expiryDate: null,
    description: "Certificate for Digital Assessment Tools Training (In Progress)",
    downloadUrl: null
  }
];

const CertificateCard = ({ certificate, onDownload, onPreview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const isExpiringSoon = certificate.expiryDate && 
    new Date(certificate.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D5B93C]" />
            <CardTitle className="text-lg">{certificate.title}</CardTitle>
          </div>
          <Badge className={`${getStatusColor(certificate.status)} flex items-center gap-1`}>
            {getStatusIcon(certificate.status)}
            {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {certificate.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {certificate.issueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
              </div>
            )}
            {certificate.expiryDate && (
              <div className={`flex items-center gap-1 ${isExpiringSoon ? 'text-orange-600' : ''}`}>
                <Calendar className="w-4 h-4" />
                <span>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
                {isExpiringSoon && <AlertCircle className="w-4 h-4 text-orange-500" />}
              </div>
            )}
          </div>
          
          {isExpiringSoon && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
              <p className="text-sm text-orange-800">
                ⚠️ This certificate expires soon. Please renew to maintain your membership status.
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(certificate)}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            
            {certificate.downloadUrl && (
              <Button
                size="sm"
                onClick={() => onDownload(certificate)}
                className="flex items-center gap-1 bg-[#0E1A3D] hover:bg-[#0E1A3D]/90"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CertificatePreview = ({ certificate, onClose }) => {
  const certRef = useRef(null);

  const handleDownloadPreview = async () => {
    if (certRef.current) {
      const canvas = await html2canvas(certRef.current, { backgroundColor: null });
      const link = document.createElement("a");
      link.download = `${certificate.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{certificate.title}</h2>
            <div className="flex gap-2">
              <Button onClick={handleDownloadPreview} size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" onClick={onClose} size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex justify-center">
          <div 
            ref={certRef}
            className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl w-full"
            style={{ aspectRatio: '4/3' }}
          >
            <div className="text-center space-y-6">
              <div className="border-b-2 border-[#D5B93C] pb-4">
                <h1 className="text-3xl font-bold text-[#0E1A3D] mb-2">IAIIEA</h1>
                <p className="text-sm text-gray-600">International Association for Innovations in Educational Assessment</p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-serif text-[#0E1A3D]">Certificate of {certificate.type.charAt(0).toUpperCase() + certificate.type.slice(1)}</h2>
                <p className="text-lg">This is to certify that</p>
                <p className="text-2xl font-bold text-[#D5B93C] border-b border-gray-300 pb-2">John Doe</p>
                <p className="text-base">{certificate.description}</p>
              </div>
              
              <div className="flex justify-between items-end pt-8">
                <div className="text-center">
                  <div className="border-b border-gray-400 w-32 mb-1"></div>
                  <p className="text-sm">President</p>
                </div>
                <div className="text-center">
                  <Award className="w-12 h-12 text-[#D5B93C] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Official Seal</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-gray-400 w-32 mb-1"></div>
                  <p className="text-sm">Secretary</p>
                </div>
              </div>
              
              {certificate.issueDate && (
                <p className="text-sm text-gray-500 pt-4">
                  Issued on {new Date(certificate.issueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembersCertificatePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [previewCertificate, setPreviewCertificate] = useState(null);

  const filteredCertificates = mockCertificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || cert.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDownload = (certificate) => {
    // In a real app, this would trigger the actual download
    console.log('Downloading certificate:', certificate.title);
    // Simulate download
    const link = document.createElement('a');
    link.href = certificate.downloadUrl || '#';
    link.download = `${certificate.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    link.click();
  };

  const handlePreview = (certificate) => {
    setPreviewCertificate(certificate);
  };

  const certificateStats = {
    total: mockCertificates.length,
    active: mockCertificates.filter(c => c.status === 'active').length,
    completed: mockCertificates.filter(c => c.status === 'completed').length,
    pending: mockCertificates.filter(c => c.status === 'pending').length
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">Manage and download your IAIIEA certificates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-[#0E1A3D]">{certificateStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-[#D5B93C]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{certificateStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{certificateStats.completed}</p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{certificateStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="membership">Membership</option>
                <option value="participation">Participation</option>
                <option value="completion">Completion</option>
                <option value="training">Training</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onDownload={handleDownload}
            onPreview={handlePreview}
          />
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any certificates yet. Complete courses or attend events to earn certificates.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certificate Preview Modal */}
      {previewCertificate && (
        <CertificatePreview
          certificate={previewCertificate}
          onClose={() => setPreviewCertificate(null)}
        />
      )}
    </div>
  );
};

export default MembersCertificatePage;