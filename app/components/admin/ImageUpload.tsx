'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    label?: string
}

export default function ImageUpload({ value, onChange, label = 'Imagem' }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(value)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                setPreview(data.url)
                onChange(data.url)
            } else {
                alert('Erro ao enviar imagem')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao enviar imagem')
        }
        setLoading(false)
    }

    const removeImage = () => {
        setPreview('')
        onChange('')
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>

            {!preview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                    />
                    {loading ? (
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-sm text-gray-500">Enviando...</span>
                        </div>
                    ) : (
                        <>
                            <Upload className="text-gray-400 mb-2" size={32} />
                            <span className="text-sm text-gray-500 font-medium">Clique para selecionar uma imagem</span>
                        </>
                    )}
                </div>
            ) : (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 group">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
            <input type="hidden" name={label === 'Foto de Capa' ? 'coverPhotoUrl' : 'image'} value={preview || ''} />
        </div>
    )
}
