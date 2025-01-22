// page.tsx
import React, { Suspense } from 'react'

const SponsorsContent = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[600px] bg-[#E9EBF3]'>
      <div>
        <h1 className='text-[48px] font-[500] text-[#0B142F]'>Sponsors</h1>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SponsorsContent />
    </Suspense>
  )
}

export default Page