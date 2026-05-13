import PageShell from '@/components/PageShell'
import { PerformanceMonitoring } from '@/components/PerformanceMonitoring'

export default function MonitoringPage() {
  return (
    <PageShell
      title="Performance Monitoring"
      subtitle="Monitor application health, system metrics, and active alerts in real time."
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <PerformanceMonitoring />
      </div>
    </PageShell>
  )
}
