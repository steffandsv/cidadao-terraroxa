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
  const phone = formData.get('phone') as string

  if (!phone) {
      // In server actions used as form actions, we can't easily return errors to UI without client components.
      // For simplicity in this demo, we just ignore or redirect.
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

  redirect(`/otp?phone=${phone}`)
}

export async function verifyOTP(phone: string, otp: string) {
  // Mock verification
  if (otp === '1234' || otp === '0000') {
    // Success
    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) return { error: 'Usuário não encontrado' }

    // Create session
    const session = await encrypt({ user: { id: user.id, phone: user.phone, name: user.name, role: user.role } })

    const cookieStore = await cookies()
    cookieStore.set('session', session, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    redirect('/dashboard')
  } else {
    return { error: 'Código inválido' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  redirect('/')
}
