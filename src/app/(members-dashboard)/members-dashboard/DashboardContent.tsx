// app/dashboard/components/dashboard-content.tsx
'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface User {
  f_name: string
  registration: string
}

export function DashboardContent({ user }: { user: User }) {
  return (
    <div className="space-y-6 mx-10 my-10">
      <div className='pb-3'>
        <p className='text-[20px]'>
          Home {'>'} <span className='font-[600]'>Dashboard</span>
        </p>
      </div>
      <h1 className="text-5xl font-bold">
        Welcome on board, {user.f_name} 👋
      </h1>
      {user.registration !== 'complete' ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 max-w-[80%] p-4">
          <p className="text-yellow-700 text-[20px]">
            As part of the registration process, you are required to complete your membership fee
            to access exclusive content and membership advantages.
          </p>
          {/* <Button asChild className="mt-4">
            <Link href="/dashboard/payment">
              Proceed to Payment
            </Link>
          </Button> */}
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-green-700">
            Thank you for completing your membership payment. You now have full access to all features.
          </p>
        </div>
      )}
    </div>
  )
}