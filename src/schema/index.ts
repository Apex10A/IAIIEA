import * as z from 'zod'

export enum PreferenceType {
  DIRECT_ANSWER = 'direct_answer',
  PARTIAL_ANSWER = 'partial_answer',
  GUIDE = 'guide',
}
const registrationTypes = ["individual", "institution"] as const
const professionTypes = ["professor", "postgraduate", "lecturer_i", "lecturer_ii", "undergraduate"] as const

const passwordSchema = z
  .string()
  // .min(1, { message: 'Password is required' })
  // .min(8, { message: 'Password must be at least 8 characters long' })
  // .refine((value) => /[a-z]/.test(value), {
  //   message: 'Password must contain at least one lowercase letter',
  // })
  // .refine((value) => /[A-Z]/.test(value), {
  //   message: 'Password must contain at least one uppercase letter',
  // })
  // .refine((value) => /\d/.test(value), {
  //   message: 'Password must contain at least one number',
  // })
  // .refine((value) => /[\W_]/.test(value), {
  //   message: 'Password must contain at least one special character',
  // })

export const RegisterSchema = z.object({
  f_name: z.string().min(3, {
    message: 'first name is required',
  }),
  m_name: z.string().min(3, {
    message: 'middle name is required',
  }),
  l_name: z.string().min(3, {
    message: 'last name is required',
  }),

  email: z.string().email(),
  // password: passwordSchema,
  phone: z.string(),
  type: z.enum(registrationTypes, {
    required_error: "Please select a registration type",
  }),
  profession: z.enum(professionTypes, {
    required_error: "Please select a profession",
  }),
  country: z.string(),
  postal_addr: z.string(),
  qualifications: z.string(),
  area_of_specialization: z.string(),
    institution_name_addr: z.string()
})

export const LoginSchema = z.object({
  uid: z.string().min(1, "Email is required").trim(), // Add trim() to remove whitespace
  password: z.string().min(1, "Password is required"),
})
// export const LoginSchema = z.object({
//   email: z.string().min(1, { message: 'Email is required' }).email({
//     message: 'Invalid email address',
//   }),
//   password: passwordSchema,
//   rememberMe: z.boolean().default(false).optional(),
// })

export const OtpSchema = z.object({
  token: z.string(),
  otp: z.string(),
})

export const studentsPreferenceSchema = z.object({
  student_preference: z.enum([
    PreferenceType.DIRECT_ANSWER,
    PreferenceType.PARTIAL_ANSWER,
    PreferenceType.GUIDE,
  ]),
  grade: z.string().min(1, { message: 'grade cannot be empty' }),
  subject_preferences: z.array(z.string()).optional().default([]),
})

export const InviteParentSchema = z.object({
  name: z.string(),
  email: z.string().min(1, { message: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
})

export const newsLetterschema = z.object({
  email: z.string().email(),
})

export const forgotPasswordSchema = z
  .object({
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })
