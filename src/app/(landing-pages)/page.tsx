"use client"
import React, { Suspense } from 'react'
import "@/app/index.css"
import LandingPageOne from "@/app/(landing-pages)/landing-page-one/index"

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4">Loading...</p>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div>
        <LandingPageOne />
      </div>
    </Suspense>
  )
}

export default Page