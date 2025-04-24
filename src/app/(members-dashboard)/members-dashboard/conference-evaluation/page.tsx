"use client"
import React, { useState } from 'react';
import "@/app/index.css";
import { AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ConferenceEvaluationForm = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1
    hearAbout: '',
    otherSource: '',
    contentQuality: '',
    contentRelevance: '',
    beneficialSession: '',
    beneficialSessionReason: '',
    speakerKnowledge: '',
    speakerEffectiveness: '',
    
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
      return formData.hearAbout && 
             (formData.hearAbout !== 'Others' || formData.otherSource) &&
             formData.contentQuality &&
             formData.contentRelevance &&
             formData.beneficialSession &&
             formData.speakerKnowledge &&
             formData.speakerEffectiveness;
    } else {
      return formData.organizationRating &&
             formData.venueSatisfaction &&
             formData.registrationRating &&
             formData.networkingSatisfaction &&
             formData.overallExperience;
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

  const handlePrevious = () => {
    setCurrentSection(1);
    setShowError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateSection(2)) {
      // Here you would typically submit to your backend
      console.log('Form submitted:', formData);
      alert('Thank you for your feedback!');
    } else {
      setShowError(true);
    }
  };

  const RadioOption = ({ name, value, label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className={`w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center ${checked ? 'bg-blue-500' : 'bg-white'}`}>
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
    <div className="flex flex-col items-center justify-center my-5 p-4">
      <div className="bg-[#e9ebf3] w-full max-w-3xl rounded-xl shadow-lg">
        <div className="bg-[#203a87] relative w-full rounded-t-xl h-10 flex items-center justify-center">
          <div className="text-white font-medium">
            Section {currentSection} of 2
          </div>
        </div>
        
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentSection === 1 ? (
              <div className="space-y-8">
                {/* How did you hear about the conference */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#203a87]">How did you hear about this conference?</h2>
                  <div className="space-y-2">
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
                      value="Others"
                      label="Others"
                      checked={formData.hearAbout === 'Others'}
                      onChange={handleInputChange}
                    />
                    {formData.hearAbout === 'Others' && (
                      <input
                        type="text"
                        name="otherSource"
                        value={formData.otherSource}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className="w-full p-2 border rounded-md mt-2 ml-8"
                      />
                    )}
                  </div>
                </div>

                {/* Conference Content */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#203a87]">Conference Content</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">1. How would you rate the overall quality of the conference content?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">2. How relevant was the conference content to your work or interests?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">3. Which session did you find most beneficial?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                      className="w-full p-2 border rounded-md mt-2"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Speakers and Presenters */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#203a87]">Speakers and Presenters</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">1. How would you rate the knowledge and expertise of the speakers?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">2. How would you rate the effectiveness of the speakers' presentations?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <RadioOption
                        name="speakerEffectiveness"
                        value="Excellent"
                        label="Excellent"
                        checked={formData.speakerEffectiveness === 'Excellent'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="speakerEffectiveness"
                        value="Good"
                        label="Good"
                        checked={formData.speakerEffectiveness === 'Good'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="speakerEffectiveness"
                        value="Fair"
                        label="Fair"
                        checked={formData.speakerEffectiveness === 'Fair'}
                        onChange={handleInputChange}
                      />
                      <RadioOption
                        name="speakerEffectiveness"
                        value="Poor"
                        label="Poor"
                        checked={formData.speakerEffectiveness === 'Poor'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center bg-[#203a87] text-white py-2 px-6 rounded-md hover:bg-[#152a61] transition-colors"
                  >
                    Next <ChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Logistics and Organization */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#203a87]">Logistics and Organization</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">1. How would you rate the organization of the conference?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">2. How satisfied were you with the conference venue and facilities?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">3. How would you rate the registration process?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#203a87]">Networking Opportunities</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">How satisfied were you with the networking opportunities provided?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#203a87]">Overall Experience</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">1. How would you rate your overall experience at the conference?</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">2. What is your most significant takeaway from the conference?</h3>
                    <textarea
                      name="significantTakeaway"
                      value={formData.significantTakeaway}
                      onChange={handleInputChange}
                      placeholder="Your answer"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">3. Do you have any suggestions for future conference themes or improvements?</h3>
                    <textarea
                      name="futureSuggestions"
                      value={formData.futureSuggestions}
                      onChange={handleInputChange}
                      placeholder="Your answer"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Additional Comments */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#203a87]">Additional Comments</h2>
                  <textarea
                    name="additionalComments"
                    value={formData.additionalComments}
                    onChange={handleInputChange}
                    placeholder="Please provide any additional comments or feedback you have"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>

                {/* Contact Information For Follow-Up */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[#203a87]">Contact Information For Follow-Up</h2>
                  <div className="space-y-2">
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

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center justify-center bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <ChevronLeft className="mr-2" /> Previous
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-[#203a87] text-white py-2 px-6 rounded-md hover:bg-[#152a61] transition-colors"
                  >
                    Submit
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