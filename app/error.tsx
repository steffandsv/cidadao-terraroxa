'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
        <p className="text-gray-700 mb-2">Um erro inesperado ocorreu. Detalhes técnicos abaixo:</p>

        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-6">
            <p className="font-bold text-red-400">{error.name}: {error.message}</p>
            {error.digest && <p className="text-gray-500 mt-2">Digest: {error.digest}</p>}
            {error.stack && (
                <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{error.stack}</pre>
            )}
        </div>

        <div className="flex gap-4">
            <button
            onClick={() => reset()}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
            >
            Tentar novamente
            </button>
            <a
            href="/"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
            >
            Voltar ao Início
            </a>
        </div>
      </div>
    </div>
  )
}
