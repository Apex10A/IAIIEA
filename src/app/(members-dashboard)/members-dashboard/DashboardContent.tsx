// And in your DashboardContent.tsx file
import { UserDataType } from '@/app/(members-dashboard)/members-dashboard/dash/types'

interface DashboardContentProps {
  user: UserDataType;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold">
        Welcome on board, {user.f_name} 👋
      </h1>
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <p className="text-gray-600">
          Welcome to your dashboard
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