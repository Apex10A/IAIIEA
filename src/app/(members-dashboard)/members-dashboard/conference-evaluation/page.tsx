"use client"
import React, { useState, useEffect } from 'react';
import "@/app/index.css"
import { showToast } from "@/utils/toast";
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

interface ConferenceDetails {
  id: string;
  theme: string;
  date: string;
  is_registered: boolean;
}

interface FormData {
  name: string;
  email: string;
  hearAbout: string;
  otherSource: string;
  contentQuality: string;
  contentRelevance: string;
  beneficialSession: string;
  beneficialSessionReason: string;
  speakerKnowledge: string;
  presentationEffectiveness: string;
  organizationRating: string;
  venueSatisfaction: string;
  registrationRating: string;
  networkingSatisfaction: string;
  overallExperience: string;
  significantTakeaway: string;
  futureSuggestions: string;
  additionalComments: string;
  contactForFollowUp: string;
}

const ConferenceEvaluationForm = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get('id');
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [conferenceDetails, setConferenceDetails] = useState<ConferenceDetails | null>(null);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Personal Info
    name: '',
    email: '',
    
    // Section 1
    hearAbout: '',
    otherSource: '',
    contentQuality: '',
    contentRelevance: '',
    beneficialSession: '',
    beneficialSessionReason: '',
    speakerKnowledge: '',
    presentationEffectiveness: '',
    
    // Section 2
    organizationRating: '',
    venueSatisfaction: '',
    registrationRating: '',
    networkingSatisfaction: '',
    overallExperience: '',
    significantTakeaway: '',
    futureSuggestions: '',
    additionalComments: '',
    contactForFollowUp: ''
  });

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (!conferenceId || !bearerToken) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.status === 'success') {
          setConferenceDetails(data.data);
        }
      } catch (error) {
        console.error('Error fetching conference details:', error);
        showToast.error('Failed to load conference details');
      }
    };

    fetchConferenceDetails();
  }, [conferenceId, bearerToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateSection = (section: number): boolean => {
    if (section === 1) {
      if (!formData.name) {
        showToast.error('Please enter your full name');
        return false;
      }
      if (!formData.email) {
        showToast.error('Please enter your email');
        return false;
      }
      if (!formData.hearAbout) {
        showToast.error('Please select how you heard about the conference');
        return false;
      }
      if (formData.hearAbout === 'Other' && !formData.otherSource) {
        showToast.error('Please specify how you heard about the conference');
        return false;
      }
      if (!formData.contentQuality) {
        showToast.error('Please rate the conference content quality');
        return false;
      }
      if (!formData.contentRelevance) {
        showToast.error('Please rate the content relevance');
        return false;
      }
      if (!formData.beneficialSession) {
        showToast.error('Please select the most beneficial session');
        return false;
      }
      if (!formData.speakerKnowledge) {
        showToast.error('Please rate the speakers knowledge');
        return false;
      }
      if (!formData.presentationEffectiveness) {
        showToast.error('Please rate the presentation effectiveness');
        return false;
      }
      return true;
    } else {
      if (!formData.organizationRating) {
        showToast.error('Please rate the conference organization');
        return false;
      }
      if (!formData.venueSatisfaction) {
        showToast.error('Please rate your venue satisfaction');
        return false;
      }
      if (!formData.registrationRating) {
        showToast.error('Please rate the registration process');
        return false;
      }
      if (!formData.networkingSatisfaction) {
      showToast.error('Please rate the networking opportunities');
        return false;
      }
      if (!formData.overallExperience) {
        showToast.error('Please rate your overall experience');
        return false;
      }
      return true;
    }
  };

  const handleNext = () => {
    if (validateSection(1)) {
      setCurrentSection(2);
      window.scrollTo(0, 0);
    }
  };

const generateCertificate = (name: string, theme: string, date: string) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with subtle pattern -->
  <rect x="0" y="0" width="1200" height="800" fill="#FFFFFF"/>
  <rect x="0" y="0" width="1200" height="800" fill="url(#pattern)" opacity="0.05"/>

  <!-- Decorative Border -->
  <rect x="20" y="20" width="1160" height="760" rx="10" stroke="#D5B93C" stroke-width="2" fill="none"/>
  <rect x="40" y="40" width="1120" height="720" rx="8" stroke="#152A61" stroke-width="1" fill="none"/>

  <!-- Top Blue Curved Banner -->
  <path d="M0 0 H1200 V250 C900 300, 300 300, 0 250 V0 Z" fill="#203A87"/>
  <path d="M0 0 H1200 V240 C900 290, 300 290, 0 240 V0 Z" fill="#152A61"/>

  <!-- Gold Border Top -->
  <rect x="0" y="0" width="1200" height="4" fill="#D5B93C"/>
  <rect x="0" y="246" width="1200" height="2" fill="#D5B93C"/>

  <!-- Certificate Title -->
  <text x="50%" y="120" font-family="Lexend, sans-serif" font-size="56" font-weight="bold" text-anchor="middle" fill="#FFFFFF">
    CERTIFICATE OF
  </text>
  <text x="50%" y="180" font-family="Lexend, sans-serif" font-size="42" text-anchor="middle" fill="#D5B93C">
    PARTICIPATION
  </text>

  <!-- Decorative Elements -->
  <circle cx="100" cy="150" r="60" fill="#152A61"/>
  <circle cx="100" cy="150" r="55" fill="#203A87"/>
  <circle cx="100" cy="150" r="40" fill="#D5B93C"/>
  <path d="M100 110 L120 170 L80 170 Z" fill="#FFFFFF"/> <!-- Star -->
  <path d="M100 190 L60 250 L140 250 Z" fill="#203A87"/> <!-- Bottom ribbon part 1 -->
  <path d="M100 190 L140 250 L180 190 Z" fill="#203A87"/> <!-- Bottom ribbon part 2 -->

  <!-- "THIS IS TO CERTIFY THAT" -->
  <text x="50%" y="320" font-family="Lexend, sans-serif" font-size="20" text-anchor="middle" fill="#0B142F">
    THIS IS TO CERTIFY THAT
  </text>

  <!-- Name Section -->
  <text x="50%" y="380" font-family="Lexend, sans-serif" font-size="48" font-weight="normal" text-anchor="middle" fill="#0B142F">
    ${escapeHtml(name)}
  </text>
  <line x1="30%" y1="390" x2="70%" y2="390" stroke="#CCCCCC" stroke-width="1"/>

  <!-- Participation text -->
  <text x="50%" y="450" font-family="Lexend, sans-serif" font-size="20" text-anchor="middle" fill="#0B142F">
    PARTICIPATED AT THE CONFERENCE:
  </text>

  <!-- Theme -->
  <text x="50%" y="500" font-family="Lexend, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#0B142F">
    "${escapeHtml(theme)}"
  </text>

  <!-- Date -->
  <text x="50%" y="540" font-family="Lexend, sans-serif" font-size="20" text-anchor="middle" fill="#0B142F">
    ON: ${date}
  </text>
  
  <!-- IAIIEA Logo (Text Representation) -->
  <g transform="translate(100, 650)">
    <text x="0" y="0" font-family="Lexend, sans-serif" font-size="24" font-weight="bold" fill="#0B142F">
      IAIIEA
    </text>
    <text x="0" y="30" font-family="Lexend, sans-serif" font-size="14" fill="#0B142F">
      International Association for Innovations
    </text>
    <text x="0" y="50" font-family="Lexend, sans-serif" font-size="14" fill="#0B142F">
      In Educational Assessment
    </text>
  </g>

  <!-- Signature Section -->
  <g transform="translate(800, 650)">
    <line x1="0" y1="0" x2="150" y2="0" stroke="#0B142F" stroke-width="1"/>
    <text x="75" y="25" font-family="Lexend, sans-serif" font-size="16" text-anchor="middle" fill="#0B142F">
      Signature
    </text>
    <line x1="0" y1="50" x2="150" y2="50" stroke="#0B142F" stroke-width="1"/>
    <text x="75" y="75" font-family="Lexend, sans-serif" font-size="16" text-anchor="middle" fill="#0B142F">
      President
    </text>
  </g>

  <!-- Bottom Pattern -->
  <rect x="0" y="780" width="1200" height="20" fill="#203A87"/>
  <path d="M0 780" fill="#D5B93C"/>
  <rect x="0" y="780" width="1200" height="20" fill="url(#pattern)"/>

  <!-- Certificate ID -->
  <text x="50%" y="760" font-family="Lexend, sans-serif" font-size="12" text-anchor="middle" fill="#0B142F" opacity="0.7">
    Certificate ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}
  </text>

  <!-- Definitions -->
  <defs>
    <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 0 L10 20 L20 0 Z" fill="#D5B93C"/>
    </pattern>
  </defs>
