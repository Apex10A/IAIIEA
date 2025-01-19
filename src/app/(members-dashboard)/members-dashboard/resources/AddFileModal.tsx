"use client"

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, CalendarIcon, Cross2Icon } from '@radix-ui/react-icons'
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { useSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const AddFileModal = () => {
  const [resourceType, setResourceType] = useState('')
  const [title, setTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [file, setFile] = useState<File | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { data: session } = useSession()

  const bearerToken = session?.user?.token || session?.user?.userData?.token

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!title || !file) {
      alert('Please fill all required fields')
      return
    }
  
    const formData = new FormData()
    formData.append('resource_type', 'Video')
    formData.append('resources[]', file)
    formData.append('caption', title)
    formData.append('conference_id', '1')
    
    if (selectedDate) {
      formData.append('date', format(selectedDate, 'yyyy-MM-dd'))
    }

    try {
      const response = await fetch(`${API_URL}/admin/upload_conference_resource`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      })
      
      if (response.ok) {
        alert('Resource uploaded successfully')
        setResourceType('')
        setTitle('')
        setSelectedDate(undefined)
        setFile(null)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload resource')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='bg-[#203a87] font-semibold text-white px-5 py-3 rounded-lg text-[17px]'>
          Add File
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[525px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50">
          <Dialog.Title className="text-[17px] font-medium mb-4">
            Add Resources
          </Dialog.Title>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="resourceType" className="text-right">
                Resource Type
              </label>
             
              <div className="grid grid-cols-4 items-center gap-4">
  <label className="text-right">Video Upload</label>
  <div className="col-span-3">
    <input 
      type="file" 
      onChange={handleFileUpload}
      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      accept="video/*"
    />
  </div>
</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Caption
              </label>
              <input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3 inline-flex h-[35px] w-full items-center justify-center rounded-[4px] px-[10px] text-[13px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" 
                placeholder="Enter resource caption"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 relative">
              <label className="text-right">Date (Optional)</label>
              <div className="col-span-3 relative">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black w-full"
                >
                  <CalendarIcon className="mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </button>
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 z-50 bg-white shadow-lg rounded-md mt-2">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setIsCalendarOpen(false)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Upload File</label>
              <div className="col-span-3">
                <input 
                  type="file" 
                  onChange={handleFileUpload}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  accept={resourceType === 'video' ? '.mp4,.mov,.avi' : '.pdf,.doc,.docx'}
                />
              </div>
            </div>

            {file && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-4 text-sm text-gray-500">
                  Selected file: {file.name}
                </span>
              </div>
            )}
          </div>

          <div className="mt-[25px] flex justify-end gap-[10px]">
            <Dialog.Close asChild>
              <button className="bg-gray-200 text-gray-800 hover:bg-gray-300 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              disabled={isUploading}
              className="bg-[#203a87] text-white hover:bg-opacity-90 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default AddFileModal