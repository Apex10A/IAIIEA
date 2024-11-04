// 'use client'

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import React, { useEffect, useRef, useState } from 'react'
// import {
//   UpdateName,
//   UpdateProfileImage,
//   getUserProfile,
// } from '@/action/profile'

// // import { Button } from '../ui/button'
// import { CiMail } from 'react-icons/ci'
// import Image from 'next/image'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// // import { uploadImage } from '@/action/cloudinary'
// import { useRouter } from 'next/navigation'
// // import { useSession } from 'next-auth/react'
// import { useToast } from '@/components/ui/use-toast'
// import { useTransition } from 'react'
// import "@/app/index.css"
// // import useravatar from '/public/images/useravatar.png'

// interface DataProps {
//   first_name: string
//   last_name: string
//   email: string
//   image_url: string
//   id: string
//   role: string[]
//   google_login?: boolean
// }

// const ProfileSettingsContent = () => {
//   const { toast } = useToast()
//   const { data: session, update } = useSession()
//   const [loading, setLoading] = useState(true)
//   const [updating, setUpdating] = useState(false)
//   const [profile, setProfile] = useState<DataProps>({} as DataProps)
//   const [image, setImage] = useState<File | Blob>()
//   const [uploadStatus, setUploadStatus] = useState('idle')

//   const [fullname, setFullname] = useState(
//     `${profile?.first_name} ${profile?.last_name}` || ''
//   )

//   const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setUpdating(true)

//     const firstName = fullname.split(' ')[0]
//     const lastName = fullname.split(' ').slice(1).join(' ')

//     try {
//       const res = await UpdateName({
//         first_name: firstName,
//         last_name: lastName,
//       })

//       if (res.status === 200) {
//         setProfile((prevProfile) => ({
//           ...prevProfile,
//           first_name: firstName,
//           last_name: lastName,
//         }))

//         await update({
//           ...session?.user,
//           first_name: firstName,
//           last_name: lastName,
//         })

//         toast({
//           title: 'Profile Updated',
//           description: 'Your profile has been successfully updated.',
//           position: 'top-right',
//         })
//       } else {
//         throw new Error(res.message)
//       }
//     } catch (error) {
//       toast({
//         title: 'Update Failed',
//         description:
//           'There was an error updating your profile. Please try again.',
//         variant: 'destructive',
//         position: 'top-right',
//       })
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0])
//       handleUpload(e.target.files[0])
//     }
//   }

//   const handleRemovePhoto = async () => {
//     try {
//       setUploadStatus('deleting')
//       const res = await UpdateProfileImage('')
//       console.log(res)
//       if (res.status === 200) {
//         setProfile((prevProfile) => ({
//           ...prevProfile,
//           image_url: '',
//         }))
//         await update({
//           ...session?.user,
//           image_url: '',
//         })
//         toast({
//           title: 'Profile Picture Removed',
//           description: 'Your profile picture has been successfully removed.',
//         })
//         setUploadStatus('idle')
//       } else {
//         setUploadStatus('idle')
//         throw new Error('Failed to remove photo')
//       }
//     } catch (error) {
//       setUploadStatus('idle')
//       console.error('Error removing photo:', error)
//       toast({
//         title: 'Remove Failed',
//         description:
//           'There was an error removing your profile picture. Please try again.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const handleUpload = async (file: File) => {
//     setUploadStatus('uploading')
//     try {
//       const res = await uploadImage(file)
//       if (res.status === 200) {
//         let urlRes: {
//           status: number
//           message: string
//         } | null = null

//         if (res.url) {
//           urlRes = await UpdateProfileImage(res.url)
//         } else {
//           return toast({
//             title: 'Upload Failed',
//             description:
//               'There was an error uploading your image. Please try again.',
//             variant: 'destructive',
//           })
//         }

//         if (!urlRes) {
//           return toast({
//             title: 'Upload Failed',
//             description:
//               'There was an error uploading your image. Please try again.',
//             variant: 'destructive',
//             position: 'top-right',
//           })
//         }

//         if (urlRes.status === 200) {
//           await update({
//             ...session?.user,
//             image_url: res.url,
//           })

//           setUploadStatus('success')
//           toast({
//             title: 'Profile Picture Updated',
//             description: 'Your profile picture has been successfully updated.',
//             position: 'top-right',
//           })
//         }
//       } else {
//         throw new Error('Upload failed')
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error)
//       setUploadStatus('error')
//       toast({
//         title: 'Upload Failed',
//         description:
//           'There was an error uploading your image. Please try again.',
//         variant: 'destructive',
//         position: 'top-right',
//       })
//     }
//   }

//   useEffect(() => {
//     if (!session) return

//     setProfile(session.user as DataProps)
//     setFullname(`${session.user.first_name} ${session.user.last_name}`)
//     setLoading(false)
//   }, [session])

//   if (!session) return

//   if (loading) {
//     return (
//       <div className="text-[#ff502a] flex justify-center items-center text-2xl">
//         Loading
//       </div>
//     )
//   }

