// app/api/cloudinary/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export async function GET() {
  try {
    // Fetch resources from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'your_conference_folder/', // Replace with your actual folder name
      max_results: 500,
    });

    // Map the resources to their secure URLs
    const imageUrls = result.resources.map((resource: { secure_url: string }) => resource.secure_url);

    // Return response using NextResponse
    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}