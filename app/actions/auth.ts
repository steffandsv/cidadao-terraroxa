'use server'

import { prisma } from '@/lib/db'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  try {
    const phone = formData.get('phone') as string

    if (!phone) {
        return
    }

    let user = await prisma.user.findUnique({ where: { phone } })

    if (!user) {
      user = await prisma.user.create({
        data: { phone }
      })
    }

  } catch (e) {
    console.error("Login Error:", e)
    throw e
  }

  const phone = formData.get('phone') as string
  redirect(`/otp?phone=${phone}`)
}

export async function verifyOTP(phone: string, otp: string) {
  let isFirstLogin = false
  try {
    if (otp === '1234' || otp === '0000') {
      const user = await prisma.user.findUnique({ where: { phone } })
      if (!user) return { error: 'Usuário não encontrado' }

      // Check if it's potentially a first login or we should show welcome
      // We can check if name is null (new user) or created very recently
      if (!user.name && user.role === 'USER') {
          isFirstLogin = true
      }

      const session = await encrypt({ user: { id: user.id, phone: user.phone, name: user.name, role: user.role } })

      const cookieStore = await cookies()
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
      if ((e as Error).message === 'NEXT_REDIRECT') throw e
      throw e
  }

  if (isFirstLogin) {
      redirect('/dashboard?welcome=1')
  } else {
      redirect('/dashboard')
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  redirect('/')
}
