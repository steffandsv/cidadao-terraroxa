'use client'

import { useState } from 'react'
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react'

export default function UserActions({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <>
            <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20 py-1">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700">
                    <Eye size={16} /> Ver Perfil
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700">
                    <Edit size={16} /> Editar
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t mt-1">
                    <Trash size={16} /> Banir
                </button>
            </div>
        </>
      )}
    </div>
  )
}