//   return (
//     <>
//       <article className="space-y-10 px-20 py-10">
//         <div className="md:items-center flex md:flex-row flex-col justify-center md:justify-between items-center space-x-4">
//           <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-center relative">
//             <div className="relative">
//                 <div className=''>
//                     <h1 className='text-4xl font-bold'>Settings</h1>
//                 </div>
//               <Avatar className="size-20 cursor-pointer md:size-30">
//                 <AvatarImage
//                   src={profile?.image_url ?? '/default-avatar.png'}
//                   alt={profile?.first_name ?? 'User'}
//                 />
//                 <AvatarFallback className="bg-[#FFF7F5] uppercase cursor-pointer text-white font-bold text-[20px]">
//                   {/* {profile?.image_url ?? (
//                     <Image
//                       alt="user"
//                       width={100}
//                       height={100}
//                       src={useravatar}
//                     />
//                   )} */}
//                 </AvatarFallback>
//               </Avatar>

//               {uploadStatus === 'uploading' && (
//                 <div className="absolute w-[80px] h-[80px] md:w-[80px] md:h-[80px] inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
//                   <span className="text-white text-[16px]">Uploading...</span>
//                 </div>
//               )}

//               {uploadStatus === 'deleting' && (
//                 <div className="absolute  w-[90px] h-[90px] md:w-[80px] md:h-[80px] inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
//                   <span className="text-white">Deleting...</span>
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col items-center md:items-start pt-0 md:pt-2 ">
//               <h3 className="text-[18px]  md:text-[24px] font-medium text-[#101828]">
//                 {`${profile?.first_name} ${profile?.last_name}`}
//               </h3>
//               {profile?.email}
//             </div>
//           </div>
//           <form className="ml-0 md:ml-8">
//             <div className="flex items-center gap-2 justify-center md:my-0 my-4 md:justify-between">
//               <div className="flex items-center">
//                 <input
//                   type="file"
//                   id="file-upload"
//                   className="hidden"
//                   onChange={handleFileChange}
//                   accept="image/*"
//                 />
//                 <label
//                   htmlFor="file-upload"
//                   className="w-[150px] cursor-pointer text-[#203a87] text-[17px] font-medium py-4 px-3 text-center bg-[#FEF08A] outline-none rounded-[6px]"
//                 >
//                   Upload photo
//                 </label>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.preventDefault()
//                   handleRemovePhoto()
//                 }}

//                 className="py-4 px-3 text-center w-[150px] text-[#344054] outline-none  rounded-lg text-[17px] font-medium border-[1px] "
//               >
//                 Remove photo
//               </button>
//             </div>
//           </form>
//         </div>
//         <hr />

//         <form onSubmit={handleUpdateName}>
//           <div className="mx-auto max-w-[400px] flex flex-col gap-[27px] md:w-[425px]  p-[25px]">
//             <div className="flex flex-col items-start">
//               <h4 className="font-[500] text-[18px]">Contact details</h4>
//               <p className="text-[14px]">You can edit your name here.</p>
//             </div>
//             <hr className="" />
//             <div className="flex flex-col mb-">
//               <Label
//                 className="mb-2 text-[14px] font-medium text-[#344054]"
//                 htmlFor="fullname"
//               >
//                 Full name
//               </Label>
//               <Input
//                 type="text"
//                 id="fullname"
//                 name="fullname"
//                 value={fullname}
//                 onChange={(e) => setFullname(e.target.value)}
//                 placeholder="Oliva Rhye"
//                 className="placeholder:text-[16px] font-font-normal bg-white border-[1px] border-[#D0D5DD] focus:border-[1px] focus:border-[#94A3B8]
//                 focus:outline-none rounded-lg h-[40px] py-[10px] px-[16px]"
//               />
//             </div>
//             <div className="flex flex-col">
//               <Label htmlFor="email" className="mb-2 text-[14px] font-medium">
//                 Email
//               </Label>
//               <div className="relative">
//                 <Input
//                   className="placeholder:text-[16px] placeholder:font-normal bg-[#fafafa] border-[1px] border-[#D0D5DD] focus:border-[1px] focus:border-[#94A3B8] focus:outline-none
//                   rounded-lg h-[40px] py-[10px] pl-[46px] pr-[16px] text-[#344054]"
//                   disabled
//                   type="email"
//                   placeholder="olivia@untitledui.com"
//                   value={profile?.email || ''}
//                 />
//                 <CiMail className="text-[#D0D5DD] absolute inset-x-0 top-[6px] left-[-4px] w-[54px] h-[30px]" />
//               </div>
//             </div>

//             <div className="flex justify-start items-center">
//               <button
//                 type="submit"
//                 className="py-[8px] px-[14px] w-full md:w-[178px]  outline-none  rounded-lg text-[14px] font-[500]"
//                 disabled={updating}
//               >
//                 {updating ? 'Saving...' : 'Save'}
//               </button>
//             </div>
//             <div className="h-[50px]"></div>
//           </div>
//         </form>
//       </article>
//     </>
//   )
// }

// export default ProfileSettingsContent
