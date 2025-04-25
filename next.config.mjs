/** @type {import('next').NextConfig} */ 
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'iaiiea.org',
      'api.dicebear.com',
      'res.cloudinary.com',
      'images.unsplash.com'
    ],
  },
};

export default nextConfig;