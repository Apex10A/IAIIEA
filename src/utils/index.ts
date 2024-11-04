import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mask the local part of an email address.
 * @function maskEmail
 * @param {string} email - The email address to be masked.
 * @returns {string} The masked email address.
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart}***@${domain}`
  }
  const maskedLocalPart = `${localPart.slice(0, 2)}***`
  return `${maskedLocalPart}@${domain}`
}

/**
 * Format the given time in seconds to a mm:ss string.
 * @function formatTime
 * @param {number} time - Time in seconds.
 * @returns {string} The formatted time string.
 */
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

/**
 * Format the given date to a 'MMM dd, yyyy' string.
 * @function formatDate
 * @param {string | number | Date} originalDate - The original date input.
 * @returns {string} The formatted date string.
 */
export const formatDate = (originalDate: string | number | Date): string => {
  const date = new Date(originalDate)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

/**
 * Returns an Encrypted a string .
 * @function encryptString - Encodes or encrypts a string using a base64 Buffer
 * @returns A encoded string .
 */
export const encryptString = (str: string): string => {
  const buffer = Buffer.from(str)
  return buffer.toString('base64')
}

/**
 * Decodes and Returns a string .
 * @function decryptString - Decodes or decrypts an encrypted string Buffer
 * @returns A decoded string .
 */

export const decryptString = (str: string): string => {
  const buffer = Buffer.from(str, 'base64')
  return buffer.toString()
}

/**
 * Shrink a string to a specified length(len).
 * @function shrinkString
 * @param {string} str
 * @param {number} len
 * @returns {string}
 */
export const shrinkString = ({
  str,
  len,
}: {
  str: string
  len: number
}): string => {
  if (!str) return ''
  if (str.length > len) {
    return str.substring(0, len) + '...'
  }
  return str
}

/**
 * Formats a given date string into a readable format: DD MMM YYYY.
 * Example output: 12 May 2024.
 * @function dateFormatter
 * @param {string} dateString - The date string to be formatted (must be parsable by the Date object).
 * @returns {string} A formatted date string in the format "DD MMM YYYY".
 * @throws Will throw an error if the date string is invalid.
 */
export const dateFormatter = (dateString: string): string => {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string')
  }

  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Encodes both blog title and blog ID into a Base64 string and truncates it to 8 characters.
 * @function encodeBlogDetails
 * @param {string} title - The title of the blog to be encoded.
 * @param {string} id - The ID of the blog to be encoded.
 * @returns {string} An 8-character Base64-encoded string representing the blog title and ID.
 */
export const encodeBlogDetails = (title: string, id: string): string => {
  const combined = `${title}|${id}` // Use '|' as a separator
  const encoded = Buffer.from(combined).toString('base64')
  return encoded.substring(0, 8) // Return only the first 8 characters
}

/**
 * Decodes the 8-character Base64-encoded slug back to the original blog title and ID.
 * @function decodeBlogDetails
 * @param {string} slug - The 8-character Base64-encoded slug to be decoded.
 * @returns {{ title: string; id: string }} An object containing the original blog title and ID.
 * @throws Will throw an error if the Base64 decoding fails or the combined string is invalid.
 */
export const decodeBlogDetails = (
  slug: string
): { title: string; id: string } => {
  try {
    const fullEncodedSlug = slug.padEnd(8, '=')
    const combined = Buffer.from(fullEncodedSlug, 'base64').toString('ascii')
    const [title, id] = combined.split('|')
    if (!title || !id) {
      throw new Error('Invalid slug format.')
    }
    return { title, id }
  } catch (error) {
    throw new Error('Failed to decode slug.')
  }
}
