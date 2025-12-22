import { getProfile, getUserReports, upgradeLevel } from '@/app/actions/game'
import { logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, MapPin, Scan, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import PendingReportHandler from './PendingReportHandler'
import LevelUpOverlay from '@/app/components/LevelUpOverlay'
import DashboardInteractions from './interactions'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    try {
        const profile = await getProfile()
        if (!profile) redirect('/')

        const reports = await getUserReports()

        // Check for Level Up Condition
        const ranks = ['Cidadão', 'Cidadão Verificado', 'Colaborador', 'Autoridade', 'Conselheiro']
        const currentRankIdx = ranks.indexOf(profile.levelTitle || 'Cidadão')
        const calcRankIdx = ranks.indexOf(profile.calculatedLevel || 'Cidadão')
        const showLevelUp = calcRankIdx > currentRankIdx

        // Determine Display Name
        let displayName = profile.name || 'Cidadão'
        if (profile.fullName) {
             const parts = profile.fullName.split(' ')
             displayName = parts[0]
        }

        return (
            <main className="min-h-screen bg-gray-50 pb-20">
                <PendingReportHandler />

                {/* Level Up Overlay - Rendered conditionally */}
                {showLevelUp && (
                    <LevelUpOverlay
                        newLevel={profile.calculatedLevel}
                        onClaim={upgradeLevel}
                    />
                )}

                {/* Header */}
                <header className="bg-blue-800 text-white p-6 pb-12 rounded-b-3xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">Olá, {displayName}!</h1>
                            <p className="opacity-90">{profile.phone}</p>
                        </div>
                        <form action={logout}>
                            <button className="text-sm bg-blue-900 px-3 py-1 rounded">Sair</button>
                        </form>
                    </div>

                    <div className="bg-blue-700/50 p-4 rounded-xl flex items-center gap-4 border border-blue-500/30">
                        <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-md" />
                        <div>
                            <div className="text-sm opacity-75">Nível Atual</div>
                            <div className="text-2xl font-bold uppercase tracking-wider">{profile.levelTitle}</div>
                        </div>
                    </div>
                </header>

                {/* Client-side interactions (Verification Banner) */}
                <DashboardInteractions profile={profile} />

                <div className="p-6 space-y-6 -mt-6">
                    {/* Points Card */}
                    <div className="card flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">Seus Pontos</p>
                            <p className="text-4xl font-black text-blue-900">{profile.totalPoints}</p>
                        </div>
                        <Star className="w-10 h-10 text-yellow-500 fill-yellow-500 animate-[pulse_3s_infinite]" />
                    </div>

                    {/* Progress */}
                    <div className="card">
                        <div className="flex justify-between text-sm mb-2 font-bold text-gray-600">
                            <span>Próximo: {profile.calculatedLevel === 'Conselheiro' ? 'Máximo' : 'Nível Seguinte'}</span>
                            <span>{Math.round(profile.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-1000 relative"
                                style={{ width: `${profile.progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                        <p className="text-center mt-2 text-gray-500 text-sm">
                            {profile.calculatedLevel !== 'Conselheiro'
                                ? `Faltam ${Math.max(0, profile.nextLevelPoints - profile.totalPoints)} pontos`
                                : 'Você atingiu o nível máximo!'}
                        </p>
                    </div>

                    {/* Actions */}
                    <h3 className="text-xl font-bold text-gray-800 mt-8">O que fazer agora?</h3>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Scan Link -> /scan */}
                        <Link href="/scan" className="bg-white p-6 rounded-xl shadow border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-2 h-40 group">
                            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                                <Scan className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="font-bold text-center leading-tight text-gray-800">Escanear QR Code</span>
                        </Link>

                        <Link href="/map" className="bg-white p-6 rounded-xl shadow border-b-4 border-green-200 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-2 h-40 group">
                            <div className="bg-green-50 p-3 rounded-full group-hover:bg-green-100 transition-colors">
                                <MapPin className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="font-bold text-center leading-tight text-gray-800">Mapa do Tesouro</span>
                        </Link>
                    </div>

                    {/* My Reports */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Meus Reportes</h3>
                        <div className="space-y-3">
                            {reports.length === 0 ? (
                                <p className="text-gray-500 text-center italic bg-gray-100 p-4 rounded-lg">
                                    Você ainda não reportou problemas. <br/>
                                    <span className="text-sm">Escaneie um código ou use o mapa para começar!</span>
                                </p>
                            ) : (
                                reports.map((report: any) => (
                                    <div key={report.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500 flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 flex items-center gap-2">
                                                <AlertTriangle size={16} className="text-orange-500" />
                                                {report.data?.problemType || 'Problema'}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-1">{report.asset ? `Patrimônio #${report.asset.hashCode}` : 'Geral'}</p>

                                            {/* Admin Feedback */}
                                            {report.feedback && (
                                                <div className="mt-2 bg-blue-50 border border-blue-100 p-2 rounded text-xs text-blue-800">
                                                    <span className="font-bold">Resposta da Prefeitura:</span> {report.feedback}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                     ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                     ${report.status === 'APPROVED' ? 'bg-green-100 text-green-700' : ''}
                                     ${report.status === 'REJECTED' ? 'bg-red-100 text-red-700' : ''}
                                     ${!['PENDING', 'APPROVED', 'REJECTED'].includes(report.status) ? 'bg-blue-100 text-blue-700' : ''}
                                 `}>
                                                {report.status === 'PENDING' && 'Em Análise'}
                                                {report.status === 'APPROVED' && 'Aprovado'}
                                                {report.status === 'REJECTED' && 'Rejeitado'}
                                                {!['PENDING', 'APPROVED', 'REJECTED'].includes(report.status) && report.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Pontos</h3>
                        <div className="space-y-3">
                            {profile.pointsLedger.slice(0, 5).map((entry: any) => (
                                <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                    <span className="text-gray-700">{entry.description || 'Ação'}</span>
                                    <span className={`font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {entry.amount > 0 ? '+' : ''}{entry.amount}
                                    </span>
                                </div>
                            ))}
                            {profile.pointsLedger.length === 0 && (
                                <p className="text-gray-500 text-center italic">Nenhuma atividade recente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        )
    } catch (e: any) {
        // Force show error details
        return (
            <div className="p-10 text-red-600">
                <h1 className="text-2xl font-bold">Dashboard Crashed</h1>
                <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto">{e.toString()} {e.stack}</pre>
                <form action={logout} className="mt-6">
                    <button className="bg-red-600 text-white px-4 py-2 rounded">Force Logout</button>
                </form>
            </div>
        )
    }
}
