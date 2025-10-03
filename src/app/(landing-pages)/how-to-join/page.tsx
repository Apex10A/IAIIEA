"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaArrowLeft,
  FaClipboardList,
  FaCreditCard,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaProjectDiagram,
} from "react-icons/fa";

// This page uses Tailwind and Framer Motion to keep visual language consistent
// with the rest of the site (colors: #0B142F / #0E1A3D primary, #D5B93C accent).

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const steps = [
  {
    title: "Complete the Membership Form",
    description: (
      <>
        Fill out our online application form with your details. {" "}
        <a
          href="https://iaiiea.vercel.app/register"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D5B93C] underline hover:text-[#b89d2f]"
        >
          https://iaiiea.vercel.app/register
        </a>
      </>
    ),
    icon: <FaClipboardList className="text-[#D5B93C]" size={22} />,
  },
  {
    title: "Pay Membership Fees",
    description:
      "Secure your membership by paying the annual subscription through our secure payment portal.",
    icon: <FaCreditCard className="text-[#D5B93C]" size={22} />,
  },
  {
    title: "Confirmation & Welcome",
    description:
      "Once your application is approved, you will receive a welcome email and certificate and gain access to all member benefits.",
    icon: <FaEnvelopeOpenText className="text-[#D5B93C]" size={22} />,
  },
];

const benefits = [
  "Share experiences and best practices in educational assessment",
  "Acquire practical knowledge in test construction, psychometrics, and related assessment fields",
  "Develop and access innovative software for item analysis and calibrations",
  "Participate in capacity-building programs, workshops, and professional development sessions",
  "Exchange new ideas on assessment with a network of like-minded professionals",
  "Enjoy global connectivity and collaborations with experts worldwide",
  "Engage in intensive training on innovative educational assessment, research management, and related areas",
  "Upskill by exploring modern technological tools for learning, teaching, assessment, and research",
  "Receive a Membership Certificate with a unique identification number (UIN)",
  "Access valuable resources and materials from educational conferences, webinars, and workshops attended",
];

const eligibility = [
  "Teachers",
  "Lecturers",
  "Professors",
  "Researchers",
  "Postgraduate Students",
  "Evaluators",
  "Item Writers/Developers",
  "Psychometricians",
  "Software Developers",
  "ICT Specialists",
  "Medical Educators",
  "Education Professionals",
  "Corporate Bodies",
];

const milestones = [
  {
    year: "2018",
    text:
      "Maiden edition of the association’s annual conference with the theme ‘Trends in Educational Assessment’.",
  },
  {
    year: "2019",
    text:
      "First international conference held, creating a platform for dialogue on innovations in assessment.",
  },
  {
    year: "2020",
    text:
      "Introduction of Webinar and virtual participation at conferences — theme: ‘Redesigning Educational Assessment for the 21st Century’.",
  },
  {
    year: "2021",
    text:
      "Both virtual and onsite participation introduced — theme: ‘Assessment for the New Normal Times’.",
  },
  { year: "2022", text: "Expanded reach beyond Africa to Asia and other continents." },
  {
    year: "2023",
    text:
      "Launched the book on Big Data at Anchor University, Lagos; organized a teachers' conference.",
  },
  {
    year: "2024",
    text:
      "Collaborated with UBEC for the annual conference — theme: ‘Transforming Learning and Assessment Through Application of Big Data and Artificial Intelligence’.",
  },
  {
    year: "2025",
    text:
      "Organized workshops in 3 geopolitical zones of Nigeria; annual conference on ‘Assessment in the Age of Artificial Intelligence’.",
  },
];

