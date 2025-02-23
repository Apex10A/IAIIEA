import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { countries } from '@/utils/countries'
import { showToast } from '@/utils/toast';
import { Button } from '@/components/ui/button'
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Updated Zod schema for member registration
const MemberSchema = z.object({
  f_name: z.string().min(1, "First name is required"),
  m_name: z.string().optional(),
  l_name: z.string().min(1, "Last name is required"),
  type: z.enum(["Individual", "Corporate", "Student"], { 
    errorMap: () => ({ message: "Registration type is required" }) 
  }),
  profession: z.string().min(1, "Profession is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  postal_addr: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  area_of_specialization: z.string().min(1, "Area of specialization is required"),
  institution_name_addr: z.string().optional()
})

const AddMembers = () => {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const registrationTypes = [
    { value: "Individual", label: "Individual" },
    { value: "Corporate", label: "Corporate" },
    { value: "Student", label: "Student" },
  ]

  const form = useForm<z.infer<typeof MemberSchema>>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      f_name: '',
      m_name: '',
      l_name: '',
      type: "Individual",
      profession: '',
      phone: '',
      email: '',
      postal_addr: '',
      country: '',
      qualifications: '',
      area_of_specialization: '',
      institution_name_addr: ''
    },
  })

  const onSubmit = async (values: z.infer<typeof MemberSchema>) => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/admin/register_member`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Member registration failed')
      }

      // Reset form on success
      form.reset()
      
      console.log('Member registered successfully', data)
      showToast.success('Member registered successfully')
      
    } catch (err: any) {
      console.error("Registration error:", err)
      showToast.error(err.message || "Failed to register member. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className='bg-[#203a87] font-semibold text-white'>
          Add Members
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] max-w-[725px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50">
          <Dialog.Title className='text-2xl text-center mb-5'>Add Members</Dialog.Title>
          
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md mb-4">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="f_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Middle Name */}
              <FormField
                control={form.control}
                name="m_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter middle name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="l_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Registration Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select registration type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {registrationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profession */}
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What best describes you"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Postal Address */}
              <FormField
                control={form.control}
                name="postal_addr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter postal address"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Qualifications */}
              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Qualifications</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your academic qualification"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Area of Specialization */}
              <FormField
                control={form.control}
                name="area_of_specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area of Specialization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your area of specialization"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Institution Name and Address */}
              <FormField
                control={form.control}
                name="institution_name_addr"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Institution Name and Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your institution name and address"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <Dialog.Close asChild>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner className="mr-2" /> : "Register Member"}
                </Button>
              </div>
            </form>
          </Form>

          <Dialog.Close asChild>
            <button
              className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
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

export default AddMembers