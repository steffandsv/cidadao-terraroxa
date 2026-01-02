import { getInspections, updateInspectionStatus } from '@/app/actions/admin/public-works'
import Image from 'next/image'
import { Check, X, MapPin } from 'lucide-react'
import InspectionActions from './InspectionActions'

export default async function InspectionsPage() {
  const inspections = await getInspections('PENDING')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Validação de Vistorias Cidadãs</h1>

      <div className="grid gap-6">
        {inspections.length === 0 && (
            <div className="bg-white p-8 rounded-xl text-center text-gray-500 shadow">
                Nenhuma vistoria pendente.
            </div>
        )}

        {inspections.map((insp: any) => (
          <div key={insp.id} className="bg-white rounded-xl shadow p-6 flex gap-6">
            {/* Evidence Photo */}
            <div className="w-1/3 max-w-[300px] shrink-0">
               {insp.photoEvidenceUrl ? (
                 <div className="relative h-48 w-full rounded-lg overflow-hidden border">
                    <Image src={insp.photoEvidenceUrl} alt="Prova" fill className="object-cover" />
                 </div>
               ) : (
                 <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
                    Sem Foto
                 </div>
               )}
            </div>

            {/* Details */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{insp.work.title}</h2>
                    <span className="text-sm text-gray-500">{new Date(insp.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <span className="font-semibold">{insp.user?.name || 'Anônimo'}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        insp.ratingSentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        insp.ratingSentiment === 'neutral' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {insp.ratingSentiment === 'positive' ? 'Avançando' : insp.ratingSentiment === 'neutral' ? 'Lenta' : 'Parada'}
                    </span>
                    <span>•</span>
                    <span className={`flex items-center gap-1 ${insp.isVerifiedLoc ? 'text-green-600' : 'text-red-500'}`}>
                        <MapPin size={12} />
                        {insp.isVerifiedLoc ? 'Localização Confirmada' : 'Fora do Local'}
                    </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-gray-800 italic border border-gray-100">
                    "{insp.reportText}"
                </div>

                <InspectionActions id={insp.id} userId={insp.userId} isVerifiedLoc={insp.isVerifiedLoc} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
