import React from 'react'

const CertificateGenerator = () => {
  return (
    <div>CertificateGenerator</div>
  )
}

export default CertificateGenerator
// import React, { useEffect, useRef } from 'react';

// const CertificateGenerator = ({ userName, onGenerate }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const generateCertificate = async () => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');

//       // Load certificate template
//       const img = new Image();
//       img.crossOrigin = "Anonymous";
      
//       img.onload = () => {
//         // Set canvas dimensions to match template
//         canvas.width = img.width;
//         canvas.height = img.height;
        
//         // Draw certificate template
//         ctx.drawImage(img, 0, 0);
        
//         // Configure text style for name
//         ctx.font = '48px cursive';
//         ctx.fillStyle = '#000000';
//         ctx.textAlign = 'center';
        
//         // Add name to certificate (position calibrated for the template)
//         const nameY = canvas.height * 0.45; // Adjust this value to match template
//         ctx.fillText(userName, canvas.width / 2, nameY);
        
//         // Convert to data URL and trigger callback
//         const dataUrl = canvas.toDataURL('image/jpeg');
//         onGenerate(dataUrl);
//       };

//       // Load your certificate template
//       img.src = '/path-to-your-certificate-template.jpg'; // Update this path
//     };

//     if (userName) {
//       generateCertificate();
//     }
//   }, [userName, onGenerate]);

//   return <canvas ref={canvasRef} style={{ display: 'none' }} />;
// };

// export default CertificateGenerator;