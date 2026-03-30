'use server'
import { sendVerificationEmail } from '@/lib/mail'

export async function triggerWelcomeEmail(email: string, locale: string) {
  // We don't pass a token here yet as Supabase handles the actual verification link.
  // This is a "Welcome & Instructions" premium email.
  return await sendVerificationEmail(email, '', locale)
}
