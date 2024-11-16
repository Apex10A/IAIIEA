import React, {useState} from 'react';
// import ButtonProp from '../../dashboard/notification/button';
import PaymentHistory from './PaymentHistory'

const Payment = () => {
    const [selectedSection, setSelectedSection] = useState<'Payment' | 'Payment History'>('Payment');
  
    return (
        <div>
            <div className='py-10'>
                <p className='text-[18px]'> Home {'>'} <span className='font-[600]'>Payment</span></p>
            </div>
            <div>
                {/* <ButtonProp options={['Payment', 'Payment History']} selectedSection={selectedSection} setSelectedSection={setSelectedSection} /> */}
                {selectedSection === 'Payment' ? (
                    <>
                <div className='pt-8'>
                    <p className='pb-7'>You currently have 3 pending payments to clear</p>
                </div>
                        {/* Payment 1 */}
                        <div className='border px-10 py-10 rounded-2xl max-w-[70%]'>
                            <div className='mb-2'>
                                <p className='text-[24px] text-[#0B142F] font-[600]'>2024 Annual membership dues</p>
                            </div>
                            <div className='flex items-center justify-between mb-4'>
                                <p className='text-[16px] text-[#0B142F] font-[400] max-w-lg'>
                                    This membership dues is paid annually and it is used for members maintain. Refer to the constitution for more details on use of dues.
                                </p>
                                <p className='text-[16px] text-[#0B142F] font-[600]'>Posted: 4:00pm </p>
                            </div>
                            <div className='flex items-center justify-between pt-5'>
                                <p>NGN 20,000</p>
                                <button className="bg-[#203a87] text-white px-6 py-3 rounded-3xl font-semibold">Make payment</button>
                            </div>
                        </div>

                        {/* Payment 2 */}
                        <div className='border px-10 py-10 my-4 rounded-2xl max-w-[70%]'>
                            <div className='mb-2'>
                                <p className='text-[24px] text-[#0B142F] font-[600]'>2024 Annual Conference dues</p>
                            </div>
                            <div className='flex items-center justify-between mb-4'>
                                <p className='text-[16px] text-[#0B142F] font-[400] max-w-lg'>
                                    This membership dues is paid annually and it is used for members maintain. Refer to the constitution for more details on use of dues.
                                </p>
                                <p className='text-[16px] text-[#0B142F] font-[600]'>Posted: 4:00pm </p>
                            </div>
                            <div className='flex items-center justify-between pt-5'>
                                <p>NGN 20,000</p>
                                <button className="bg-[#203a87] text-white px-6 py-3 rounded-3xl font-semibold">Make payment</button>
                            </div>
                        </div>

                        {/* Payment 3 */}
                        <div className='border px-10 py-10 rounded-2xl max-w-[70%]'>
                            <div className='mb-2'>
                                <p className='text-[24px] text-[#0B142F] font-[600]'>2024 Annual Webinar/Seminar dues</p>
                            </div>
                            <div className='flex items-center justify-between mb-4'>
                                <p className='text-[16px] text-[#0B142F] font-[400] max-w-lg'>
                                    This membership dues is paid annually and it is used for members maintain. Refer to the constitution for more details on use of dues.
                                </p>
                                <p className='text-[16px] text-[#0B142F] font-[600]'>Posted: 4:00pm </p>
                            </div>
                            <div className='flex items-center justify-between pt-5'>
                                <p>NGN 20,000</p>
                                <button className="bg-[#203a87] text-white px-6 py-3 rounded-3xl font-semibold">Make payment</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='py-10'>
                        <PaymentHistory/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Payment;
