'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { showToast } from '@/utils/toast';

interface WebData {
  logo: string;
  logo2: string;
  short_name: string;
  full_name: string;
  phone_numbers: string[];
  email: string;
  address: string;
}

const Footer = () => {
  const [webData, setWebData] = useState<WebData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/web_data`); 
        if (!response.ok) throw new Error('Failed to fetch web data');
        const result = await response.json();
        setWebData(result?.data);
      } catch (error) {
        showToast.error('Failed to load footer data');
      } finally {
        setLoading(false);
      }
    };

    fetchWebData();
  }, []);

  const usefulLinks = [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/about' },
    // { title: 'Services', href: '/services' },
    // { title: 'Contact', href: '/contact' },
  ];

  const additionalLinks = [
    { title: 'Privacy Policy', href: '/privacy-policy' },
    // { title: 'Terms of Service', href: '/terms' },
    // { title: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="bg-[#0B142F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Link href="/" className="block">
              {webData?.logo2 && (
                <Image
                  src={webData?.logo2}
                  alt={webData?.short_name}
                  width={200}
                  height={80}
                  className="w-auto h-20"
                />
              )}
            </Link>
            <div className="space-y-3">
              <p className="text-sm font-medium">{webData?.full_name}</p>
              <div className="space-y-2">
                {webData?.phone_numbers?.[0].split(' ').map((phone, index) => (
                  <p key={index} className="text-sm text-gray-300">
                    {phone}
                  </p>
                ))}
              </div>
              <p className="text-sm text-gray-300">{webData?.address}</p>
              <p className="text-sm text-gray-300">{webData?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Useful Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {usefulLinks.map((link) => (
                  <Link
                    key={link?.title}
                    href={link?.href}
                    className="block text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link?.title}
                  </Link>
                ))}
              </div>
              <div className="space-y-3">
                {additionalLinks.map((link) => (
                  <Link
                    key={link?.title}
                    href={link?.href}
                    className="block text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link?.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-300">
              Subscribe to our newsletter for the latest updates and news.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-[#1a2544] border border-gray-600 rounded-md focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white text-[#0B142F] rounded-md hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-300">
            © {new Date().getFullYear()} {webData?.short_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;