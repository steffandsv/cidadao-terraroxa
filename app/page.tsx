import { login } from '@/app/actions/auth'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-blue-800 mb-2">Terra Roxa</h1>
        <p className="text-xl text-gray-600">Sistema Nervoso Digital</p>
      </div>

      <div className="card w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Entrar</h2>
        <form action={login} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-left text-lg font-medium text-gray-700 mb-2">Seu Celular</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="11 99999-9999"
              className="w-full text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Receber Código
          </button>
        </form>
      </div>

      <p className="mt-8 text-gray-500 text-sm">Versão 2.0 (Next.js)</p>
    </main>
  )
}
