'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Eye, Edit, Trash, Ban } from 'lucide-react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { banUser } from '@/app/actions/admin/users'

export default function UserActions({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPos({
            top: rect.bottom + window.scrollY,
            left: rect.right + window.scrollX - 192 // 192px is w-48
        })
    }
  }, [isOpen])

  const handleBan = async () => {
    if (confirm('Tem certeza que deseja banir este usuário?')) {
        await banUser(user.id)
        setIsOpen(false)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 relative"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && createPortal(
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
            ></div>
            <div
                className="absolute bg-white rounded-lg shadow-xl border z-50 py-1 w-48 animate-in fade-in zoom-in-95 duration-100"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
            >
                <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                    onClick={() => setIsOpen(false)}
                >
                    <Eye size={16} /> Ver Perfil
                </Link>
                <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                    onClick={() => setIsOpen(false)}
                >
                    <Edit size={16} /> Editar
                </Link>
                <button
                    onClick={handleBan}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t mt-1"
                >
                    <Ban size={16} /> Banir
                </button>
            </div>
        </>,
        document.body
      )}
    </>
  )
}
