"use client"
import React, { useState } from "react";
import { Check, Download, Loader2, ArrowLeft } from "lucide-react";
import Certificate from "@/app/(cerificate)/cert/page";
import { showToast } from "@/components/ui/toast";


const EvaluationForm: React.FC = () => {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState("");
    const [showCertificate, setShowCertificate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowCertificate(true);
        showToast.success("Evaluation submitted successfully!");
      }, 1500);
    };
  
    if (showCertificate) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Certificate</h1>
            <button
              onClick={() => setShowCertificate(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to evaluation
            </button>
          </div>
          
          <Certificate
            name={name}
            conferenceTitle="Annual Tech Conference 2023"
            conferenceTheme="Innovation in the Digital Age"
            date="November 15-17, 2023"
          />
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Conference Evaluation</h1>
          <p className="text-gray-600 mb-6">
            Please share your feedback about the conference. Your input helps us improve future events.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">{rating} out of 5</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="What did you like about the conference? What could be improved?"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !name}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Evaluation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  export default EvaluationForm;