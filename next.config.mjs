/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Creates a standalone build
  images: {
    domains: [
      'iaiiea.org', 
      'res.cloudinary.com' // Add Cloudinary domain
    ],
  },
};

export default nextConfig;