'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
import { CiMail } from 'react-icons/ci'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface UserData {
  first_name: string
  last_name: string
  email: string
  image_url: string
  id: string
  role: string[]
}

const ProfileSettingsContent = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [image, setImage] = useState<File | Blob>()
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [fullname, setFullname] = useState('')

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data')
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData)
      setUserData(parsedData)
      setFullname(`${parsedData.first_name} ${parsedData.last_name}`)
      setLoading(false)
    } else {
      router.push('/login')
    }
  }, [router])

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUpdating(true)

    const firstName = fullname.split(' ')[0]
    const lastName = fullname.split(' ').slice(1).join(' ')

    try {
      // Update in localStorage
      if (userData) {
        const updatedUserData = {
          ...userData,
          first_name: firstName,
          last_name: lastName,
        }
        localStorage.setItem('user_data', JSON.stringify(updatedUserData))
        setUserData(updatedUserData)

        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
          position: 'top-right',
        })
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
        position: 'top-right',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      handleUpload(e.target.files[0])
    }
  }

  const handleRemovePhoto = async () => {
    try {
      setUploadStatus('deleting')
      if (userData) {
        const updatedUserData = {
          ...userData,
          image_url: '',
        }
        localStorage.setItem('user_data', JSON.stringify(updatedUserData))
        setUserData(updatedUserData)

        toast({
          title: 'Profile Picture Removed',
          description: 'Your profile picture has been successfully removed.',
        })
      }
    } catch (error) {
      console.error('Error removing photo:', error)
      toast({
        title: 'Remove Failed',
        description: 'There was an error removing your profile picture. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploadStatus('idle')
    }
  }

  const handleUpload = async (file: File) => {
    setUploadStatus('uploading')
    try {
      // Implement your image upload logic here
      // After successful upload, update the image_url in localStorage
      // const uploadedImageUrl = await uploadImage(file)
      // if (userData && uploadedImageUrl) {
      //   const updatedUserData = {
      //     ...userData,
      //     image_url: uploadedImageUrl,
      //   }
      //   localStorage.setItem('user_data', JSON.stringify(updatedUserData))
      //   setUserData(updatedUserData)
      // }

      setUploadStatus('success')
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been successfully updated.',
        position: 'top-right',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadStatus('error')
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your image. Please try again.',
        variant: 'destructive',
        position: 'top-right',
      })
    }
  }

  if (loading) {
    return (
      <div className="text-[#ff502a] flex justify-center items-center text-2xl">
        Loading
      </div>
    )
  }

  if (!userData) return null

  return (
    <article className="space-y-10 p-6">
       <div className='bg-gray-200 px-5 py-3 mb-6'>
        <h1 className='text-lg md:text-2xl text-black'>Settings</h1>
      </div>
      <div className="md:items-center flex md:flex-row flex-col justify-center md:justify-between items-center space-x-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-center relative">
          <div className="relative">
            <Avatar className="size-20 cursor-pointer md:size-30">
              <AvatarImage
                src={userData.image_url || '/default-avatar.png'}
                alt={userData.first_name || 'User'}
              />
              <AvatarFallback className="bg-[#fef08a] uppercase cursor-pointer text-[#0e1a3d] font-bold text-[40px]">
                {userData.first_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            {uploadStatus === 'uploading' && (
              <div className="absolute w-[80px] h-[80px] md:w-[80px] md:h-[80px] inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <span className="text-white text-[16px]">Uploading...</span>
              </div>
            )}

            {uploadStatus === 'deleting' && (
              <div className="absolute w-[90px] h-[90px] md:w-[80px] md:h-[80px] inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <span className="text-white">Deleting...</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center md:items-start pt-0 md:pt-2">
            <h3 className="text-[20px] md:text-[24px] font-bold text-[#101828]">
              {`${userData.first_name} ${userData.last_name}`}
            </h3>
            <p className='opacity-[0.7] italics'>{userData.email}</p>
          </div>
        </div>

        <form className="ml-0 md:ml-8">
          <div className="flex items-center gap-2 justify-center md:my-0 my-4 md:justify-between">
            <div className="flex items-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label
                htmlFor="file-upload"
                className="w-[150px] cursor-pointer text-[#203a87] text-[16px] font-medium py-4 px-3 text-center bg-[#FEF08A] outline-none rounded-[6px]"
              >
                Upload photo
              </label>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault()
                handleRemovePhoto()
              }}
              className="py-4 px-3 text-center w-[180px] text-[#344054] outline-none rounded-lg text-[16px] font-medium border-[1px] flex"
            >
              Remove photo
            </button>
          </div>
        </form>
      </div>
      <hr />

      <form onSubmit={handleUpdateName}>
        <div className=" max-w-[400px] flex flex-col gap-[27px] md:w-[425px] px-[25px]">
          <div className="flex flex-col items-start">
            <h4 className="text-[16px] md:text-[20px] font-bold text-black">Contact details</h4>
            <p className="text-[16px] md:text-[18px] text-black">You can edit your name here.</p>
          </div>
          <hr />
          <div className="flex flex-col">
            <Label
              className="mb-2 text-[16px] md:text-[18px] font-medium text-[#344054]"
              htmlFor="fullname"
            >
              Full name
            </Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Oliva Rhye"
              className="placeholder:text-[16px] text-[16px] md:text-[17px] bg-white border-[1px] border-[#D0D5DD] focus:border-[1px] focus:border-[#94A3B8] text-black focus:outline-none rounded-lg h-[40px] py-[10px] px-[16px]"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="email" className="mb-2 text-[16px] md:text-[18px] font-medium text-black">
              Email
            </Label>
            <div className="relative">
              <Input
                className="placeholder:text-[16px] text-[16px] md:text-[17px] bg-[#fafafa] border-[1px] border-[#D0D5DD] focus:border-[1px] focus:border-[#94A3B8] focus:outline-none rounded-lg h-[40px] py-[10px] pl-[46px] pr-[16px] text-[#344054]"
                disabled
                type="email"
                placeholder="olivia@untitledui.com"
                value={userData.email || ''}
              />
              <CiMail className="text-[#D0D5DD] absolute inset-x-0 top-[6px] left-[-4px] w-[54px] h-[30px]" />
            </div>
          </div>

          <div className="flex justify-start items-center">
            <button
              type="submit"
              className="py-[8px] px-[14px] w-full md:w-[178px] border border-[#D0D5DD] outline-none rounded-lg text-[16px] md:text-[17px] font-[500] text-black"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save'}
            </button>
          </div>
          <div className="h-[50px]"></div>
        </div>
      </form>
    </article>
  )
}

export default ProfileSettingsContent