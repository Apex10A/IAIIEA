interface CertificateProps {
    name: string;
    conferenceTitle: string;
    conferenceTheme: string;
    date: string;
  }
  
  const Certificate: React.FC<CertificateProps> = ({
    name,
    conferenceTitle,
    conferenceTheme,
    date,
  }) => {
    return (
      <div className="relative w-full max-w-4xl mx-auto bg-white shadow-lg">
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 1003 757"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="border border-gray-200"
        >
          {/* Background */}
          <rect x="1" y="1" width="1001" height="755" fill="#FFFDF7" />
          <rect
            x="1"
            y="1"
            width="1001"
            height="755"
            stroke="#D5B93C"
            strokeWidth="2"
            strokeDasharray="250 250"
          />
  
          {/* Conference Title */}
          <text
            x="50%"
            y="140"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            fill="#203A87"
            fontFamily="Arial"
          >
            CERTIFICATE OF PARTICIPATION
          </text>
  
          {/* Presented To */}
          <text
            x="50%"
            y="200"
            textAnchor="middle"
            fontSize="24"
            fill="#0B142F"
            fontFamily="Arial"
          >
            This is to certify that
          </text>
  
          {/* Participant Name */}
          <text
            x="50%"
            y="250"
            textAnchor="middle"
            fontSize="36"
            fontWeight="bold"
            fill="#D5B93C"
            fontFamily="Arial"
          >
            {name}
          </text>
  
          {/* Participation Text */}
          <text
            x="50%"
            y="300"
            textAnchor="middle"
            fontSize="20"
            fill="#0B142F"
            fontFamily="Arial"
          >
            has successfully participated in the
          </text>
  
          {/* Conference Title */}
          <text
            x="50%"
            y="350"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="#203A87"
            fontFamily="Arial"
          >
            {conferenceTitle}
          </text>
  
          {/* Conference Theme */}
          <text
            x="50%"
            y="400"
            textAnchor="middle"
            fontSize="20"
            fill="#0B142F"
            fontFamily="Arial"
          >
            with the theme: "{conferenceTheme}"
          </text>
  
          {/* Date */}
          <text
            x="50%"
            y="500"
            textAnchor="middle"
            fontSize="18"
            fill="#0B142F"
            fontFamily="Arial"
          >
            Held on {date}
          </text>
  
          {/* Signatures */}
          <text
            x="250"
            y="650"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#203A87"
            fontFamily="Arial"
          >
            __________________________
            <tspan x="250" dy="30">
              Conference Director
            </tspan>
          </text>
  
          <text
            x="750"
            y="650"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#203A87"
            fontFamily="Arial"
          >
            __________________________
            <tspan x="750" dy="30">
              President
            </tspan>
          </text>
        </svg>
      </div>
    );
  };

  export default Certificate;