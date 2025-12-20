import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/asset/${id}/report`)
}
