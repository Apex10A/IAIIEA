'use client'
import React from 'react'
import "@/app/index.css"
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

const HistoryPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white py-5">
      {/* Back Button */}
    

      {/* History Content */}
      <section className="py-12 px-4 md:px-8 lg:px-14 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-14 pt-8">
        <Link href="/" className="inline-flex items-center text-[#0B142F] hover:text-[#D5B93C] transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
        <div className="container mx-auto max-w-4xl">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-[#0B142F] mb-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            History
          </motion.h1>

          <motion.div 
            className="prose prose-lg max-w-none text-[#0B142F]/80"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <p>
              The IAIIEA as it is fondly called is an international Association established based on the quest for innovations in educational assessment. The 9th day of October, 2018 was the day it was birthed at the registration ground of the Corporate Affairs Commission (CAC) Abuja, Nigeria under the auspices of the Federal Republic of Nigeria.
            </p>

            <h2 className="text-2xl font-bold text-[#0B142F] mt-8 mb-4">The Journey So Far</h2>

            <p>
              Prior to the inauguration of the Association, a book of reading had been written by seasoned scholastic researchers in honour of the Professor Emeritus, Rt. Rev. Prof. Jonathan-Ibeagha. The adorable and matchless book, entitled Innovations in Educational Assessment which encapsulated nineteen (19) scholarly articles was written by twenty-four (24) brilliant, seasoned and undaunted researchers who defied all odds to come out with an all-time relevant book of this worth.
            </p>

            <p>
              The book, "Innovations in Educational Assessment" was written with the ultimate aim of honouring the professor of note, Prof. Evans Jonathan-Ibeagha. It was edited by Dr. Ariyo, the pioneer president of the Association who himself was a one-time student of the said professor and an astutely shrewd physics educator, test developer, test measurement and assessment expert.
            </p>

            <p>
              The book was unveiled at the red-letter occasion and copies were distributed to the participants at the close of the meeting. Present at the epoch-making maiden meeting were about sixty-one (61) assessment experts and scholars of note. The Association stated as part of its mandate, three major goals which included:
            </p>

            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Human capacity building</li>
              <li>Innovations in educational assessment at all levels</li>
              <li>National and international cohesion</li>
            </ul>

            <p>
              These objectives are to be achieved through academic conferences, workshops, webinars, publications and annual conferences among others. Thus, the importance of IAIIEA in terms of providing training platform for its members on research procedures in educational assessment and practical training thereby offering its members the opportunity to acquire knowledge and experience on trends in educational assessment cannot be overemphasized.
            </p>

            <p>
              So far, between 2018 and 2021, the Association has published six (6) academic journals, two (2) academic books, and three (3) Conference Proceedings/Book of Abstracts. In 2019, the Association's annual conference was held in Nigeria at the Public Service Institute of Nigeria, Abuja from 11th – 15th November, 2019. It had in attendance of about fifty (50) participants.
            </p>

            <p>
              To the glory of God, in the year 2020, the scourge of the Corona-virus pandemic (COVID-19) did not hinder the annual conference of the Association, rather a new mode of meeting such as virtual meeting was adopted. IAIIEA had a wonderful five-day virtual brainstorming sessions. The conference was transmitted live and direct from Nigeria. It was indeed remarkable that the "young" IAIIEA despite its little strength could wade through the stormy seas of this global phenomenon from the 16th through 20th November, 2020.
            </p>

            <p>
              The Conference was attended by researchers from Nigeria, Ghana, Sierra Leone, Republic of Benin, Botswana, Uganda to mention but a few. There were not less than fifty-three (53) participants.
            </p>

            <h2 className="text-2xl font-bold text-[#0B142F] mt-8 mb-4">Conference Themes</h2>

            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Maiden edition (2018): Trends in Educational Assessment</li>
              <li>Second Annual Conference (2019): Technological Innovations In Educational Assessment</li>
              <li>Third Annual Conference (2020): Redesigning Educational Assessment for the 21st Century</li>
              <li>Fourth Annual Conference (2021): Assessment for the New Normal Times</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;