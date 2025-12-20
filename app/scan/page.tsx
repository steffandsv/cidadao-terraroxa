'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    )

    scanner.render(
      (decodedText) => {
        // Success callback
        console.log("Scanned:", decodedText)
        scanner.clear()

        // Extract ID from URL (assuming format .../asset/123...)
        // We look for 'asset/' followed by digits
        const match = decodedText.match(/asset\/(\d+)/)
        if (match && match[1]) {
            router.push(`/asset/${match[1]}/report`)
        } else {
            // Fallback: If it's just a number, assume it's an ID
            if (!isNaN(Number(decodedText))) {
                router.push(`/asset/${decodedText}/report`)
            } else {
                setError(`QR Code inválido: ${decodedText}`)
            }
        }
      },
      (errorMessage) => {
        // Parse error, ignore for now as it triggers on every frame
      }
    )

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err))
    }
  }, [router])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Escanear Código QR</h1>

      <div id="reader" className="w-full max-w-sm bg-white rounded-xl overflow-hidden text-black"></div>

      {error && (
        <div className="mt-4 p-4 bg-red-600 text-white rounded-xl">
            {error}
            <button onClick={() => window.location.reload()} className="block mt-2 underline">Tentar novamente</button>
        </div>
      )}

      <button onClick={() => router.back()} className="mt-8 text-gray-400 underline">
        Voltar
      </button>
    </main>
  )
}
