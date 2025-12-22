'use client'

import { useState } from 'react'
import { updateAssetType, deleteAssetType } from '@/app/actions/admin/types'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Trash } from 'lucide-react'
import Link from 'next/link'
import { DynamicIcon } from '@/app/components/icons/DynamicIcon'

export default function EditAssetTypeForm({ type }: { type: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: type.name || '',
        icon: type.icon || '',
        schema: type.schema ? JSON.stringify(type.schema, null, 2) : '{}'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            JSON.parse(formData.schema)
        } catch (e) {
            alert('Schema invalid JSON')
            return
        }

        setIsLoading(true)
        const res = await updateAssetType(type.id, formData)
        setIsLoading(false)

        if (res.success) {
            router.push('/admin/types')
            router.refresh()
        } else {
            alert(res.error || 'Error updating asset type')
        }
    }

    const handleDelete = async () => {
        if (confirm('Tem certeza? Isso só funcionará se não houver ativos deste tipo.')) {
            setIsLoading(true)
            const res = await deleteAssetType(type.id)
            setIsLoading(false)
             if (res.success) {
                router.push('/admin/types')
                router.refresh()
            } else {
                alert(res.error || 'Error deleting asset type')
            }
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/types" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">Editar Tipo #{type.id}</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 disabled:opacity-50"
                    >
                        <Trash size={20} />
                        Excluir
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Tipo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ícone (Lucide ou fa-*)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <div className="p-2 bg-gray-100 rounded border flex items-center justify-center w-12 h-10">
                                <DynamicIcon name={formData.icon || 'box'} size={20} />
                            </div>
                        </div>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">JSON Schema</label>
                    <textarea
                        name="schema"
                        value={formData.schema}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                        rows={10}
                    />
                     <p className="text-xs text-gray-500 mt-1">Defina os campos extras e validações para este tipo de ativo.</p>
                </div>
            </div>
        </div>
    )
}
