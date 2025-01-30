// import React from 'react';
// import { BookOpen, Briefcase } from 'lucide-react';

// const SubThemesPage: React.FC<{ details: any }> = ({ details }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         <div>
//           <h2 className="text-2xl font-bold mb-6 text-[#1A2A5C] flex items-center">
//             <BookOpen className="mr-3 text-[#D5B93C]" /> Sub Themes
//           </h2>
//           <ul className="space-y-3 pl-4">
//             {details.sub_theme.map((theme: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
//               <li key={index} className="flex items-start">
//                 <span className="mr-2 text-[#D5B93C] font-bold">•</span>
//                 <span>{theme}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div>
//           <h2 className="text-2xl font-bold mb-6 text-[#1A2A5C] flex items-center">
//             <Briefcase className="mr-3 text-[#D5B93C]" /> Workshops
//           </h2>
//           <ul className="space-y-3 pl-4">
//             {details.work_shop.map((workshop: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
//               <li key={index} className="flex items-start">
//                 <span className="mr-2 text-[#D5B93C] font-bold">•</span>
//                 <span>{workshop}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
      
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold text-[#1A2A5C] mb-4">Important Dates</h3>
//         <div className="bg-gray-100 p-4 rounded-lg">
//           {details.important_date.map((date: string, index: React.Key | null | undefined) => (
//             <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
//               <span>{date.split(' ')[0]}</span>
//               <span className="text-gray-600">{date.split(' ')[1]}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubThemesPage;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page