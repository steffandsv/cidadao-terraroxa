'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeGenerator({ text }: { text: string }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    QRCode.toDataURL(text).then(setSrc)
  }, [text])

  if (!src) return <div>Gerando QR Code...</div>

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={src} alt="QR Code" className="border p-2 bg-white rounded-lg shadow-sm" width={200} height={200} />
      <a
        href={src}
        download={`qrcode-${text}.png`}
        className="text-sm text-blue-600 hover:underline"
      >
        Baixar Imagem
      </a>
    </div>
  )
}
