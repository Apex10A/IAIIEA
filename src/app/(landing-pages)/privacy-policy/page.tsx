'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1A3D] to-[#203A87] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#203A87] p-6 sm:p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold mb-2"
              >
                Privacy Policy
              </motion.h1> 
              <p className="text-blue-100">Last updated: March 6, 2024</p>
            </div>
            <Link 
              href="/" 
              className="text-sm bg-white text-[#203A87] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-gray-700">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose max-w-none"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Table of Contents</h2>
            <ul className="mb-8 space-y-2">
              <li><a href="#introduction" className="text-[#203A87] hover:underline">Introduction</a></li>
              <li><a href="#collection" className="text-[#203A87] hover:underline">Collection of Information</a></li>
              <li><a href="#cookies" className="text-[#203A87] hover:underline">Cookie/Tracking Technology</a></li>
              <li><a href="#distribution" className="text-[#203A87] hover:underline">Distribution of Information</a></li>
              <li><a href="#security" className="text-[#203A87] hover:underline">Commitment to Data Security</a></li>
              <li><a href="#contact" className="text-[#203A87] hover:underline">Privacy Contact Information</a></li>
            </ul>

            <section id="introduction" className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Introduction</h2>
              <p className="mb-4">
                Thank you for visiting our web site. The following privacy policy tells you how we use personal information collected at this site. Please read this privacy policy before using the site or submitting any personal information.
              </p>
              <p>
                By using the site, you are accepting the practices described in this privacy policy. These practices may be changed, but any changes will be posted and changes will only apply to activities and information on a going forward, not retroactive basis. You are encouraged to review the privacy policy whenever you visit the site to make sure that you understand how any personal information you provide will be used.
              </p>
            </section>

            <section id="collection" className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Collection of Information</h2>
              <p>
                We collect personally identifiable information, like names, postal addresses, email addresses, etc., when voluntarily submitted by our visitors. The information you provide is used to fulfill your specific request. This information is only used to fulfill your specific request, unless you give us permission to use it in another manner, for example to add you to one of our mailing lists.
              </p>
            </section>

            <section id="cookies" className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Cookie/Tracking Technology</h2>
              <p className="mb-4">
                The Site may use cookie and tracking technology depending on the features offered. Cookie and tracking technology are useful for gathering information such as browser type and operating system, tracking the number of visitors to the Site, and understanding how visitors use the Site.
              </p>
              <p>
                Cookies can also help customize the Site for visitors. Personal information cannot be collected via cookies and other tracking technology, however, if you previously provided personally identifiable information, cookies may be tied to such information. Aggregate cookie and tracking information may be shared with third parties.
              </p>
            </section>

            <section id="distribution" className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Distribution of Information</h2>
              <p className="mb-4">
                We may share information with governmental agencies or other companies assisting us in fraud prevention or investigation. We may do so when:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Permitted or required by law; or,</li>
                <li>Trying to protect against or prevent actual or potential fraud or unauthorized transactions; or,</li>
                <li>Investigating fraud which has already taken place.</li>
              </ol>
              <p>
                The information is not provided to these companies for marketing purposes.
              </p>
            </section>

            <section id="security" className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Commitment to Data Security</h2>
              <p className="mb-4">
                Your personally identifiable information is kept secure. Only authorized employees have access to this information.
              </p>
              <p>
                All emails and newsletters from this site allow you to opt-out of further mailings.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B142F] mb-4">Privacy Contact Information</h2>
              <p className="mb-4">
                If you have any questions, concerns, or comments about our privacy policy you may contact us.
              </p>
              <p>
                We reserve the right to make changes to this policy. Any changes to this policy will be posted.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Updated on: 2024-Mar-06</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}