// components/ConferenceResources.tsx
import React from 'react';
import { VideoResourceCard } from './videoResourceCard';
import { DocumentResourceCard } from './DocumentResourceCard';

const videoResources = [
    {
        imageUrl: '/Meeting.png',
        duration: '1:12:00',
        title: 'Strategic Thinking for Effective Spiritual and Secular Leadership. Talk Presented by Dr Mike Egbayelo, PhD, FCIS, FICBC, FIMC'
    },
    {
        imageUrl: '/Meeting.png',
        duration: '0:45:30',
        title: 'Digital Transformation in Education: Embracing AI and Big Data Analytics by Prof. Sarah Johnson'
    },
    {
        imageUrl: '/Meeting.png',
        duration: '1:30:00',
        title: 'Future of Assessment: Integrating Technology with Traditional Methods by Dr. James Anderson'
    }
];

export const ConferenceResources: React.FC = () => {
    return (
        <div className='container mx-auto px-4'>
            <div className='pt-10'>
                <p className='text-[20px]'>Home {'>'} Conference Portal {'>'} <span className='font-[600]'>Conference Resources</span></p>
            </div>
            
            <div className='pt-6'>
                <h1 className='text-[35px] text-[#0B142F] font-[700] opacity-[0.8] pb-2'>Conference Resources</h1>
                
                <div className='mt-8'>
                    <h2 className='text-[24px] font-[600] mb-6'>Video Presentations</h2>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {videoResources.map((video, index) => (
                            <VideoResourceCard key={index} {...video} />
                        ))}
                    </div>
                </div>

                <div className='mt-12'>
                    <h2 className='text-[24px] font-[600] mb-6'>Conference Documents</h2>
                    <div className='space-y-6'>
                        <DocumentResourceCard
                            icon="/link-icon.svg"
                            title="Use of Digital Item Bank Platform for Development of Paper and Online Assessments"
                            link="https://www.figma.com/design/hMA4mUVyZ3gOu3MKjTQfrI/IAIIEA"
                            type="link"
                        />
                        <DocumentResourceCard
                            icon="/ppt-icon.svg"
                            title="Conference Keynote Presentation: Future of Educational Assessment"
                            link="Download PowerPoint Presentation (12MB)"
                            bgColor="bg-[#fff4e5]"
                            type="powerpoint"
                        />
                        <DocumentResourceCard
                            icon="/pdf-icon.svg"
                            title="Conference Proceedings and Research Papers"
                            link="Download PDF Document (8MB)"
                            bgColor="bg-[#ffe5e5]"
                            type="pdf"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};