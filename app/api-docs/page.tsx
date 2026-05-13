import PageShell from '@/components/PageShell'
import { APIDocumentation } from '@/components/APIDocumentation'

export default function ApiDocsPage() {
  return (
    <PageShell
      title="API Documentation"
      subtitle="Browse and test FleetMind API endpoints with clear request/response examples."
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <APIDocumentation />
      </div>
    </PageShell>
  )
}
