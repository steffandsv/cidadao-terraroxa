'use client'

import { verifyOTP } from '@/app/actions/auth'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function OTPForm() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    try {
      const otp = formData.get('otp') as string
      const res = await verifyOTP(phone, otp)
      if (res?.error) {
        setError(res.error)
      }
    } catch (e: any) {
      setError(e.message || "Erro inesperado")
    }
  }

  return (
      <div className="card w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2">Código de Acesso</h2>
        <p className="mb-6 text-gray-600">Enviado para {phone}</p>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-left text-lg font-medium text-gray-700 mb-2">Digite o código</label>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="0000"
              className="w-full text-center text-4xl tracking-widest p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
              maxLength={4}
              required
            />
          </div>
          {error && <p className="text-red-600 font-bold">{error}</p>}
          <button type="submit" className="btn-primary">
            Confirmar
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500">Use 0000 ou 1234 para testar</p>
      </div>
  )
}

export default function OTPPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <Suspense fallback={<div>Carregando...</div>}>
        <OTPForm />
      </Suspense>
    </main>
  )
}
