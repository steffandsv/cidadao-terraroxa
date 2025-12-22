import { prisma } from '@/lib/db'
import { setConfig, getMapConfig } from '@/app/actions/config'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const mapConfig = await getMapConfig()

    async function saveMapConfig(formData: FormData) {
        'use server'
        const lat = parseFloat(formData.get('lat') as string)
        const lng = parseFloat(formData.get('lng') as string)
        const zoom = parseInt(formData.get('zoom') as string)

        await setConfig('MAP_DEFAULT', { lat, lng, zoom })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Configurações do Sistema</h1>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">Padrão do Mapa</h2>
                <p className="text-gray-500 mb-4">Defina a localização inicial e zoom para todos os mapas do sistema.</p>

                <form action={saveMapConfig} className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Latitude</label>
                            <input
                                type="number" step="any" name="lat"
                                defaultValue={mapConfig.lat}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Longitude</label>
                            <input
                                type="number" step="any" name="lng"
                                defaultValue={mapConfig.lng}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Zoom (1-20)</label>
                        <input
                            type="number" name="zoom"
                            defaultValue={mapConfig.zoom}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Salvar Configurações
                    </button>
                </form>
            </div>
        </div>
    )
}
