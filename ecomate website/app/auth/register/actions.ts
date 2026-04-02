'use server'
import { sendWelcomeEmail } from '@/lib/mail'

export async function triggerWelcomeEmail(email: string, locale: string) {
  // This is a "Welcome & Instructions" premium email.
  return await sendWelcomeEmail(email, locale)
}
