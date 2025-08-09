// Dummy data for testing different scenarios
export const getDummyData = (type: 'free' | 'paid' | 'error'): any => {
  if (type === 'error') {
    return null;
  }

  const baseData = {
    id: type === 'free' ? 206 : 204,
    is_registered: false,
    current_plan: null,
    title: type === 'free' ? "Free Digital Marketing Workshop" : "Advanced Investment Strategies Seminar 2025",
    theme: type === 'free' ? "Mastering Social Media Marketing" : "Building Wealth Through Smart Investments",
    venue: type === 'free' ? "Virtual Conference Room" : "Lagos Business Hub, Victoria Island",
    date: "March 15, 2025 To March 17, 2025",
    start_date: "2025-03-15",
    start_time: "10:00:00",
    sub_theme: type === 'free' ? [
      "Understanding Social Media Algorithms",
      "Content Creation Strategies",
      "Building Brand Awareness Online"
    ] : [
      "Portfolio Diversification Techniques",
      "Risk Management in Volatile Markets",
      "Emerging Investment Opportunities",
      "Tax-Efficient Investment Strategies"
    ],
    work_shop: type === 'free' ? [
      "Hands-on Instagram Marketing",
      "Facebook Ads Workshop",
      "LinkedIn for Business Growth"
    ] : [
      "Stock Analysis Workshop",
      "Real Estate Investment Planning",
      "Cryptocurrency Investment Basics"
    ],
    speakers: [
      {
        name: type === 'free' ? "Sarah Johnson" : "Dr. Michael Chen",
        title: type === 'free' ? "Digital Marketing Expert" : "Investment Strategist",
        portfolio: type === 'free' ? "Social Media Consultant with 10+ years experience" : "Former Goldman Sachs Analyst, Author of 'Smart Investing'",
        picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: type === 'free' ? "Alex Rodriguez" : "Jennifer Williams",
        title: type === 'free' ? "Content Creator" : "Portfolio Manager",
        portfolio: type === 'free' ? "YouTube Creator with 2M+ subscribers" : "Managing Director at Wealth Management Firm",
        picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: type === 'free' ? "Maria Garcia" : "Robert Thompson",
        title: type === 'free' ? "Brand Strategist" : "Financial Advisor",
        portfolio: type === 'free' ? "Brand consultant for Fortune 500 companies" : "Certified Financial Planner with 15+ years experience",
        picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      }
    ],
    mode: type === 'free' ? "Virtual" : "Hybrid",
    is_free: type === 'free' ? "free" : "paid",
    status: "Upcoming",
    resources: [
      {
        resource_id: 1,
        resource_type: "PDF",
        caption: type === 'free' ? "Social Media Marketing Guide" : "Investment Planning Handbook",
        date: "2025-03-10",
        file: "https://example.com/sample.pdf"
      },
      {
        resource_id: 2,
        resource_type: "Video",
        caption: type === 'free' ? "Getting Started with Digital Marketing" : "Market Analysis Techniques",
        date: "2025-03-12",
        file: "https://example.com/sample-video.mp4"
      },
      {
        resource_id: 3,
        resource_type: "Docx",
        caption: type === 'free' ? "Content Calendar Template" : "Investment Portfolio Template",
        date: "2025-03-14",
        file: "https://example.com/template.docx"
      }
    ]
  };

  if (type === 'free') {
    return {
      ...baseData,
      payments: {
        virtual_fee_naira: 0,
        virtual_fee_usd: 0,
        physical_fee_naira: 0,
        physical_fee_usd: 0
      }
    };
  } else {
    return {
      ...baseData,
      payments: {
        // New structure
        virtual_fee_naira: 150000,
        virtual_fee_usd: 99,
        physical_fee_naira: 225000,
        physical_fee_usd: 149,
        // Legacy structure for backward compatibility
        basic: {
          virtual: { usd: "99", naira: "150000" },
          physical: { usd: "149", naira: "225000" },
          package: [
            "Digital seminar materials",
            "Certificate of completion",
            "Access to recorded sessions"
          ]
        },
        standard: {
          virtual: { usd: "199", naira: "300000" },
          physical: { usd: "299", naira: "450000" },
          package: [
            "Everything in Basic",
            "1-on-1 consultation session",
            "Premium resource pack",
            "Networking session access"
          ]
        },
        premium: {
          virtual: { usd: "399", naira: "600000" },
          physical: { usd: "599", naira: "900000" },
          package: [
            "Everything in Standard",
            "VIP networking dinner",
            "Personal investment review",
            "6-month follow-up support",
            "Exclusive masterclass access"
          ]
        }
      }
    };
  }
};