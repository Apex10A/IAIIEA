'use server'

import { Calls } from './axios'
import { auth } from '@/auth'

const url = process.env.API_URL
const $http = Calls(url)

export const UpdateProfileImage = async (image_url: string) => {
  const session = await auth()
  try {
    const res = await $http.patch(
      '/profile',
      {
        image_url,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    )

    return {
      status: res.status,
      message: 'Profile image updated successfully',
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

export const getUserProfile = async () => {
  const session = await auth()
  try {
    const res = await $http.get('/profile', {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      user: res.data.data,
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

export const getSettings = async () => {
  const session = await auth()
  try {
    const res = await $http.get('/profile/settings', {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      user: res.data.data,
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

interface AccountSettingProps {
  old_password: string
  new_password: string
}

export const UpdateAccountSettings = async (body: AccountSettingProps) => {
  const session = await auth()
  try {
    const res = await $http.patch('/profile/change-password', body, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      message: 'Password updated successfully',
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

interface UpdateNameProps {
  first_name: string
  last_name: string
}
export const UpdateName = async (body: UpdateNameProps) => {
  const session = await auth()
  try {
    const res = await $http.patch('/profile', body, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      message: 'Name updated successfully',
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

export const DeleteUser = async () => {
  const session = await auth()
  try {
    const res = await $http.delete('/profile', {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      message: 'Delete successfully',
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

interface UpdateSettingsProps {
  grading_reminder?: boolean
  get_reminder_on_all_graded_homework?: boolean
  get_reminder_on_all_generate_questions?: boolean
  grading_with_comment?: boolean
  feedback_generation?: boolean
  email_notifications?: boolean
  access_control?: boolean
  report_frequency_preference?: 'daily' | 'weekly'
  assistance_level_preference?:
    | 'full_help'
    | 'partial_help'
    | 'ensure_understanding'

  interaction_preference?: 'interactive_mode' | 'hint_frequency' | 'quiz_mode'
  revision_quiz_preference?: 'topic_covered' | 'frequency'
  homework_schedule_preference?: 'every_one_hour' | 'twice_a_week' | 'always'
  data_privacy_preference?: 'show_only_essential' | 'allow_full_data_share'
}

export const UpdateSettings = async (body: UpdateSettingsProps) => {
  const session = await auth()
  try {
    const res = await $http.patch('/profile/settings', body, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      message: 'Preference updated successfully',
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}

export interface BillingCardProps {
  cardholder_name?: string
  encrypted_card_number?: string
  expiration_date: string
  billing_address: string
  country?: string
  cvv?: string
}

export const PostBillingCard = async (body: BillingCardProps) => {
  const session = await auth()
  try {
    const res = await $http.post('/profile/billing-card', body, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    return {
      status: res.status,
      message: 'payment detail updated successfully',
    }
  } catch (e: any) {
    return {
      message: e?.response?.data.message,
      status: e?.response?.status,
    }
  }
}
