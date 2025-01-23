// page.tsx
import React, { Suspense } from 'react'


const Page = () => {
  return (
    <Suspense fallback='loading'>
       <div className='flex flex-col items-center justify-center min-h-[600px] bg-[#E9EBF3]'>
      <div>
        <h1 className='text-[48px] font-[500] text-[#0B142F]'>Sponsors</h1>
      </div>
    </div>
    </Suspense>
  )
}

export default Page