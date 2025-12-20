'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeGenerator({ text }: { text: string }) {
  const [src, setSrc] = useState('')

  // In production, the base URL should be dynamic or env var.
  // Assuming the user scans this to report a problem.
  // The logic in /scan handles the extraction of the ID from this URL.
  // If text is "1", the URL becomes "https://cidadao.terraroxa.sp.gov.br/asset/1"
  // The scanner parses the ID "1" and goes to /asset/1/report.
  const baseUrl = 'https://cidadao.terraroxa.sp.gov.br'
  const fullUrl = `${baseUrl}/asset/${text}`

  useEffect(() => {
    QRCode.toDataURL(fullUrl).then(setSrc)
  }, [fullUrl])

  if (!src) return <div>Gerando QR Code...</div>

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={src} alt="QR Code" className="border p-2 bg-white rounded-lg shadow-sm" width={200} height={200} />
      <p className="text-xs text-gray-500 font-mono text-center break-all w-full max-w-[200px]">{fullUrl}</p>
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
