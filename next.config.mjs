/** @type {import('next').NextConfig} */ 
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'iaiiea.org',
      'res.cloudinary.com'
    ],
  },
};

export default nextConfig;