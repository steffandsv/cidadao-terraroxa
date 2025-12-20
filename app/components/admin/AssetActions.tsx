'use client'

import { useState } from 'react'
import { MoreHorizontal, Eye, Edit, Trash, QrCode } from 'lucide-react'
import QRCodeGenerator from '@/app/components/admin/QRCodeGenerator'

export default function AssetActions({ asset }: { asset: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)

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
                <button
                    onClick={() => { setShowQR(true); setIsOpen(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                >
                    <QrCode size={16} /> Ver QR Code
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700">
                    <Eye size={16} /> Ver Detalhes
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700">
                    <Edit size={16} /> Editar
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t mt-1">
                    <Trash size={16} /> Apagar
                </button>
            </div>
        </>
      )}

      {/* QR Code Modal */}
      {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full relative">
                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <span className="text-2xl">&times;</span>
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-center">QR Code do Ativo</h3>
                  <div className="flex justify-center mb-4">
                     <QRCodeGenerator text={asset.id.toString()} />
                  </div>
                  <p className="text-center text-gray-500 text-sm">{asset.description}</p>
              </div>
          </div>
      )}
    </div>
  )
}
