"use client"
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
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
    mostBeneficialSession: '',
    sessionExplanation: '',
    speakerKnowledge: '',
    speakerEffectiveness: '',
    
    // Section 2
    conferenceOrganization: '',
    venueSatisfaction: '',
    registrationProcess: '',
    networkingOpportunities: '',
    overallExperience: '',
    significantTakeaway: '',
    suggestions: '',
    additionalComments: '',
    contactFollowUp: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setShowError(false);
  };

  const RadioOption = ({ name, value, label, checked, onChange }) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer mb-2">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${checked ? 'border-[#203a87]' : 'border-gray-300'}`}>
          <div className={`w-3 h-3 rounded-full ${checked ? 'bg-[#203a87]' : 'bg-white'}`}></div>
        </div>
        <input 
          type="radio" 
          name={name} 
          value={value} 
          checked={checked} 
          onChange={onChange} 
          className="hidden" 
        />
        <span>{label}</span>
      </label>
    );
  };

  const validateSection = (section) => {
    if (section === 1) {
      // Basic validation for required fields in section 1
      return formData.hearAbout && 
             (formData.hearAbout !== 'Others' || formData.otherSource) &&
             formData.contentQuality &&
             formData.contentRelevance &&
             formData.mostBeneficialSession &&
             formData.speakerKnowledge &&
             formData.speakerEffectiveness;
    } else {
      // Basic validation for required fields in section 2
      return formData.conferenceOrganization &&
             formData.venueSatisfaction &&
             formData.registrationProcess &&
             formData.networkingOpportunities &&
             formData.overallExperience &&
             formData.contactFollowUp;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateSection(2)) {
      // Here you would typically submit to your backend
      alert("Form submitted successfully!");
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
            Conference Evaluation Form
          </h1>
          <p className="text-center mb-8">
            Section {currentSection} of 2
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
              <div className="space-y-8">
                {/* How did you hear about this conference? */}
                <div>
                  <label className="block mb-3 font-medium">
                    How did you hear about this conference?
                  </label>
                  <div className="space-y-1">
                    <RadioOption 
                      name="hearAbout" 
                      value="Email" 
                      label="Email" 
                      checked={formData.hearAbout === "Email"} 
                      onChange={handleInputChange} 
                    />
                    <RadioOption 
                      name="hearAbout" 
                      value="Social media" 
                      label="Social media" 
                      checked={formData.hearAbout === "Social media"} 
                      onChange={handleInputChange} 
                    />
                    <RadioOption 
                      name="hearAbout" 
                      value="Colleague" 
                      label="Colleague" 
                      checked={formData.hearAbout === "Colleague"} 
                      onChange={handleInputChange} 
                    />
                    <RadioOption 
                      name="hearAbout" 
                      value="Others" 
                      label="Others" 
                      checked={formData.hearAbout === "Others"} 
                      onChange={handleInputChange} 
                    />
                    {formData.hearAbout === "Others" && (
                      <input
                        type="text"
                        name="otherSource"
                        value={formData.otherSource}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className="w-full p-2 border rounded-md mt-2 ml-7"
                      />
                    )}
                  </div>
                </div>

                {/* Conference Content Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Conference Content</h2>
                  
                  {/* Content Quality */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      1. How would you rate the overall quality of the conference content?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="contentQuality" 
                        value="Excellent" 
                        label="Excellent" 
                        checked={formData.contentQuality === "Excellent"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="contentQuality" 
                        value="Good" 
                        label="Good" 
                        checked={formData.contentQuality === "Good"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="contentQuality" 
                        value="Fair" 
                        label="Fair" 
                        checked={formData.contentQuality === "Fair"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="contentQuality" 
                        value="Poor" 
                        label="Poor" 
                        checked={formData.contentQuality === "Poor"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Content Relevance */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      2. How relevant was the conference content to your work or interests?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="contentRelevance" 
                        value="Very relevant" 
                        label="Very relevant" 
                        checked={formData.contentRelevance === "Very relevant"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="contentRelevance" 
                        value="Somewhat relevant" 
                        label="Somewhat relevant" 
                        checked={formData.contentRelevance === "Somewhat relevant"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="contentRelevance" 
                        value="Not relevant" 
                        label="Not relevant" 
                        checked={formData.contentRelevance === "Not relevant"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Most Beneficial Session */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      3. Which session did you find most beneficial?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Plenary Session" 
                        label="Plenary Session" 
                        checked={formData.mostBeneficialSession === "Plenary Session"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Parallel Session" 
                        label="Parallel Session" 
                        checked={formData.mostBeneficialSession === "Parallel Session"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Workshop Session" 
                        label="Workshop Session" 
                        checked={formData.mostBeneficialSession === "Workshop Session"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Tour Session" 
                        label="Tour Session" 
                        checked={formData.mostBeneficialSession === "Tour Session"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Meal Session" 
                        label="Meal Session" 
                        checked={formData.mostBeneficialSession === "Meal Session"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Variety Nights" 
                        label="Variety Nights" 
                        checked={formData.mostBeneficialSession === "Variety Nights"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="mostBeneficialSession" 
                        value="Thinking Outside the Box Session" 
                        label="Thinking Outside the Box Session" 
                        checked={formData.mostBeneficialSession === "Thinking Outside the Box Session"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="mt-3">
                      <label className="block mb-2">Please explain why:</label>
                      <textarea
                        name="sessionExplanation"
                        value={formData.sessionExplanation}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Speakers and Presenters Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Speakers and Presenters</h2>
                  
                  {/* Speaker Knowledge */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      1. How would you rate the knowledge and expertise of the speakers?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="speakerKnowledge" 
                        value="Excellent" 
                        label="Excellent" 
                        checked={formData.speakerKnowledge === "Excellent"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="speakerKnowledge" 
                        value="Good" 
                        label="Good" 
                        checked={formData.speakerKnowledge === "Good"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="speakerKnowledge" 
                        value="Fair" 
                        label="Fair" 
                        checked={formData.speakerKnowledge === "Fair"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="speakerKnowledge" 
                        value="Poor" 
                        label="Poor" 
                        checked={formData.speakerKnowledge === "Poor"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Speaker Effectiveness */}
                  <div>
                    <label className="block mb-3">
                      2. How would you rate the effectiveness of the speakers' presentations?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="speakerEffectiveness" 
                        value="Excellent" 
                        label="Excellent" 
                        checked={formData.speakerEffectiveness === "Excellent"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="speakerEffectiveness" 
                        value="Good" 
                        label="Good" 
                        checked={formData.speakerEffectiveness === "Good"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="speakerEffectiveness" 
                        value="Fair" 
                        label="Fair" 
                        checked={formData.speakerEffectiveness === "Fair"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="speakerEffectiveness" 
                        value="Poor" 
                        label="Poor" 
                        checked={formData.speakerEffectiveness === "Poor"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowError(false)}
                    className="w-1/2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-1/2 bg-[#203a87] text-white py-2 rounded-md hover:bg-[#152a61] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Logistics and Organization Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Logistics and Organization</h2>
                  
                  {/* Conference Organization */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      1. How would you rate the organization of the conference?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="conferenceOrganization" 
                        value="Excellent" 
                        label="Excellent" 
                        checked={formData.conferenceOrganization === "Excellent"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="conferenceOrganization" 
                        value="Good" 
                        label="Good" 
                        checked={formData.conferenceOrganization === "Good"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="conferenceOrganization" 
                        value="Fair" 
                        label="Fair" 
                        checked={formData.conferenceOrganization === "Fair"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="conferenceOrganization" 
                        value="Poor" 
                        label="Poor" 
                        checked={formData.conferenceOrganization === "Poor"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Venue Satisfaction */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      2. How satisfied were you with the conference venue and facilities?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="venueSatisfaction" 
                        value="Very satisfied" 
                        label="Very satisfied" 
                        checked={formData.venueSatisfaction === "Very satisfied"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="venueSatisfaction" 
                        value="Satisfied" 
                        label="Satisfied" 
                        checked={formData.venueSatisfaction === "Satisfied"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="venueSatisfaction" 
                        value="Neutral" 
                        label="Neutral" 
                        checked={formData.venueSatisfaction === "Neutral"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="venueSatisfaction" 
                        value="Dissatisfied" 
                        label="Dissatisfied" 
                        checked={formData.venueSatisfaction === "Dissatisfied"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Registration Process */}
                  <div>
                    <label className="block mb-3">
                      3. How would you rate the registration process?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="registrationProcess" 
                        value="Excellent" 
                        label="Excellent" 
                        checked={formData.registrationProcess === "Excellent"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="registrationProcess" 
                        value="Good" 
                        label="Good" 
                        checked={formData.registrationProcess === "Good"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="registrationProcess" 
                        value="Fair" 
                        label="Fair" 
                        checked={formData.registrationProcess === "Fair"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="registrationProcess" 
                        value="Poor" 
                        label="Poor" 
                        checked={formData.registrationProcess === "Poor"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>

                {/* Networking Opportunities Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Networking Opportunities</h2>
                  
                  <div>
                    <label className="block mb-3">
                      How satisfied were you with the networking opportunities provided?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="networkingOpportunities" 
                        value="Very satisfied" 
                        label="Very satisfied" 
                        checked={formData.networkingOpportunities === "Very satisfied"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="networkingOpportunities" 
                        value="Satisfied" 
                        label="Satisfied" 
                        checked={formData.networkingOpportunities === "Satisfied"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="networkingOpportunities" 
                        value="Neutral" 
                        label="Neutral" 
                        checked={formData.networkingOpportunities === "Neutral"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="networkingOpportunities" 
                        value="Dissatisfied" 
                        label="Dissatisfied" 
                        checked={formData.networkingOpportunities === "Dissatisfied"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>

                {/* Overall Experience Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Overall Experience</h2>
                  
                  {/* Overall Rating */}
                  <div className="mb-6">
                    <label className="block mb-3">
                      1. How would you rate your overall experience at the conference?
                    </label>
                    <div className="space-y-1">
                      <RadioOption 
                        name="overallExperience" 
                        value="Excellent" 
                        label="Excellent" 
                        checked={formData.overallExperience === "Excellent"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="overallExperience" 
                        value="Good" 
                        label="Good" 
                        checked={formData.overallExperience === "Good"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="overallExperience" 
                        value="Fair" 
                        label="Fair" 
                        checked={formData.overallExperience === "Fair"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="overallExperience" 
                        value="Poor" 
                        label="Poor" 
                        checked={formData.overallExperience === "Poor"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  {/* Significant Takeaway */}
                  <div className="mb-6">
                    <label className="block mb-2">
                      2. What is your most significant takeaway from the conference?
                    </label>
                    <textarea
                      name="significantTakeaway"
                      value={formData.significantTakeaway}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  {/* Suggestions */}
                  <div>
                    <label className="block mb-2">
                      3. Do you have any suggestions for future conference themes or improvements?
                    </label>
                    <textarea
                      name="suggestions"
                      value={formData.suggestions}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                {/* Additional Comments Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Additional Comments</h2>
                  
                  <div>
                    <label className="block mb-2">
                      Please provide any additional comments or feedback you have:
                    </label>
                    <textarea
                      name="additionalComments"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information For Follow-Up</h2>
                  
                  <div>
                    <div className="space-y-1">
                      <RadioOption 
                        name="contactFollowUp" 
                        value="Yes" 
                        label="Yes" 
                        checked={formData.contactFollowUp === "Yes"} 
                        onChange={handleInputChange} 
                      />
                      <RadioOption 
                        name="contactFollowUp" 
                        value="No" 
                        label="No" 
                        checked={formData.contactFollowUp === "No"} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="w-1/2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Previous
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
    </div>
  );
};

export default ConferenceEvaluationForm;