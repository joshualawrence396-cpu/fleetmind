'use client'

import UnifiedNavigation from '@/components/UnifiedNavigation'

interface PageShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <UnifiedNavigation />

      <div className="relative overflow-hidden bg-slate-950/95 pb-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_25%)]" />
        <main className="relative mx-auto max-w-[1240px] px-6 py-10">
          <div className="rounded-[32px] border border-slate-200/10 bg-slate-900/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Fleetmind SaaS
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-4 text-base leading-8 text-slate-300">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">System</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Live</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Secured</p>
                  <p className="mt-3 text-2xl font-semibold text-white">AES-256</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Support</p>
                  <p className="mt-3 text-2xl font-semibold text-white">24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
