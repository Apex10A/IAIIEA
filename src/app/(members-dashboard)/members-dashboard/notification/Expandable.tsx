// // ExpandableSection.tsx
// import React from 'react';
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { SectionState } from './buttonTs'

// interface ExpandableSectionProps {
//   title: string;
//   section: string | keyof SectionState;  // Allow both string and specific section keys
//   expandedSections: SectionState;
//   toggleExpansion: (section: string | keyof SectionState) => void;
//   children: React.ReactNode;
// }

// const ExpandableSection: React.FC<ExpandableSectionProps> = ({
//   title,
//   section,
//   expandedSections,
//   toggleExpansion,
//   children,
// }) => (
//   <div className='border border-[#CACAC9] w-full py-5 px-6 rounded-[30px] my-5'>
//     <div
//       onClick={() => toggleExpansion(section)}
//       style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//       className='flex items-center justify-between'
//     >
//       <div>
//         <p className='font-[500] text-[18px]'>{title}</p>
//       </div>
//       <div>
//         {expandedSections[section] ? <FiChevronUp /> : <FiChevronDown />}
//       </div>
//     </div>
//     {expandedSections[section] && <div className='mt-5'>{children}</div>}
//   </div>
// );

// export default ExpandableSection;
