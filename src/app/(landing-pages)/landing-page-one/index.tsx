
"use client"
import React from 'react'
import Image from 'next/image'
import CarouselLandingPage from "./CarouselLandingPage"
import Carousel from "@/modules/ui/carousel"
import { EmblaOptionsType } from 'embla-carousel'

interface Book {
    id: number
    name: string
    overview: string
    description: string
    image: string
    journalLink: string
  }
  
const index: React.FC = () => {
    const BooksData: Book[] = [
        {
          id: 1,
          name: "Educational Innovations",
          overview: "Journal of Innovations in Educational Assessment (JIEA)",
          description: "Vol. 1, No. 1, May, 2019",
          image: "/VolOne.png", // Replace with actual image paths
          journalLink: "https://example.com/journal1"
        },
        {
          id: 2,
          name: "Assessment Practices",
          overview: "Journal of Modern Educational Techniques",
          description: "Vol. 2, No. 1, June, 2020",
          image: "/VolTwo.png",
          journalLink: "https://example.com/journal2"
        },
        {
          id: 3,
          name: "Innovative Learning",
          overview: "International Journal of Learning Innovations",
          description: "Vol. 3, No. 2, July, 2021",
          image: "/VolThree.png",
          journalLink: "https://example.com/journal3"
        },
        {
          id: 4,
          name: "Digital Education",
          overview: "Journal of Digital Education",
          description: "Vol. 4, No. 3, August, 2022",
          image: "/VolFour.png",
          journalLink: "https://example.com/journal4"
        },
        {
          id: 5,
          name: "Higher Education Assessment",
          overview: "Journal of Higher Education",
          description: "Vol. 5, No. 4, September, 2023",
          image: "/VolFive.png",
          journalLink: "https://example.com/journal5"
        },
        {
          id: 6,
          name: "Educational Reforms",
          overview: "Journal of Educational Policy and Reforms",
          description: "Vol. 6, No. 5, October, 2024",
          image: "/VolOne.png",
          journalLink: "https://example.com/journal6"
        },
        {
          id: 7,
          name: "Learning Analytics",
          overview: "Journal of Learning Analytics",
          description: "Vol. 7, No. 6, November, 2025",
          image: "/VolTwo.png",
          journalLink: "https://example.com/journal7"
        },
        {
          id: 8,
          name: "Global Education Trends",
          overview: "Journal of Global Education",
          description: "Vol. 8, No. 7, December, 2026",
          image: "/VolThree.png",
          journalLink: "https://example.com/journal8"
        }
      ]

      const OPTIONS: EmblaOptionsType = {}
      const SLIDE_COUNT = 5
      const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  return (
    <div>
       <div>
       <CarouselLandingPage/>
       </div>
    <div className='md:px-14 px-10 min-h-screen flex justify-center'>
    <div className='lg:flex items-center justify-between gap-20'>
        <div className='flex items-center justify-between'>
        <div className=' transform '>
            <Image 
             src='/Frame 15.svg'
             alt=''
             className=''
             width={400}
             height={400}
            />
            </div>
            <div className='transform'>
            <Image 
             src='/Frame 15.svg'
             alt=''
             className=''
             width={400}
             height={400}
            />
            </div>
        </div>
        <div>
            <h1 className='text-[40px] lg:text-[60px] max-w-2xl font-[600] text-[#0B142F] leading-[60px] pb-3'>Who Are We</h1>
            <p className='text-[18px] text-[#0B142F] max-w-xl pb-3 opacity-[0.8]'>We&apos;re IAIIEA, your partner in educational excellence. 
            We are a community of passionate educators, researchers, and students dedicated to enhancing assessment practices in higher education</p>
            <p className='text-[18px] text-[#0B142F] max-w-xl opacity-[0.8]'>We are committed to supporting your growth,whether you&apos;re a student seeking to enhance your learning or an educator looking to refine your teaching practices.</p>
        </div>
    </div>
    </div>
    <div>
      <div className='flex lg:px-14 px-10 flex-col items-center justify-center min-h-screen pb-10'>
        <div>
          <h1 className='text-[40px] lg:text-[60px] max-w-2xl mb-7 font-[600] text-[#0B142F] leading-[60px]'>Publications</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {BooksData.map((book) => (
            <div key={book.id} className='flex flex-col items-center max-w-xl '>
              <div className='bg-[#E9EBF3] w-full rounded-t-2xl flex flex-col'>
              <Image 
                src={book.image}
                alt={book.name}
                width={250}
                height={250}
                className='mx-auto'
              />
              </div>
              <div className='border w-full rounded-b-2xl px-6 py-5'>
              <h2 className='text-[25px] font-[600] text-[#0B142F] pb-3'>{book.name}</h2>
              <p className='text-[17px] text-[#0B142F]'>{book.overview}</p>
              <p className='text-[17px] text-[#0B142F] '>{book.description}</p>
              <a 
                href={book.journalLink} 
                className='text-[#203A87] underline flex items-center mt-2'>
                View Journal <span className='ml-2'>&#x2192;</span>
              </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className='lg:flex md:px-14 px-5 flex-col min-h-screen  py-10 lg:py-20 bg-[#E9EBF3]'>
        <div className='flex items-center justify-center mb-10'>
            <h1 className='text-[40px] lg:text-[60px] max-w-2xl font-[500] text-[#0B142F] leading-[60px] pb-3'>Events</h1>
        </div>
        <div className='lg:flex gap-5 items-center justify-center'>
        <div className=''>
            <div className=''>
                <Image  
                  src='/Meeting.png'
                  alt=''
                  className=''
                  width={600}
                  height={400}
                  />
            </div>
            <div className='bg-[#fff] border w-full rounded-b-2xl px-7 pt-3 pb-8'>
                <h1 className='text-[#0B142F] text-[40px] font-[500]'>Conference 2024</h1>
                <p className='text-[#0B142F] text-[19px] font-[500] max-w-xl'>Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence</p>
                <p className='text-[#0B142F] text-[19px] font-[400] pt-2 pb-3'>Mon, Nov 2 -  Fri, Nov 8 </p>
                <button className='bg-[#203A87] px-7 py-3 rounded-3xl text-[#fff] font-[500]'>Register</button>
            </div>
        </div>
        <div className=''>
            <div className=''>
                <Image  
                  src='/Meeting.png'
                  alt=''
                  className=''
                  width={600}
                  height={400}
                  />
            </div>
            <div className='bg-[#fff] border w-full rounded-b-2xl px-7 pt-3 pb-8'>
                <h1 className='text-[#0B142F] text-[40px] font-[500]'>Conference 2024</h1>
                <p className='text-[#0B142F] text-[19px] font-[500] max-w-xl'>Transforming Learning and Assessment Through the Application of Big Data and Artificial Intelligence</p>
                <p className='text-[#0B142F] text-[19px] font-[400] pt-2 pb-3'>Mon, Nov 2 -  Fri, Nov 8 </p>
                <button className='bg-[#203A87] px-7 py-3 rounded-3xl text-[#fff] font-[500]'>Register</button>
            </div>
        </div>
        </div>
    </div>
    </div>
  )
}

export default index