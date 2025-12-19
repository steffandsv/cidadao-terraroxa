'use client'

import { createAssetType } from '@/app/actions/admin'

export default function CreateAssetTypePage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Criar Tipo de Patrimônio</h1>
            <form action={createAssetType} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome (Ex: Praça, Monumento)</label>
                    <input name="name" type="text" className="w-full border rounded p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Schema JSON (Opcional)</label>
                    <p className="text-xs text-gray-500 mb-2">Defina campos extras. Ex: {`{ "fields": [{"name": "artist", "label": "Artista"}] }`}</p>
                    <textarea name="schema" rows={5} className="w-full border rounded p-2 font-mono text-sm" defaultValue={`{ "fields": [] }`}></textarea>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded">Salvar</button>
            </form>
        </div>
    )
}
