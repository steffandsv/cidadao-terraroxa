'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Eye, Edit, Trash, QrCode } from 'lucide-react'
import QRCodeGenerator from '@/app/components/admin/QRCodeGenerator'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { deletePublicWork } from '@/app/actions/admin/public-works'
import { useRouter } from 'next/navigation'

export default function WorkActions({ work }: { work: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const router = useRouter()

  useEffect(() => {
    if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPos({
            top: rect.bottom + window.scrollY,
            left: rect.right + window.scrollX - 192 // 192px is w-48
        })
    }
  }, [isOpen])

  const handleDelete = async () => {
      if (confirm('Tem certeza que deseja apagar esta obra? Esta ação não pode ser desfeita.')) {
          await deletePublicWork(work.id)
          setIsOpen(false)
          router.refresh()
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
                <button
                    onClick={() => { setShowQR(true); setIsOpen(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                >
                    <QrCode size={16} /> Ver QR Code
                </button>
                <a
                    href={`/obras/${work.id}`}
                    target="_blank"
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                    onClick={() => setIsOpen(false)}
                >
                    <Eye size={16} /> Ver Detalhes
                </a>
                <Link
                    href={`/admin/works/${work.id}/edit`}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                    onClick={() => setIsOpen(false)}
                >
                    <Edit size={16} /> Editar
                </Link>
                <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t mt-1"
                >
                    <Trash size={16} /> Apagar
                </button>
            </div>
        </>,
        document.body
      )}

      {/* QR Code Modal */}
      {showQR && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full relative">
                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <span className="text-2xl">&times;</span>
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-center">QR Code da Obra</h3>
                  <div className="flex justify-center mb-4">
                     {/* Pass custom path for Works */}
                     <QRCodeGenerator text={work.qrHash} customPath={`/obras/${work.id}`} />
                  </div>
                  <p className="text-center text-gray-500 text-sm">{work.title}</p>
              </div>
          </div>,
          document.body
      )}
    </>
  )
}
