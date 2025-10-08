import AdminLogs from '@/components/admin/AdminLogs'
import { listAdminLogs } from '@/actions/database-actions'

async function page() {
  const logs = await listAdminLogs()
  return (
    <div>
      <AdminLogs logs={logs} />
    </div>
  )
}

export default page