</svg>`;
};

const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateSection(2)) {
    try {
      if (!conferenceDetails) {
        showToast.error('Conference details not found');
        return;
      }

      if (!conferenceDetails.is_registered) {
        showToast.error('You must be registered for the conference to receive a certificate');
        return;
      }
      
      // Generate certificate with user's name, conference theme, and date
      const certificateSvg = generateCertificate(formData.name, conferenceDetails.theme, conferenceDetails.date);
      
      // Create download link
      const svgBlob = new Blob([certificateSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.name.replace(/\s+/g, '_')}_conference_certificate.svg`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      showToast.success('Thank you for your feedback! Certificate downloaded.');
      
      // Submit form data to your backend
      // await submitToBackend(formData);
      
    } catch (error) {
      showToast.error('Error generating certificate');
      console.error(error);
    }
  }
};
  


  const RadioOption: React.FC<{ 
    name: string; 
    value: string; 
    label: string; 
    checked: boolean; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  }> = ({ name, value, label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
        ${checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
      </div>
      <span className="text-gray-700">{label}</span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 py-4 px-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Conference Evaluation Form</h1>
          <p className="text-blue-100">Your feedback helps us improve future events</p>
        </div>
        
        {/* Progress indicator */}
        <div className="bg-blue-50 px-6 py-3 flex items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center 
            ${currentSection === 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}>
            1
          </div>
          <div className="h-1 w-12 bg-blue-200 mx-2"></div>
          <div className={`rounded-full w-8 h-8 flex items-center justify-center 
            ${currentSection === 2 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}>
            2
          </div>
          <div className="ml-4 text-sm text-blue-800">
            Section {currentSection} of 2
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {currentSection === 1 ? (
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Personal Information</h2>
                  <div>
                    <label className="block text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* How did you hear about the conference */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Conference Awareness</h2>
                  <div>
                    <label className="block text-gray-700 mb-3">How did you hear about this conference? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <RadioOption
                        name="hearAbout"
                        value="Email"
                        label="Email"
                        checked={formData.hearAbout === 'Email'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="hearAbout"
                        value="Social media"
                        label="Social media"
                        checked={formData.hearAbout === 'Social media'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="hearAbout"
                        value="Colleague"
                        label="Colleague"
                        checked={formData.hearAbout === 'Colleague'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="hearAbout"
                        value="Other"
                        label="Other"
                        checked={formData.hearAbout === 'Other'}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formData.hearAbout === 'Other' && (
                      <input
                        type="text"
                        name="otherSource"
                        value={formData.otherSource}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Conference Content */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Conference Content</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-3">How would you rate the overall quality of the conference content? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="contentQuality"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.contentQuality === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="contentQuality"
                        value="Good"
                        label="Good"
                        checked={formData.contentQuality === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="contentQuality"
                        value="Fair"
                        label="Fair"
                        checked={formData.contentQuality === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="contentQuality"
                        value="Poor"
                        label="Poor"
                        checked={formData.contentQuality === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">How relevant was the conference content to your work or interests? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <RadioOption
                        name="contentRelevance"
                        value="Very relevant"
                        label="Very relevant"
                        checked={formData.contentRelevance === 'Very relevant'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="contentRelevance"
                        value="Somewhat relevant"
                        label="Somewhat relevant"
                        checked={formData.contentRelevance === 'Somewhat relevant'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="contentRelevance"
                        value="Not relevant"
                        label="Not relevant"
                        checked={formData.contentRelevance === 'Not relevant'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">Which session did you find most beneficial? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <RadioOption
                        name="beneficialSession"
                        value="Plenary Session"
                        label="Plenary Session"
                        checked={formData.beneficialSession === 'Plenary Session'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="beneficialSession"
                        value="Parallel Session"
                        label="Parallel Session"
                        checked={formData.beneficialSession === 'Parallel Session'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="beneficialSession"
                        value="Workshop Session"
                        label="Workshop Session"
                        checked={formData.beneficialSession === 'Workshop Session'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="beneficialSession"
                        value="Tour Session"
                        label="Tour Session"
                        checked={formData.beneficialSession === 'Tour Session'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="beneficialSession"
                        value="Meal Session"
                        label="Meal Session"
                        checked={formData.beneficialSession === 'Meal Session'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="beneficialSession"
                        value="Variety Nights"
                        label="Variety Nights"
                        checked={formData.beneficialSession === 'Variety Nights'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="beneficialSession"
                        value="Thinking Outside the Box Session"
                        label="Thinking Outside the Box Session"
                        checked={formData.beneficialSession === 'Thinking Outside the Box Session'}
                        onChange={handleInputChange}
                      />
                    </div>
                    <textarea
                      name="beneficialSessionReason"
                      value={formData.beneficialSessionReason}
                      onChange={handleInputChange}
                      placeholder="Please explain why"
                      className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Speakers and Presenters */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Speakers and Presenters</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-3">How would you rate the knowledge and expertise of the speakers? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="speakerKnowledge"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.speakerKnowledge === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="speakerKnowledge"
                        value="Good"
                        label="Good"
                        checked={formData.speakerKnowledge === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="speakerKnowledge"
                        value="Fair"
                        label="Fair"
                        checked={formData.speakerKnowledge === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="speakerKnowledge"
                        value="Poor"
                        label="Poor"
                        checked={formData.speakerKnowledge === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">How would you rate the effectiveness of the speakers' presentations? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="presentationEffectiveness"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.presentationEffectiveness === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="presentationEffectiveness"
                        value="Good"
                        label="Good"
                        checked={formData.presentationEffectiveness === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="presentationEffectiveness"
                        value="Fair"
                        label="Fair"
                        checked={formData.presentationEffectiveness === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="presentationEffectiveness"
                        value="Poor"
                        label="Poor"
                        checked={formData.presentationEffectiveness === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <div></div> {/* Empty div for spacing */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next Section
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Logistics and Organization */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Logistics and Organization</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-3">How would you rate the organization of the conference? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="organizationRating"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.organizationRating === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="organizationRating"
                        value="Good"
                        label="Good"
                        checked={formData.organizationRating === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="organizationRating"
                        value="Fair"
                        label="Fair"
                        checked={formData.organizationRating === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="organizationRating"
                        value="Poor"
                        label="Poor"
                        checked={formData.organizationRating === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">How satisfied were you with the conference venue and facilities? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="venueSatisfaction"
                        value="Very satisfied"
                        label="Very satisfied"
                        checked={formData.venueSatisfaction === 'Very satisfied'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="venueSatisfaction"
                        value="Satisfied"
                        label="Satisfied"
                        checked={formData.venueSatisfaction === 'Satisfied'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="venueSatisfaction"
                        value="Neutral"
                        label="Neutral"
                        checked={formData.venueSatisfaction === 'Neutral'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="venueSatisfaction"
                        value="Dissatisfied"
                        label="Dissatisfied"
                        checked={formData.venueSatisfaction === 'Dissatisfied'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">How would you rate the registration process? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="registrationRating"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.registrationRating === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="registrationRating"
                        value="Good"
                        label="Good"
                        checked={formData.registrationRating === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="registrationRating"
                        value="Fair"
                        label="Fair"
                        checked={formData.registrationRating === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="registrationRating"
                        value="Poor"
                        label="Poor"
                        checked={formData.registrationRating === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Networking Opportunities */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Networking Opportunities</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-3">How satisfied were you with the networking opportunities provided? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="networkingSatisfaction"
                        value="Very satisfied"
                        label="Very satisfied"
                        checked={formData.networkingSatisfaction === 'Very satisfied'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="networkingSatisfaction"
                        value="Satisfied"
                        label="Satisfied"
                        checked={formData.networkingSatisfaction === 'Satisfied'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="networkingSatisfaction"
                        value="Neutral"
                        label="Neutral"
                        checked={formData.networkingSatisfaction === 'Neutral'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="networkingSatisfaction"
                        value="Dissatisfied"
                        label="Dissatisfied"
                        checked={formData.networkingSatisfaction === 'Dissatisfied'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Overall Experience */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Overall Experience</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-3">How would you rate your overall experience at the conference? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <RadioOption
                        name="overallExperience"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.overallExperience === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="overallExperience"
                        value="Good"
                        label="Good"
                        checked={formData.overallExperience === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="overallExperience"
                        value="Fair"
                        label="Fair"
                        checked={formData.overallExperience === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="overallExperience"
                        value="Poor"
                        label="Poor"
                        checked={formData.overallExperience === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">What is your most significant takeaway from the conference?</label>
                    <textarea
                      name="significantTakeaway"
                      value={formData.significantTakeaway}
                      onChange={handleInputChange}
                      placeholder="Your answer"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Do you have any suggestions for future conference themes or improvements?</label>
                    <textarea
                      name="futureSuggestions"
                      value={formData.futureSuggestions}
                      onChange={handleInputChange}
                      placeholder="Your answer"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Additional Comments */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Additional Comments</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Please provide any additional comments or feedback you have</label>
                    <textarea
                      name="additionalComments"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                      placeholder="Your answer"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Contact Information For Follow-Up */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-800 border-b pb-2">Contact Information For Follow-Up</h2>
                  
                  <div>
                    <label className="block text-gray-700 mb-3">Can we contact you for follow-up?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <RadioOption
                        name="contactForFollowUp"
                        value="Yes"
                        label="Yes"
                        checked={formData.contactForFollowUp === 'Yes'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="contactForFollowUp"
                        value="No"
                        label="No"
                        checked={formData.contactForFollowUp === 'No'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Previous Section
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit Evaluation
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConferenceEvaluationForm;