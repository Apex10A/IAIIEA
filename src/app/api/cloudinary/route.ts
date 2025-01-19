import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'your_conference_folder/', // Replace with your actual folder name
      max_results: 500
    });

    const imageUrls = result.resources.map(resource => resource.secure_url);
    res.status(200).json(imageUrls);
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}