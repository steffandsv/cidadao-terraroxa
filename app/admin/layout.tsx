import AdminSidebar from '@/app/components/admin/AdminSidebar'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Basic authorization check
  if (!session || session.user.role !== 'ADMIN') {
    // Check for dev bypass or redirect
    if (session?.user?.phone !== 'admin' && session?.user?.role !== 'ADMIN') {
       redirect('/')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
