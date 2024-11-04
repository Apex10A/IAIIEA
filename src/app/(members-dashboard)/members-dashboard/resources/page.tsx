import React, {useState} from 'react'
import Link from 'next/link'
import ButtonProp from '../notification/button'

const Page = () => {
    const [selectedSection, setSelectedSection] = useState<'Conference resources' | 'Seminar resources'>('Conference resources');
    
  return (
    <div>
        <div className='py-10'>
           <p className='text-[18px]'> Home {'>'} <span className='font-[600]'>IAIIEA Resources</span></p>
        </div>
        <div> 
            <div>
            <div>
            <ButtonProp options={['Conference resources', 'Seminar resources']} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
            </div>
            </div>
{selectedSection === 'Conference resources' ? (
            <div className='my-5 flex items-center gap-10'>
                <div className='max-w-[540px] bg-[#F5F4F3] py-10 px-5'>
                    <div>
                    <p className='text-[24px] font-[600] text-[#0B142F] pb-2'>Innovative Digitalized Educational Assessment for Entrepreneurial Productivity</p>
                    </div>
                    <hr />
                    <p className='text-[18px] font-[600] text-[#0B142F] pt-2'>2023 Conference</p>
                    <div className='py-3'>
                        <p className='text-[21px] text-[#0B142F] pt-2'>Anchor University, Ayobo, Lagos. Nigeria. West Africa.</p>
                    </div>
                    <div className='flex items-end justify-end'>
                        <Link href='/' className='underline font-[600] text-[18px]'>Conference Resources</Link>
                    </div>
                </div>
                <div className='max-w-[540px] bg-[#F5F4F3] py-10 px-5'>
                    <div>
                    <p className='text-[24px] font-[600] text-[#0B142F] pb-2'>Innovative Digitalized Educational Assessment for Entrepreneurial Productivity</p>
                    </div>
                    <hr />
                    <p className='text-[18px] font-[600] text-[#0B142F] pt-2'>2023 Conference</p>
                    <div className='py-3'>
                        <p className='text-[21px] text-[#0B142F] pt-2'>Anchor University, Ayobo, Lagos. Nigeria. West Africa.</p>
                    </div>
                    <div className='flex items-end justify-end'>
                        <Link href='/' className='underline font-[600] text-[18px]'>Conference Resources</Link>
                    </div>
                </div>
            </div>
): (
    <div>
        <h1>sjkjksk</h1>
    </div>
)}
        </div>
    </div>
  )
}

export default Page