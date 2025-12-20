'use client'

import { createAssetType } from '@/app/actions/admin'
import { IconMap, DynamicIcon } from '@/app/components/icons/DynamicIcon'
import { useState } from 'react'

export default function CreateAssetTypePage() {
    const [selectedIcon, setSelectedIcon] = useState('box')

    const defaultSchema = {
        problems: ["Problema 1", "Problema 2"],
        validation: {
            photo: "required",
            location: true,
            description: "optional"
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Criar Tipo de Patrimônio</h1>
            <form action={createAssetType} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input name="name" type="text" placeholder="Ex: Praça, Monumento" className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                        <input type="hidden" name="icon" value={selectedIcon} />
                        <div className="grid grid-cols-6 gap-2 border rounded-lg p-2">
                            {Object.keys(IconMap).map((iconKey) => (
                                <button
                                    key={iconKey}
                                    type="button"
                                    onClick={() => setSelectedIcon(iconKey)}
                                    className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center transition-colors ${selectedIcon === iconKey ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-500' : 'text-gray-500'}`}
                                >
                                    <DynamicIcon name={iconKey} className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Definição do Formulário (JSON Schema)</label>
                    <p className="text-xs text-gray-500 mb-2">Configure os problemas reportáveis e regras de validação.</p>
                    <textarea
                        name="schema"
                        rows={10}
                        className="w-full border rounded-lg p-3 font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                        defaultValue={JSON.stringify(defaultSchema, null, 4)}
                    ></textarea>
                </div>

                <div className="pt-4 border-t">
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Salvar Tipo de Patrimônio
                    </button>
                </div>
            </form>
        </div>
    )
}
