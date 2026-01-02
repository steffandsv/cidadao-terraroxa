import { updatePublicWork, deletePublicWork } from '@/app/actions/admin/public-works'
import { getPublicWorkById } from '@/app/actions/public-works'
import EditWorkForm from './EditWorkForm'
import { notFound } from 'next/navigation'

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const work = await getPublicWorkById(Number(id))

  if (!work) notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Obra: {work.title}</h1>
      <EditWorkForm work={work} />
    </div>
  )
}
