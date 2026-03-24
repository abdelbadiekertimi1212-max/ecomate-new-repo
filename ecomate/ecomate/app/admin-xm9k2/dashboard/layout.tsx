import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin-xm9k2/login')

  const { data: profile } = await supabase.from('profiles').select('role,full_name').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050a14' }}>
      <AdminSidebar adminName={profile.full_name || 'Admin'} />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 36px' }}>
        {children}
      </main>
    </div>
  )
}
