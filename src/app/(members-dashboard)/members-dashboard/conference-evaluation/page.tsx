"use client"
import React, { useState } from 'react';
import CertificateGenerator from './CertificateGenerator';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ConferenceEvaluationForm = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [showError, setShowError] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userName, setUserName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    
    // Section 1
    hearAbout: '',
    otherSource: '',
    overallExperience: '',
    contentQuality: '',
    speakerEffectiveness: '',
    eventOrganization: '',
    
    // Section 2
    venue: '',
    technicalSetup: '',
    networkingOpportunities: '',
    recommendationLikelihood: '',
    futureTopics: '',
    additionalComments: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setShowError(false);
  };

  const validateSection = (section) => {
    if (section === 1) {
      return formData.name && 
             formData.email &&
             formData.hearAbout && 
             (formData.hearAbout !== 'Other' || formData.otherSource) &&
             formData.overallExperience &&
             formData.contentQuality;
    } else {
      return formData.venue &&
             formData.technicalSetup &&
             formData.networkingOpportunities &&
             formData.recommendationLikelihood;
    }
  };

  const handleNext = () => {
    if (validateSection(1)) {
      setCurrentSection(2);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateSection(2)) {
      // Here you would typically submit to your backend
      setUserName(formData.name);
      setShowCertificate(true);
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-5 p-4">
      <div className="bg-[#e9ebf3] w-full max-w-3xl rounded-xl shadow-lg">
        <div className="bg-[#203a87] relative w-full rounded-t-xl h-10" />
        <div className="px-6 md:px-10 pt-10 pb-14">
          <h1 className="text-2xl md:text-[42px] font-semibold text-center mb-4">
            Conference evaluation form
          </h1>
          <p className="text-center mb-8">
            Your feedback matters, help us improve future conference events.
          </p>

          {showError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required fields before proceeding.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentSection === 1 ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <label className="block mb-2">
                    Full Name (as it will appear on certificate) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Email (where we'll send your certificate) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    How did you hear about this conference? *
                  </label>
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select an option</option>
                    <option value="Email">Email</option>
                    <option value="Telegram">Telegram</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.hearAbout === 'Other' && (
                    <input
                      type="text"
                      name="otherSource"
                      value={formData.otherSource}
                      onChange={handleInputChange}
                      placeholder="Please specify"
                      className="w-full p-2 border rounded-md mt-2"
                    />
                  )}
                </div>

                <div>
                  <label className="block mb-2">
                    How would you rate your overall conference experience? *
                  </label>
                  <select
                    name="overallExperience"
                    value={formData.overallExperience}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    How would you rate the quality of the content presented? *
                  </label>
                  <select
                    name="contentQuality"
                    value={formData.contentQuality}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#203a87] text-white py-2 rounded-md hover:bg-[#152a61] transition-colors"
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">
                    How satisfied were you with the venue? *
                  </label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a rating</option>
                    <option value="Very Satisfied">Very Satisfied</option>
                    <option value="Satisfied">Satisfied</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Dissatisfied">Dissatisfied</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    How would you rate the technical setup and presentations? *
                  </label>
                  <select
                    name="technicalSetup"
                    value={formData.technicalSetup}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    How valuable were the networking opportunities? *
                  </label>
                  <select
                    name="networkingOpportunities"
                    value={formData.networkingOpportunities}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a rating</option>
                    <option value="Very Valuable">Very Valuable</option>
                    <option value="Valuable">Valuable</option>
                    <option value="Somewhat Valuable">Somewhat Valuable</option>
                    <option value="Not Valuable">Not Valuable</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    How likely are you to recommend this conference to others? *
                  </label>
                  <select
                    name="recommendationLikelihood"
                    value={formData.recommendationLikelihood}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a rating</option>
                    <option value="Very Likely">Very Likely</option>
                    <option value="Likely">Likely</option>
                    <option value="Unlikely">Unlikely</option>
                    <option value="Very Unlikely">Very Unlikely</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="w-1/2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#203a87] text-white py-2 rounded-md hover:bg-[#152a61] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificate && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Certificate</h2>
        <button
          onClick={() => setShowCertificate(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Certificate Generator */}
      <CertificateGenerator 
        userName={userName}
        onGenerate={setCertificateUrl}
      />
      
      {/* Certificate Preview */}
      <div className="mb-4">
        {certificateUrl ? (
          <img 
            src={certificateUrl} 
            alt="Your Certificate" 
            className="w-full h-auto shadow-lg rounded"
          />
        ) : (
          <div className="flex justify-center items-center h-64">
            <p>Generating certificate...</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.download = `${userName}-certificate.jpg`;
            link.href = certificateUrl;
            link.click();
          }}
          className="px-4 py-2 bg-[#203a87] text-white rounded hover:bg-[#152a61] transition-colors"
        >
          Download Certificate
        </button>
      </div>

      <div className="text-center text-gray-600 mt-4">
        <p>A copy of your certificate has been sent to your email.</p>
        <p>Please check your inbox (and spam folder) in the next few minutes.</p>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ConferenceEvaluationForm;