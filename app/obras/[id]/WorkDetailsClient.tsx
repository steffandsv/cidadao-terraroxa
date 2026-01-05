'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Calendar, DollarSign, Camera, CheckCircle, Trophy } from 'lucide-react'
import { submitInspection } from '@/app/actions/public-works'
import dynamic from 'next/dynamic'
import ImageUpload from '@/app/components/admin/ImageUpload'

// Leaflet map for location preview
const LeafletMap = dynamic(() => import('@/app/admin/review/components/ReviewMap'), { ssr: false })

export default function WorkDetails({ work, user }: { work: any, user: any }) {
  const router = useRouter()
  const [distance, setDistance] = useState<number | null>(null)
  const [canInspect, setCanInspect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showStamp, setShowStamp] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [showInterstitial, setShowInterstitial] = useState(false) // For Anonymous vs Login

  // Form state
  const [rating, setRating] = useState('')
  const [report, setReport] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [progressEstimate, setProgressEstimate] = useState(50)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)

  // Calculate progress
  const now = new Date().getTime()
  // Use progress from DB if available, otherwise calculate fallback (though DB should be source of truth now)
  const progress = work.progress !== undefined ? work.progress : 0

  useEffect(() => {
    if (navigator.geolocation && work.geoLat && work.geoLng) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setUserLat(lat)
          setUserLng(lng)

          const d = getDistanceFromLatLonInKm(lat, lng, work.geoLat, work.geoLng)
          setDistance(d * 1000) // Meters

          if (d <= 0.05) { // 50 meters
            setCanInspect(true)
          } else {
            setCanInspect(false)
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      )
    }
  }, [work.geoLat, work.geoLng])

  // Helper to format date relative time
  function timeAgo(dateString: string) {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffSec = Math.round(diffMs / 1000)
      const diffMin = Math.round(diffSec / 60)
      const diffHour = Math.round(diffMin / 60)
      const diffDay = Math.round(diffHour / 24)
      const diffWeek = Math.round(diffDay / 7)

      if (diffSec < 60) return 'agora mesmo'
      if (diffMin < 60) return `há ${diffMin} min`
      if (diffHour < 24) return `há ${diffHour} h`
      if (diffDay === 1) return 'há 1 dia'
      if (diffDay < 7) return `há ${diffDay} dias`
      if (diffWeek === 1) return 'há 1 semana'
      return `há ${diffWeek} semanas`
  }

  // Handle Initial Click on Inspect
  function handleInspectClick() {
      if (!canInspect) return;

      if (user) {
          // If logged in, go straight to form
          setFormVisible(true)
      } else {
          // If not logged in, show interstitial
          setShowInterstitial(true)
      }
  }

  function handleLoginRedirect() {
      // Save intent if possible, or just redirect.
      // Since the inspection requires proximity, saving state might be tricky if they come back later/elsewhere.
      // But we can try to save the work ID to open it again.
      // However, typical flow is simple redirect.
      router.push('/dashboard') // Or login page
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('workId', work.id.toString())
    // If user is null, this will be skipped, which is fine for anonymous
    if (user?.id) formData.append('userId', user.id.toString())
    formData.append('ratingSentiment', rating)
    formData.append('reportText', report)
    formData.append('photoEvidenceUrl', photoUrl)
    formData.append('progressEstimate', progressEstimate.toString())
    if (userLat) formData.append('lat', userLat.toString())
    if (userLng) formData.append('lng', userLng.toString())

    const result = await submitInspection(formData)

    if (result.success) {
      setFormVisible(false)
      setShowInterstitial(false) // Just in case
      setShowStamp(true)
      // Sound effect could be played here
      setTimeout(() => {
        router.refresh()
        setShowStamp(false)
        // Reset form
        setRating('')
        setReport('')
        setPhotoUrl('')
        setProgressEstimate(50)
      }, 3000)
    } else {
      alert(result.message)
    }
    setLoading(false)
  }

  // Handle Anonymous Submission via Interstitial
  // Actually, for anonymous, we just open the form but without user attached.
  // The backend supports userId=null.
  function handleAnonymousContinue() {
      setShowInterstitial(false)
      setFormVisible(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <Image
          src={work.coverPhotoUrl || '/placeholder.jpg'}
          alt={work.title}
          fill
          className="object-cover"
          onError={(e) => {
             // Fallback if image fails
             const target = e.target as HTMLImageElement;
             target.srcset = "/placeholder.jpg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <h1 className="text-2xl font-bold text-white">{work.title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
              <DollarSign size={14} /> ORÇAMENTO
            </div>
            <div className="font-bold text-lg text-emerald-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(work.budgetValue)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
              <Calendar size={14} /> PRAZO
            </div>
            <div className="font-bold text-lg text-blue-600">
              {work.deadlineDate ? new Date(work.deadlineDate).toLocaleDateString() : 'Indefinido'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700">Progresso Estimado</span>
            <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Fase Atual: <strong>{work.currentStatus}</strong></span>
            {work.statusDeadline && (
               <span>Meta Fase: {new Date(work.statusDeadline).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Inspection Button */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Fiscalização Cidadã</h3>
          <p className="text-sm text-gray-500 mb-4">
            Você está a <strong>{distance ? Math.round(distance) : '...'}m</strong> da obra.
            Aproxime-se a menos de 50m para realizar a vistoria.
          </p>

          <button
            onClick={handleInspectClick}
            disabled={!canInspect}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              canInspect
                ? 'bg-blue-600 text-white shadow-lg animate-pulse hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Camera size={20} />
            {canInspect ? 'FISCALIZAR OBRA' : 'APROXIME-SE PARA FISCALIZAR'}
          </button>
        </div>

        {/* Recent Inspections */}
        <div>
           <h3 className="text-lg font-bold text-gray-800 mb-4">Últimas Fiscalizações</h3>
           <div className="space-y-4">
             {work.inspections?.length === 0 && <p className="text-gray-400 italic">Nenhuma vistoria verificada ainda.</p>}
             {work.inspections?.map((insp: any) => (
               <div key={insp.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                 <div className={`w-2 h-full flex-shrink-0 rounded-full ${
                     insp.ratingSentiment === 'positive' ? 'bg-green-500' :
                     insp.ratingSentiment === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
                 }`}></div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-bold text-sm text-gray-800">
                        {insp.user?.name || 'Cidadão Anônimo'}
                     </span>
                     <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                       Verificado
                     </span>
                     <span className="text-gray-400 text-xs ml-auto">
                        {timeAgo(insp.createdAt)}
                     </span>
                   </div>
                   <p className="text-gray-600 text-sm mb-2">{insp.reportText}</p>
                   {insp.photoEvidenceUrl && (
                     <div className="relative h-24 w-full rounded-lg overflow-hidden">
                       <Image src={insp.photoEvidenceUrl} alt="Prova" fill className="object-cover" />
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Interstitial Modal (Login vs Anonymous) */}
      {showInterstitial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold text-center text-gray-800">Finalizar Fiscalização</h2>

                <div className="space-y-3">
                    <p className="text-center text-gray-600 text-sm">
                        Gostaria de acumular <span className="font-bold text-emerald-600">Pontos Cidadão</span> com esta fiscalização?
                    </p>

                    <button
                        onClick={handleLoginRedirect}
                        className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700"
                    >
                        <Trophy size={18} />
                        Sim, quero pontuar!
                    </button>

                    <button
                        onClick={handleAnonymousContinue}
                        className="w-full bg-gray-100 text-gray-600 p-3 rounded-xl font-semibold hover:bg-gray-200 mt-2"
                    >
                        Fiscalizar Anonimamente
                    </button>

                    <button onClick={() => setShowInterstitial(false)} className="w-full text-center text-sm text-gray-400 mt-2">
                        Voltar
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Inspection Form Modal */}
      {formVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
             <h2 className="text-xl font-bold mb-4">Fiscalizar Obra</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    O atual estágio da obra é: <span className="text-blue-600">{work.currentStatus}</span>.
                    Em sua opinião, você acredita que ela está:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['positive', 'neutral', 'negative'].map((s) => (
                       <button
                         key={s}
                         type="button"
                         onClick={() => setRating(s)}
                         className={`p-3 rounded-lg border text-sm font-bold ${
                           rating === s
                             ? 'border-blue-500 bg-blue-50 text-blue-700'
                             : 'border-gray-200 text-gray-500'
                         }`}
                       >
                         {s === 'positive' ? 'AVANÇADA' : s === 'neutral' ? 'LENTA' : 'PARADA'}
                       </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-semibold mb-2">
                     Qual a porcentagem de conclusão TOTAL que você acredita que ela está: <span className="text-blue-600">{progressEstimate}%</span>
                   </label>
                   <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressEstimate}
                      onChange={(e) => setProgressEstimate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                   />
                </div>

                <div>
                   <label className="block text-sm font-semibold mb-2">Observações</label>
                   <textarea
                     value={report}
                     onChange={e => setReport(e.target.value)}
                     className="w-full p-3 border rounded-lg"
                     rows={3}
                     placeholder="Descreva o que você vê..."
                     required
                   ></textarea>
                </div>

                <div>
                   <ImageUpload
                     label="Evidência Fotográfica"
                     value={photoUrl}
                     onChange={(url) => setPhotoUrl(url)}
                   />
                </div>

                <div className="flex gap-2 pt-4">
                   <button
                     type="button"
                     onClick={() => setFormVisible(false)}
                     className="flex-1 py-3 text-gray-600 font-semibold"
                   >
                     Cancelar
                   </button>
                   <button
                     type="submit"
                     disabled={loading}
                     className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg"
                   >
                     {loading ? 'Enviando...' : 'Carimbar e Enviar'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Stamp Animation Overlay */}
      {showStamp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="animate-stamp transform rotate-[-15deg] border-4 border-red-600 text-red-600 font-black text-4xl p-4 rounded-lg bg-red-100/20 backdrop-blur-sm uppercase tracking-widest shadow-2xl">
            Vistoria Registrada
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes stamp {
          0% { opacity: 0; transform: scale(5) rotate(-15deg); }
          50% { opacity: 1; transform: scale(0.8) rotate(-15deg); }
          70% { transform: scale(1.1) rotate(-15deg); }
          100% { transform: scale(1) rotate(-15deg); }
        }
        .animate-stamp {
          animation: stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  )
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}
