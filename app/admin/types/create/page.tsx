'use client'

import { createAssetType } from '@/app/actions/admin'
import { IconMap, DynamicIcon } from '@/app/components/icons/DynamicIcon'
import { useState } from 'react'

// Basic FontAwesome List (Subset for demo, in real app could fetch full list)
const FontAwesomeIcons = [
    "fa-solid fa-house", "fa-solid fa-user", "fa-solid fa-check", "fa-solid fa-download",
    "fa-solid fa-image", "fa-solid fa-phone", "fa-solid fa-bars", "fa-solid fa-envelope",
    "fa-solid fa-star", "fa-solid fa-location-dot", "fa-solid fa-music", "fa-solid fa-heart",
    "fa-solid fa-arrow-right", "fa-solid fa-circle", "fa-solid fa-bomb", "fa-solid fa-poo",
    "fa-solid fa-camera", "fa-solid fa-cloud", "fa-solid fa-comment", "fa-solid fa-pen",
    "fa-solid fa-truck", "fa-solid fa-city", "fa-solid fa-tree", "fa-solid fa-water",
    "fa-solid fa-fire", "fa-solid fa-bicycle", "fa-solid fa-bus", "fa-solid fa-plane",
    "fa-solid fa-road", "fa-solid fa-traffic-light", "fa-solid fa-sign-hanging", "fa-solid fa-shop",
    "fa-solid fa-landmark", "fa-solid fa-school", "fa-solid fa-hospital", "fa-solid fa-mosque",
    "fa-solid fa-church", "fa-solid fa-synagogue", "fa-solid fa-om", "fa-solid fa-gopuram"
]

export default function CreateAssetTypePage() {
    const [selectedIcon, setSelectedIcon] = useState('box')
    const [showFaModal, setShowFaModal] = useState(false)
    const [faSearch, setFaSearch] = useState('')

    const defaultSchema = {
        problems: ["Problema 1", "Problema 2"],
        validation: {
            photo: "required",
            location: true,
            description: "optional"
        }
    }

    const filteredFaIcons = FontAwesomeIcons.filter(i => i.includes(faSearch))

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

                        <div className="flex gap-2 items-start">
                             <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
                                 <DynamicIcon name={selectedIcon} className="w-8 h-8 text-emerald-600" />
                             </div>
                             <div className="flex-1">
                                <div className="grid grid-cols-6 gap-2 border rounded-lg p-2 mb-2">
                                    {Object.keys(IconMap).slice(0, 5).map((iconKey) => (
                                        <button
                                            key={iconKey}
                                            type="button"
                                            onClick={() => setSelectedIcon(iconKey)}
                                            className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center transition-colors ${selectedIcon === iconKey ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-500' : 'text-gray-500'}`}
                                        >
                                            <DynamicIcon name={iconKey} className="w-5 h-5" />
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setShowFaModal(true)}
                                        className="p-2 rounded hover:bg-gray-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-dashed border-blue-300"
                                    >
                                        + Mais
                                    </button>
                                </div>
                             </div>
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

            {/* FontAwesome Selection Modal */}
            {showFaModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Biblioteca de Ícones (FontAwesome)</h3>
                            <button onClick={() => setShowFaModal(false)} className="text-gray-500 hover:text-gray-700">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar ícone (ex: user, home, star)..."
                            className="w-full border rounded-lg p-3 mb-4"
                            value={faSearch}
                            onChange={(e) => setFaSearch(e.target.value)}
                        />
                        <div className="flex-1 overflow-y-auto grid grid-cols-6 sm:grid-cols-8 gap-4 p-2 border rounded-lg bg-gray-50">
                            {filteredFaIcons.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => { setSelectedIcon(icon); setShowFaModal(false); }}
                                    className={`aspect-square flex flex-col items-center justify-center gap-2 p-2 rounded hover:bg-white hover:shadow transition ${selectedIcon === icon ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-500' : 'text-gray-600'}`}
                                >
                                    <i className={`${icon} text-xl`}></i>
                                </button>
                            ))}
                        </div>
                     </div>
                </div>
            )}
        </div>
    )
}
