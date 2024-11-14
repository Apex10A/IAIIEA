// And in your DashboardContent.tsx file
import { UserDataType } from '@/app/(members-dashboard)/members-dashboard/dash/types'

interface DashboardContentProps {
  user: UserDataType;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  return (
    <div className="p-6 bg-[#F9FAFF]">
      <div className='bg-gray-200 px-5 py-3 mb-6'>
        <h1 className='text-lg md:text-2xl text-black'>Dashboard</h1>
      </div>
      <h1 className=" text-3xl md:text-4xl font-bold text-black">
        Hi, {user.name} 👋
      </h1>
      <div className="mt-4">
        <p className="text-gray-600 text-[16px] md:text-lg">
          Welcome to your dashboard, here you can access your conference portal and other features
        </p>
        {user.registration && (
          <p className="text-sm text-gray-500 mt-">
            Member since: {user.registration}
          </p>
        )}
      </div>
    </div>
  )
}