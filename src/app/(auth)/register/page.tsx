'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { countries } from "@/utils/countries";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import '@/app/index.css'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signIn } from "next-auth/react"
import { showToast } from '@/utils/toast'
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const RegisterSchema = z.object({
  f_name: z.string().min(1, "First name is required"),
  m_name: z.string().optional(),
  l_name: z.string().min(1, "Last name is required"),
  type: z.enum(["Individual", "Institution"]),
  profession: z.enum(["professor", "postgraduate", "lecturer_i", "lecturer_ii", "undergraduate"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  // password: z.string()
  //   .min(8, "Password must be at least 8 characters")
  //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  //   .regex(/[0-9]/, "Password must contain at least one number")
  //   .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  postal_addr: z.string().min(1, "Postal address is required"),
  country: z.string().min(1, "Country is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  area_of_specialization: z.string().min(1, "Area of specialization is required"),
  institution_name_addr: z.string().min(1, "Institution name and address are required"),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const registrationTypes = [
    { value: "Individual", label: "Individual" },
    { value: "Institution", label: "Institution" },
  ]
  
  const professions = [
    { value: "professor", label: "Professor" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "lecturer_i", label: "Lecturer I" },
    { value: "lecturer_ii", label: "Lecturer II" },
    { value: "undergraduate", label: "Undergraduate" },
  ]

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      f_name: '',
      m_name: '',
      l_name: '',
      type: "Individual",
      profession: "professor",
      phone: '',
      email: '',
      postal_addr: '',
      country: '',
      qualifications: '',
      area_of_specialization: '',
      institution_name_addr: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed')
      }

      // Show success toast
      showToast.success("Registration successful!")

      // Redirect to login page
      router.push("/login")
      
    } catch (err: any) {
      console.error("Registration error:", err)
      // Show error toast
      showToast.error(err.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className='min-h-screen background py-28 md:px-auto px-5 w-full flex flex-col items-center'>
      <div className="md:w-[900px] bg-[#fff] md:px-32 sm:px-20 rounded-md flex flex-col items-center justify-center min-h-[70%] w-full  shadow-none py-5">
        <CardHeader className="w-full">
          <div className="flex flex-col gap-8 items-center w-full">
            <Link href="/" className="cursor-pointer">
            <Image src='/logo.png' alt="logo" width={130} height={50} />
            </Link>
            <div className="flex flex-col text-center gap-[8px]">
              <h1 className="text-[#203A87] font-bold text-2xl md:text-4xl">
                Become a member of IAIIEA
              </h1>
              <p className="text-[#393938] leading-[24px] max-w-[611px]">
                Join the IAIIEA organization to access exclusive membership offers
              </p>
            </div>
          </div>
        </CardHeader>
       
        <CardContent className="gap-5 grid w-full">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Form {...form}>
            <form className=" " onSubmit={form.handleSubmit(onSubmit)}>
              {/* First Name */}
             <div className="grid gap-4 md:grid-cols-2 mb-5">
             <FormField
                control={form.control}
                name="f_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      First Name<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
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
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Middle Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your middle name"
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
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Last Name<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              {/* <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Password<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Registration Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Registration Type<span className="text-brand-primary">*</span>
                    </FormLabel>
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

              {/* Rest of the fields remain the same... */}
              {/* Profession */}
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Profession<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professions.map((profession) => (
                          <SelectItem key={profession.value} value={profession.value}>
                            {profession.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Mobile number<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="phone number e.g +234 810-123-3211"
                        pattern="[0-9]*" 
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Email Address<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="postal_addr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Postal address<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="postal"
                        type="text"
                        placeholder="1234"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<FormField
  control={form.control}
  name="country"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="font-medium text-[#1A1A1A] text-sm">
        Country of domicile<span className="text-brand-primary">*</span>
      </FormLabel>
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

<FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#b0abab] text-sm">
                    Qualifications<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="qualifications"
                        type="text"
                        placeholder="Degree"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="area_of_specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                    Area Of Specialization<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="aos"
                        type="text"
                        placeholder="Course/Department"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="institution_name_addr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                    Institution Name Addr<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="ina"
                        type="text"
                        placeholder="University of California"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone, Email, Postal Address, Country, etc. */}
             </div>
              
              <div className="flex flex-col w-full">
              <Button
                type="submit"
                className="w-full bg-[#203A87] text-white py-4 hover:bg-[#152a61]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  "REGISTER"
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#203A87] hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
              </div>
            </form>
          </Form>

          {/* <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#203A87]"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link> */}
        </CardContent>
      </div>
    </div>
  )
}