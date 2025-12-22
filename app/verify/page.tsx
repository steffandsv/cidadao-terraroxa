'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { submitVerification } from '@/app/actions/game'
import Link from 'next/link'

export default function VerificationPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // CPF Mask
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 11) value = value.slice(0, 11)
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        e.target.value = value
    }

    const validateCPF = (cpf: string) => {
        cpf = cpf.replace(/[^\d]+/g, '')
        if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
        let add = 0
        for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
        let rev = 11 - (add % 11)
        if (rev === 10 || rev === 11) rev = 0
        if (rev !== parseInt(cpf.charAt(9))) return false
        add = 0
        for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
        rev = 11 - (add % 11)
        if (rev === 10 || rev === 11) rev = 0
        if (rev !== parseInt(cpf.charAt(10))) return false
        return true
    }

    async function handleSubmit(formData: FormData) {
        setError('')
        setLoading(true)

        const cpf = formData.get('cpf') as string
        if (!validateCPF(cpf)) {
            setError('CPF Inválido. Verifique os números.')
            setLoading(false)
            return
        }

        const res = await submitVerification(formData)
        if (res.success) {
            router.push('/dashboard?success=verification_submitted')
        } else {
            setError(res.message || 'Erro ao enviar.')
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <Link href="/dashboard" className="text-gray-500 flex items-center gap-2 mb-6 hover:text-gray-800">
                    <ArrowLeft size={20} /> Voltar
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Verificação de Perfil</h1>
                        <p className="text-gray-500 mt-2">
                            Preencha seus dados para obter o selo de Cidadão Verificado e desbloquear novos níveis.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm font-medium">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input
                                name="fullName"
                                required
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Seu nome completo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                            <input
                                name="cpf"
                                required
                                type="text"
                                onChange={handleCpfChange}
                                maxLength={14}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="000.000.000-00"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                                <input
                                    name="street"
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                <input
                                    name="number"
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                <input
                                    name="zip"
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="00000-000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Município/UF</label>
                                <div className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-500">
                                    Terra Roxa / SP
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-600/20 mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar para Análise'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
