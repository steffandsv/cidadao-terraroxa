import { getPendingVerifications, approveVerification, rejectVerification } from '@/app/actions/game'
import { Check, X } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function VerificationAdmin() {
    const pendings = await getPendingVerifications()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Verificações de Perfil Pendentes</h1>

            <div className="grid gap-4">
                {pendings.length === 0 && (
                    <p className="text-gray-500">Nenhuma verificação pendente.</p>
                )}
                {pendings.map((user: any) => (
                    <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{user.fullName}</h3>
                                <p className="text-gray-600">CPF: {user.cpf}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {user.addressStreet}, {user.addressNumber} - {user.addressZip}
                                </p>
                                <p className="text-xs text-gray-400">Usuário ID: {user.id} | Tel: {user.phone}</p>
                            </div>
                            <div className="flex gap-2">
                                <form action={async () => {
                                    'use server'
                                    await approveVerification(user.id)
                                }}>
                                    <button className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition-colors">
                                        <Check size={20} />
                                    </button>
                                </form>
                                <form action={async () => {
                                    'use server'
                                    await rejectVerification(user.id, "Dados inconsistentes")
                                }}>
                                    <button className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
