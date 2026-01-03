'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download, FileImage } from 'lucide-react'

export default function QRCodeGenerator({ text, customPath }: { text: string, customPath?: string }) {
  const [src, setSrc] = useState('')

  const baseUrl = 'https://cidadao.terraroxa.sp.gov.br'
  const fullUrl = customPath ? `${baseUrl}${customPath}` : `${baseUrl}/asset/${text}`

  useEffect(() => {
    // Generate preview
    QRCode.toDataURL(fullUrl, { width: 400 }).then(setSrc)
  }, [fullUrl])

  const downloadPNG = async () => {
    try {
        const url = await QRCode.toDataURL(fullUrl, { width: 4096 })
        const a = document.createElement('a')
        a.href = url
        a.download = `qrcode-${text}-4k.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    } catch(e) { console.error(e) }
  }

  const downloadSVG = async () => {
    try {
        const svgString = await QRCode.toString(fullUrl, { type: 'svg' })
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `qrcode-${text}.svg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    } catch(e) { console.error(e) }
  }

  if (!src) return <div>Gerando QR Code...</div>

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={src} alt="QR Code Preview" className="border p-2 bg-white rounded-lg shadow-sm" width={200} height={200} />
      <p className="text-xs text-gray-500 font-mono text-center break-all w-full max-w-[200px]">{fullUrl}</p>

      <div className="flex gap-2 w-full">
        <button
            onClick={downloadPNG}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition"
        >
            <FileImage size={16} /> PNG (4K)
        </button>
        <button
            onClick={downloadSVG}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-xs font-bold transition"
        >
            <Download size={16} /> SVG
        </button>
      </div>
    </div>
  )
}
