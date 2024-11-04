import React from 'react';
import Sidebar from '@/components/layout/sidebar/page'
import DashboardHeader from '@/components/layout/header/DashboardHeader';
import DashboardHeaderContainer from '@/components/layout/header/DashboardHeaderContainer';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
       <div className="w-full">
       {/* <DashboardHeader /> */}
       {/* <DashboardHeaderContainer/> */}
       </div>

       <div className="flex flex-grow">
         <div className="relative">
           {/* <Sidebar setActiveComponent={function (component: string): void {
            throw new Error('Function not implemented.');
          } } /> */}
         </div>
        
         <div className="flex-grow p-4 relative mt-28 px-10 transform bg-[#f9faff]">
           {/* {children} */}
         </div>
       </div>
     </div>
  );
};

export default DashboardLayout;