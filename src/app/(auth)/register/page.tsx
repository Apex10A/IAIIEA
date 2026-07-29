'use client'

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { countries } from "@/utils/countries";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import '@/app/index.css'
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
import { showToast } from '@/utils/toast'
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const registrationTypes = ["Individual", "Institution"] as const
const professionTypes = ["professor", "postgraduate", "lecturer_i", "lecturer_ii", "undergraduate"] as const

const RegisterSchema = z.object({
  f_name: z.string().min(1, "First name is required"),
  m_name: z.string().optional(),
  l_name: z.string().min(1, "Last name is required"),
  type: z.enum(registrationTypes).optional(),
  profession: z.enum(professionTypes).optional(),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Phone number must include country code (e.g., +234 810-123-3211)")
    .min(10, "Phone number must be at least 10 digits including country code"),
  email: z.string().email("Invalid email address"),
  postal_addr: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  area_of_specialization: z.string().optional(),
  institution_name_addr: z.string().min(1, "Institution name and address are required"),
})

type RegisterFormValues = z.infer<typeof RegisterSchema>

const normalizeRegisterPayload = (values: RegisterFormValues) => ({
  ...values,
  type: values.type ?? "",
  profession: values.profession ?? "",
  postal_addr: values.postal_addr ?? "",
  area_of_specialization: values.area_of_specialization ?? "",
})

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-gray-50/40 p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#203A87]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false)
  const [showOptionalFields, setShowOptionalFields] = useState(false)

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

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      f_name: '',
      m_name: '',
      l_name: '',
      phone: '',
      email: '',
      postal_addr: '',
      country: '',
      qualifications: '',
      area_of_specialization: '',
      institution_name_addr: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    if (!agreeToPrivacy) {
      showToast.error('Please agree to the privacy policy');
      return;
    }
    
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(normalizeRegisterPayload(values)),
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
      // console.error("Registration error:", err)
      // Show error toast
      showToast.error(err.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen background py-24 md:py-28 px-4 md:px-6 w-full flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col items-center text-center gap-6 mb-8">
          <Link href="/" className="cursor-pointer">
            <Image src="/logo.png" alt="logo" width={130} height={50} />
          </Link>
          <div className="space-y-2">
            <h1 className="text-[#203A87] font-bold text-2xl md:text-3xl">
              Become a member of IAIIEA
            </h1>
            <p className="text-[#393938] text-sm md:text-base max-w-xl mx-auto">
              Join the IAIIEA organization to access exclusive membership offers.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <Form {...form}>
          <form
            className="space-y-8 [&_input]:border-neutral-200/50 dark:[&_input]:border-neutral-800/60"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormSection
              title="Personal details"
              description="Tell us who you are."
            >
              <FormField
                control={form.control}
                name="f_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      First Name<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="m_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your middle name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="l_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Last Name<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Contact information"
              description="How we can reach you."
            >
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
                        placeholder="+234 810 123 3211"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g. +234 for Nigeria, +1 for USA)
                    </p>
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
                        placeholder="you@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Professional & academic"
              description="Required membership details."
            >
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Country of domicile<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Qualifications<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="qualifications"
                        placeholder="Enter your academic qualifications"
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
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                      Institution Name & Address<span className="text-brand-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="ina"
                        placeholder="Enter your institution name and address"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <section className="rounded-xl border border-dashed border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setShowOptionalFields((open) => !open)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div>
                  <h2 className="text-base font-semibold text-[#203A87]">
                    Additional details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Optional — complete now or later in your dashboard
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                    showOptionalFields ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showOptionalFields && (
                <div className="grid gap-5 border-t border-gray-100 px-5 pb-5 pt-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                          Registration Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                          Profession
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                    name="postal_addr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-[#1A1A1A] text-sm">
                          Postal address
                        </FormLabel>
                        <FormControl>
                          <Input id="postal" placeholder="Enter your postal address" {...field} disabled={isLoading} />
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
                          Area of Specialization
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="aos"
                            placeholder="Enter your area of specialization"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </section>

            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <input
                  id="privacy-checkbox"
                  type="checkbox"
                  checked={agreeToPrivacy}
                  onChange={(e) => setAgreeToPrivacy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-[#203A87] border-gray-300 rounded focus:ring-[#203A87]"
                />
                <label htmlFor="privacy-checkbox" className="text-sm text-gray-700 leading-relaxed">
                  I agree to IAIIEA using my personal data to carry out my request in line with its{" "}
                  <Link href="/privacy-policy" className="text-[#203A87] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#203A87] text-white py-6 text-base hover:bg-[#152a61] disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading || !agreeToPrivacy}
              >
                {isLoading ? <LoadingSpinner className="w-4 h-4" /> : "Register"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-[#203A87] font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}