import React, { Suspense } from 'react'

const seminarOptions = [/* your options array */]

const SeminarContent = () => {
  return (
    <div className="min-h-[600px] px-5 py-10 md:px-14">
      {/* your existing JSX */}
    </div>
  )
}

const SeminarPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SeminarContent />
    </Suspense>
  )
}

export default SeminarPage