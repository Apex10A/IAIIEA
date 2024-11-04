
import { auth } from '@/auth';
import DashboardHeader from './DashboardHeader';

const DashboardHeaderContainer = async () => {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user) return null;

  return <DashboardHeader user={user} />;
};

export default DashboardHeaderContainer;