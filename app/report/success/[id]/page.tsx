export default async function ReportSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-8 border-emerald-500">
        <div className="text-6xl mb-6">💖</div>

        <h1 className="text-2xl font-black text-gray-800 mb-4">
          Obrigado bem feitor anônimo!
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Você acaba de nos ajudar a cuidar do nosso patrimônio público, a cidade agradece 💖
        </p>

        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Identificador da Indicação</p>
          <p className="text-3xl font-mono font-bold text-gray-800">#{id}</p>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Sua indicação foi enviada aos gestores.
        </p>
      </div>
    </main>
  )
}
