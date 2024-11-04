'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

// Define interface for user data
interface UserDataType {
  f_name: string;
  registration: string;
}

// Define props interface for DashboardContent
interface DashboardContentProps {
  user: UserDataType;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ }) => {
  // Your DashboardContent implementation
  return <div>Dashboard Content</div>
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [userData, setUserData] = useState<UserDataType | null>(null)

  useEffect(() => {
    if (!isLoaded) return // Wait for Clerk to load user data
    
    if (!user) {
      // Use router.push instead of RedirectToSignIn
      // router.push('/login')
    } else {
      // Set user data once user is available
      setUserData({
        f_name: user.firstName || '',
        registration: (user.publicMetadata.registration as string) || '',
      })
    }
  }, [user, isLoaded, router])

  if (!isLoaded || !userData) {
    return <p>Loading...</p> // Show loading while waiting for user data
  }

  return <DashboardContent user={userData} />
}