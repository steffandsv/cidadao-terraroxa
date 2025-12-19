'use server'

import { prisma } from '@/lib/db'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Mock OTP storage (In production, use Redis or DB with expiration)
// For this demo, we'll store it in a global map, which is NOT scalable across serverless instances
// but works for a single container/demo.
// Better: Store in the User table or a separate OTP table.
// Let's store in a global variable for now as per "Mocked" instruction,
// but since this is "serverless functions", global state might be lost.
// I'll create a simple 'otp_codes' table or column?
// No, I'll just accept '0000' as a master OTP for simplicity/testing if the "mock" requirement allows.
// Or I can store it in the database in a new table.
// Let's use a fixed OTP '1234' for simplicity in this "rewrite" unless specified otherwise.
// The legacy code used `session['otp']`. We can't do that easily before login.
// I'll just use '1234' for all users for this demo to ensure "Easy for elderly" (and developers).

export async function login(formData: FormData) {
  try {
    const phone = formData.get('phone') as string

    if (!phone) {
        return
    }

    // Check if user exists, if not create
    let user = await prisma.user.findUnique({ where: { phone } })

    if (!user) {
      user = await prisma.user.create({
        data: { phone }
      })
    }

    // In a real app, send SMS here.
    // For this demo, we assume OTP is sent.
    // We'll redirect to OTP page.

  } catch (e) {
    console.error("Login Error:", e)
    throw e // Rethrow to show error page
  }

  // Redirect must be outside try/catch in Next.js server actions if it throws specific errors,
  // but standard redirect() throws NEXT_REDIRECT which is caught by Next.js.
  // However, catching it inside try/catch blocks the redirect.
  // So we assume the logic above is safe, and we redirect outside or rethrow.
  // Wait, if I catch 'e', I might catch the redirect exception.
  // Best practice: perform logic, then redirect.

  const phone = formData.get('phone') as string
  redirect(`/otp?phone=${phone}`)
}

export async function verifyOTP(phone: string, otp: string) {
  try {
    // Mock verification
    if (otp === '1234' || otp === '0000') {
      // Success
      const user = await prisma.user.findUnique({ where: { phone } })
      if (!user) return { error: 'Usuário não encontrado' }

      // Create session
      const session = await encrypt({ user: { id: user.id, phone: user.phone, name: user.name, role: user.role } })

      const cookieStore = await cookies()
      // Set to 10 years (approx 315360000 seconds)
      cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 315360000,
        path: '/'
      })

    } else {
      return { error: 'Código inválido' }
    }
  } catch (e) {
      console.error("Verify OTP Error:", e)
      // Check if it's a redirect error
      if ((e as Error).message === 'NEXT_REDIRECT') throw e
      throw e
  }

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  redirect('/')
}
