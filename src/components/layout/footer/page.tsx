'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface WebData {
  logo: string;
  logo2: string;
  short_name: string;
  full_name: string;
  phone_numbers: string[];
  email: string;
  address: string;
}

const STATIC_FOOTER: WebData = {
  logo: '',
  logo2: '',
  short_name: 'IAIIEA',
  full_name: 'International Association for Innovations in Educational Assessment',
  phone_numbers: [],
  email: '',
  address: '',
};

const programmeLinks = [
  { title: 'All programmes', href: '/programmes' },
  { title: 'Conference', href: '/conference' },
  { title: 'Seminars', href: '/seminars' },
];

const siteLinks = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'How to Join', href: '/how-to-join' },
  { title: 'Register', href: '/register' },
];

const legalLinks = [{ title: 'Privacy Policy', href: '/privacy-policy' }];

const Footer = () => {
  const [webData, setWebData] = useState<WebData | null>(null);

  useEffect(() => {
    const fetchWebData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/web_data`);
        if (!response.ok) return;
        const result = await response.json();
        if (result?.data) {
          setWebData(result.data);
        }
      } catch {
        // Fall back to static footer content without surfacing a toast on every visit.
      }
    };

    fetchWebData();
  }, []);

  const display = webData ?? STATIC_FOOTER;
  const phones = display.phone_numbers?.[0]?.split(' ').filter(Boolean) ?? [];

  return (
    <footer className="bg-[#0B142F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="block">
              {display.logo2 ? (
                <Image
                  src={display.logo2}
                  alt={display.short_name}
                  width={200}
                  height={80}
                  className="w-auto h-20"
                />
              ) : (
                <span className="text-2xl font-bold text-[#D5B93C]">{display.short_name}</span>
              )}
            </Link>
            <div className="space-y-3">
              <p className="text-sm font-medium leading-relaxed">{display.full_name}</p>
              {phones.length > 0 && (
                <div className="space-y-2">
                  {phones.map((phone) => (
                    <p key={phone} className="text-sm text-gray-300">
                      {phone}
                    </p>
                  ))}
                </div>
              )}
              {display.address && (
                <p className="text-sm text-gray-300">{display.address}</p>
              )}
              {display.email && (
                <a
                  href={`mailto:${display.email}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {display.email}
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programmes</h3>
            <div className="space-y-3">
              {programmeLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Explore</h3>
            <div className="space-y-3">
              {siteLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <div className="space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-300">
            © {new Date().getFullYear()} {display.short_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
