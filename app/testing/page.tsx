import PageShell from '@/components/PageShell'
import { AutomatedTesting } from '@/components/AutomatedTesting'

export default function TestingPage() {
  return (
    <PageShell
      title="Automated Testing"
      subtitle="Run automated API and workflow checks across your fleet management system."
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <AutomatedTesting />
      </div>
    </PageShell>
  )
}
