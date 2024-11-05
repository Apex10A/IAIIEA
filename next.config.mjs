/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Creates a standalone build
    images: {
      domains: ['iaiiea.org'], // Add your domain
    },
  };
  
  export default nextConfig;
  