'use client'

import { createQuest } from '@/app/actions/quest'
import { useState } from 'react'

export default function CreateQuestPage() {
    const [useAI, setUseAI] = useState(false)

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Criar Nova Missão</h1>
            <form action={createQuest} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug (ID único)</label>
                        <input name="slug" type="text" className="w-full border rounded p-2" placeholder="ex: agente_dengue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input name="title" type="text" className="w-full border rounded p-2" placeholder="ex: Agente da Dengue" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pontos</label>
                        <input name="points" type="number" className="w-full border rounded p-2" defaultValue={10} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ícone (Emoji)</label>
                        <input name="icon" type="text" className="w-full border rounded p-2" defaultValue="🦟" />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold text-gray-800">Requisitos</h3>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input name="requiresLocation" type="checkbox" defaultChecked />
                            <span>Requer Localização</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input name="requiresPhoto" type="checkbox" defaultChecked />
                            <span>Requer Foto</span>
                        </label>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100">
                    <h3 className="font-semibold text-blue-800">Inteligência Artificial (Gemini)</h3>
                    <label className="flex items-center gap-2">
                        <input
                            name="aiValidation"
                            type="checkbox"
                            checked={useAI}
                            onChange={(e) => setUseAI(e.target.checked)}
                        />
                        <span>Habilitar Validação por IA</span>
                    </label>

                    {useAI && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prompt de Instrução para a IA</label>
                            <p className="text-xs text-gray-500 mb-2">Instrua a IA sobre como validar a foto. Ela retornará se a foto é "SUFFICIENT" ou pedirá mais.</p>
                            <textarea
                                name="aiPrompt"
                                rows={4}
                                className="w-full border rounded p-2 text-sm"
                                defaultValue="Analise esta imagem. Verifique se é uma foto de um quintal ou área externa residencial. Verifique se a iluminação é suficiente. Se estiver tudo ok, responda SUFFICIENT. Caso contrário, explique o problema."
                            ></textarea>
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded font-bold">Criar Missão</button>
            </form>
        </div>
    )
}
