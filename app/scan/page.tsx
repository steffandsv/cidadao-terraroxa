'use client'

import { useEffect, useState, useRef } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup
      if (scannerRef.current) {
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
            scannerRef.current.stop().catch(console.error)
        }
      }
    }
  }, [])

  const startScanning = async () => {
    try {
        setError(null)
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader")
        }

        await scannerRef.current.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                // Success
                console.log("Scanned:", decodedText)
                if(scannerRef.current) scannerRef.current.stop().catch(console.error)

                const match = decodedText.match(/asset\/(\d+)/)
                if (match && match[1]) {
                    router.push(`/asset/${match[1]}/report`)
                } else {
                    if (!isNaN(Number(decodedText))) {
                        router.push(`/asset/${decodedText}/report`)
                    } else {
                        setError(`QR Code inválido: ${decodedText}`)
                    }
                }
            },
            (errorMessage) => {
                // Ignore frame parse errors
            }
        )
        setPermissionGranted(true)
    } catch (err: any) {
        console.error("Camera Error:", err)
        setError("Não foi possível acessar a câmera. Verifique as permissões.")
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Escanear Código QR</h1>

      {!permissionGranted ? (
          <div className="text-center">
              <p className="mb-6 text-gray-300">Precisamos de acesso à sua câmera para ler o QR Code do patrimônio.</p>
              <button
                onClick={startScanning}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition"
              >
                  Abrir Câmera
              </button>
          </div>
      ) : (
          <div id="reader" className="w-full max-w-sm bg-white rounded-xl overflow-hidden text-black h-[300px]"></div>
      )}

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
