import { prisma } from '@/lib/db'
import QuestRunner from './QuestRunner'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const rule = await prisma.gamificationRule.findUnique({
        where: { slug }
    })

    if (!rule) redirect('/dashboard')

    return <QuestRunner rule={rule} />
}
