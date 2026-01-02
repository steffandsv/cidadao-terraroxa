import { getPublicWorkById } from '@/app/actions/public-works'
import WorkDetailsClient from './WorkDetailsClient'
import { notFound } from 'next/navigation'
import { getProfile } from '@/app/actions/game'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const work = await getPublicWorkById(Number(id))

  if (!work) {
    notFound()
  }

  // Get current user if authenticated
  let user = null
  try {
     const profile = await getProfile()
     if (profile) {
       user = profile
     }
  } catch (e) {
    // ignore
  }

  return <WorkDetailsClient work={work} user={user} />
}
