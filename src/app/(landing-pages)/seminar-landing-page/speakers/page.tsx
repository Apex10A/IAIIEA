import React, { Suspense } from 'react'
import Image from 'next/image'

const speakers = [/* your speakers array */]

const SpeakersContent = () => {
  return (
    <div className='py-20 bg-gray-100'>
      {/* your existing JSX */}
    </div>
  )
}

const Speakers = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpeakersContent />
    </Suspense>
  )
}

export default Speakers