'use client'

import { useState, useMemo } from 'react'
import { MapPin, Check, X, Search, Calendar, Filter, Save, AlertTriangle } from 'lucide-react'
import { reviewAction } from '@/app/actions/review'
import dynamic from 'next/dynamic'

// Dynamically import Map with no SSR
const ReviewMap = dynamic(() => import('./ReviewMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Carregando Mapa...</div>
})

export default function ReviewManagement({ initialReviews, assetTypes, mapConfig }: { initialReviews: any[], assetTypes: any[], mapConfig: any }) {
    const [reviews, setReviews] = useState(initialReviews)
    const [filterDate, setFilterDate] = useState('')
    const [filterType, setFilterType] = useState('ALL')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedReview, setSelectedReview] = useState<any>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    // Filter Logic
    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const matchesDate = filterDate ? review.createdAt.startsWith(filterDate) : true
            const matchesType = filterType === 'ALL' ? true : review.asset?.assetTypeId === parseInt(filterType)
            const matchesStatus = filterStatus === 'ALL' ? true : review.status === filterStatus

            const searchLower = searchQuery.toLowerCase()
            const matchesSearch = !searchQuery ||
                (review.user?.name?.toLowerCase() || '').includes(searchLower) ||
                (review.user?.phone || '').includes(searchLower) ||
                (review.asset?.hashCode || '').includes(searchLower) ||
                (review.rule?.title || '').toLowerCase().includes(searchLower) ||
                (review.data?.description || '').toLowerCase().includes(searchLower)

            return matchesDate && matchesType && matchesStatus && matchesSearch
        })
    }, [reviews, filterDate, filterType, filterStatus, searchQuery])

    // Derived Status List (including custom ones found in data)
    const allStatuses = useMemo(() => {
        const statuses = new Set(['PENDING', 'APPROVED', 'REJECTED'])
        reviews.forEach(r => statuses.add(r.status))
        return Array.from(statuses)
    }, [reviews])

    // Handle Status Change
    const handleStatusChange = async (reviewId: number, newStatus: string, feedback: string) => {
        setIsUpdating(true)
        try {
            await reviewAction(reviewId, newStatus, feedback)
            setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus, feedback } : r))
            if (selectedReview?.id === reviewId) {
                setSelectedReview((prev: any) => ({ ...prev, status: newStatus, feedback }))
            }
        } catch (error) {
            console.error("Failed to update status", error)
            alert("Erro ao atualizar status")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por usuário, patrimônio, descrição..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
                        <Calendar size={16} className="text-gray-500" />
                        <input
                            type="date"
                            className="bg-transparent outline-none text-sm"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            className="bg-transparent outline-none text-sm"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="ALL">Todos os Tipos</option>
                            {assetTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <select
                        className="border rounded-lg px-3 py-2 bg-gray-50 text-sm outline-none"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Todos os Status</option>
                        {allStatuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* List View */}
                <div className="lg:col-span-1 overflow-y-auto space-y-4 pr-2">
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Nenhum resultado encontrado.</div>
                    ) : (
                        filteredReviews.map(review => (
                            <div
                                key={review.id}
                                onClick={() => setSelectedReview(review)}
                                className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition hover:shadow-md ${selectedReview?.id === review.id ? 'ring-2 ring-blue-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase
                                        ${review.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                        ${review.status === 'APPROVED' ? 'bg-green-100 text-green-700' : ''}
                                        ${review.status === 'REJECTED' ? 'bg-red-100 text-red-700' : ''}
                                        ${!['PENDING', 'APPROVED', 'REJECTED'].includes(review.status) ? 'bg-blue-100 text-blue-700' : ''}
                                    `}>
                                        {review.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>

                                {review.evidenceUrl && (
                                    <div className="h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={review.evidenceUrl} alt="Prova" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <h3 className="font-bold text-gray-800 text-sm mb-1">
                                    {review.asset ? `${review.asset.assetType?.name || 'Item'} #${review.asset.hashCode}` : 'Geral'}
                                </h3>
                                <p className="text-xs text-gray-600 mb-2">Por: {review.user?.name || review.user?.phone || 'Anônimo'}</p>

                                {review.data?.description && (
                                    <p className="text-sm text-gray-700 line-clamp-2">{review.data.description}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Map View */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden relative">
                    <ReviewMap
                        reviews={filteredReviews}
                        onSelectReview={setSelectedReview}
                        selectedId={selectedReview?.id}
                        defaultCenter={mapConfig}
                        defaultZoom={mapConfig.zoom}
                    />
                </div>
            </div>

            {/* Selected Review Overlay / Modal - FIXED via Fixed Position Portal-like style */}
            {selectedReview && (
                <div className="fixed top-20 right-4 w-96 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-xl shadow-2xl border p-6 z-[9999] animate-in slide-in-from-right">
                    <button
                        onClick={() => setSelectedReview(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="font-bold text-lg mb-4">Detalhes da Revisão</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">Status</label>
                            <div className="flex gap-2 mt-1">
                                <select
                                    value={selectedReview.status}
                                    onChange={(e) => handleStatusChange(selectedReview.id, e.target.value, selectedReview.feedback || '')}
                                    className="w-full border rounded-lg p-2 text-sm bg-white"
                                    disabled={isUpdating}
                                >
                                    <option value="PENDING">Em Análise (PENDING)</option>
                                    <option value="Resolvendo">Resolvendo</option>
                                    <option value="Resolvida">Resolvida</option>
                                    <option value="Inválida">Inválida</option>
                                    <option value="APPROVED">Aprovado (APPROVED)</option>
                                    <option value="REJECTED">Rejeitado (REJECTED)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Feedback para o Cidadão</label>
                            <textarea
                                value={selectedReview.feedback || ''}
                                onChange={(e) => {
                                    // Update local state immediately for typing
                                    setSelectedReview((prev: any) => ({ ...prev, feedback: e.target.value }))
                                }}
                                onBlur={(e) => handleStatusChange(selectedReview.id, selectedReview.status, e.target.value)}
                                className="w-full border rounded-lg p-2 text-sm min-h-[80px]"
                                placeholder="Escreva uma mensagem para o cidadão..."
                            />
                        </div>

                        {selectedReview.evidenceUrl && (
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Foto</label>
                                <a href={selectedReview.evidenceUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={selectedReview.evidenceUrl} alt="Evidence" className="w-full rounded-lg border hover:opacity-90 transition" />
                                </a>
                            </div>
                        )}

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Descrição</label>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm border">
                                <p className="font-bold text-gray-800 mb-1">{selectedReview.data?.problemType}</p>
                                <p className="text-gray-600">{selectedReview.data?.description || 'Sem descrição'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Localização</label>
                            <p className="text-sm flex items-center gap-1">
                                <MapPin size={14} />
                                {selectedReview.asset ?
                                    `${selectedReview.asset.assetType?.name} #${selectedReview.asset.hashCode}` :
                                    'Localização Geral'
                                }
                            </p>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Usuário</label>
                            <p className="text-sm">{selectedReview.user?.name || 'Sem nome'} ({selectedReview.user?.phone || 'Sem telefone'})</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
