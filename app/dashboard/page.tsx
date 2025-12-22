import { getProfile, getUserReports } from '@/app/actions/game'
import { logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, MapPin, Scan, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import PendingReportHandler from './PendingReportHandler'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    try {
        const profile = await getProfile()
        if (!profile) redirect('/')

        const reports = await getUserReports()

        return (
            <main className="min-h-screen bg-gray-50 pb-20">
                <PendingReportHandler />
                {/* Header */}
                <header className="bg-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">Olá, {profile.name || 'Cidadão'}!</h1>
                            <p className="opacity-90">{profile.phone}</p>
                        </div>
                        <form action={logout}>
                            <button className="text-sm bg-blue-900 px-3 py-1 rounded">Sair</button>
                        </form>
                    </div>

                    <div className="bg-blue-700/50 p-4 rounded-xl flex items-center gap-4">
                        <Trophy className="w-12 h-12 text-yellow-300" />
                        <div>
                            <div className="text-sm opacity-75">Nível Atual</div>
                            <div className="text-2xl font-bold uppercase tracking-wider">{profile.level}</div>
                        </div>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Points Card */}
                    <div className="card flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">Seus Pontos</p>
                            <p className="text-4xl font-black text-blue-900">{profile.totalPoints}</p>
                        </div>
                        <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                    </div>

                    {/* Progress */}
                    <div className="card">
                        <div className="flex justify-between text-sm mb-2 font-bold text-gray-600">
                            <span>Progresso para o próximo nível</span>
                            <span>{Math.round(profile.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                            <div
                                className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                                style={{ width: `${profile.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-center mt-2 text-gray-500 text-sm">Faltam {profile.nextLevel - profile.totalPoints} pontos</p>
                    </div>

                    {/* Actions */}
                    <h3 className="text-xl font-bold text-gray-800 mt-8">O que fazer agora?</h3>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Scan Link -> /scan */}
                        <Link href="/scan" className="bg-white p-6 rounded-xl shadow border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-2 h-40">
                            <Scan className="w-10 h-10 text-blue-600" />
                            <span className="font-bold text-center leading-tight">Escanear QR Code</span>
                        </Link>

                        <Link href="/map" className="bg-white p-6 rounded-xl shadow border-b-4 border-green-200 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-2 h-40">
                            <MapPin className="w-10 h-10 text-green-600" />
                            <span className="font-bold text-center leading-tight">Mapa do Tesouro</span>
                        </Link>
                    </div>

                    {/* My Reports */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Meus Reportes</h3>
                        <div className="space-y-3">
                            {reports.length === 0 ? (
                                <p className="text-gray-500 text-center italic">Você ainda não reportou problemas.</p>
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