export default function HowToJoinPage() {
  return (
    <div className="bg-white">
      {/* Back link */}
      <div className="container mx-auto px-4 md:px-8 lg:px-14 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#0B142F] hover:text-[#D5B93C] transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 bg-[#D5B93C]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 bg-[#0E1A3D]/20 rounded-full blur-3xl" />
        </div>

        <div className="bg-gradient-to-b from-[#0E1A3D] via-[#0B142F] to-[#0B142F]">
          <div className="container mx-auto px-4 md:px-8 lg:px-14 py-14 md:py-20">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-3xl md:text-5xl font-extrabold text-white text-center"
            >
              Join IAIIEA
            </motion.h1>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-4 max-w-3xl mx-auto text-center text-white/80"
            >
              Become part of a global community advancing innovation in testing,
              measurement, exams, and assessment across education and industry.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <Link href="/register">
                <button className="rounded-lg bg-[#D5B93C] px-6 py-3 text-[#0E1A3D] font-semibold shadow-sm hover:bg-[#c8ad36] transition-colors">
                  Become a Member
                </button>
              </Link>
              <a
                href="#steps"
                className="rounded-lg border-2 border-white/30 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                How it works
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-10 md:py-14 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold text-[#0B142F] text-center"
          >
            Who Can Join?
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-3 text-center text-[#0B142F]/80 max-w-4xl mx-auto"
          >
            Anyone working in the field of testing, measurement, exams, and assessment—regardless of
            affiliation, discipline, or faculty. Individuals and corporate entities are welcome.
          </motion.p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {eligibility.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#D5B93C]/40 bg-[#D5B93C]/10 px-3 py-1 text-sm text-[#0B142F]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-10 md:py-14 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold text-[#0B142F] text-center"
          >
            Steps to Join
          </motion.h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D5B93C] text-[#0E1A3D] font-bold shadow">
                  {idx + 1}
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">{step.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B142F]">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#0B142F]/80">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 md:py-14 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold text-[#0B142F] text-center"
          >
            Membership Benefits
          </motion.h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D5B93C]/20">
                  <FaCheckCircle className="text-[#D5B93C]" />
                </span>
                <p className="text-[#0B142F]/90">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-10 md:py-14 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold text-[#0B142F] text-center"
          >
            Our Journey So Far
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-3 text-[#0B142F]/80 text-center max-w-4xl mx-auto"
          >
            Since its establishment on October 9, 2018, IAIIEA has remained committed to advancing innovation,
            learning, and assessment across education and professional practice.
          </motion.p>

          <div className="mt-8 space-y-6">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative pl-20"
              >
                {/* Line */}
                <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-[#D5B93C] to-transparent" />
                {/* Year Bubble */}
                <div className="absolute left-4 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D5B93C] to-[#c3a831] text-[#0E1A3D] font-bold shadow-md">
                  {m.year}
                </div>
                {/* Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-[#0B142F]/90">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-10 md:py-14 px-4 md:px-8 lg:px-14 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold text-[#0B142F] text-center"
          >
            Our Impact
          </motion.h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              icon: <FaChalkboardTeacher className="text-[#D5B93C]" size={22} />,
              title: "Professional Growth",
              text: "Provided development opportunities for educators and innovators.",
            },{
              icon: <FaProjectDiagram className="text-[#D5B93C]" size={22} />,
              title: "Collaboration",
              text: "Fostered collaboration among academia, industry, and policy makers.",
            },{
              icon: <FaUserGraduate className="text-[#D5B93C]" size={22} />,
              title: "Inspiration",
              text: "Inspired a new generation of researchers and students.",
            }].map((card, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{card.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B142F]">{card.title}</h3>
                    <p className="mt-2 text-sm text-[#0B142F]/80">{card.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-[#D5B93C]/20 rounded-full blur-3xl" />
        </div>
        <div className="bg-[#0E1A3D]">
          <div className="container mx-auto px-4 md:px-8 lg:px-14 py-12 md:py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Ready to become a member?
              </h3>
              <p className="mt-3 text-white/80 max-w-3xl mx-auto">
                Join IAIIEA today and connect with a network of experts advancing the
                future of educational assessment.
              </p>
              <div className="mt-6">
                <Link href="/register">
                  <button className="rounded-lg bg-[#D5B93C] px-6 py-3 text-[#0E1A3D] font-semibold shadow-sm hover:bg-[#c8ad36] transition-colors">
                    Join IAIIEA Today
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}