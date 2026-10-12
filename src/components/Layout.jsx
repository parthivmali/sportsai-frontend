import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Brain, CheckCircle2, LayoutDashboard, Menu, Settings, Trophy, Users, X } from 'lucide-react'
import { t } from '../data/strings.js'
import { useApp } from '../context/AppContext.jsx'

const links = [
  { to: '/', label: t.nav.dashboard, icon: LayoutDashboard },
  { to: '/athletes', label: t.nav.athletes, icon: Users },
  { to: '/analytics', label: t.nav.analytics, icon: BarChart3 },
  { to: '/insights', label: t.nav.insights, icon: Brain },
  { to: '/settings', label: t.nav.settings, icon: Settings },
]

function Sidebar({ onNavigate }) {
  const { displayName } = useApp()
  return (
    <div className="flex h-full flex-col bg-navy-900 text-slate-200">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Trophy size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-snug text-white">{t.appName}</p>
          <p className="text-xs leading-relaxed text-slate-400">{t.tagline}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label={t.nav.main}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium leading-relaxed transition-colors ${
                isActive ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="m-3 flex items-center gap-3 rounded-xl bg-navy-800 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {displayName.trim().charAt(0) || 'S'}
        </span>
        <p className="min-w-0 break-words text-sm font-medium leading-relaxed text-white">{displayName}</p>
      </div>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { toast } = useApp()
  return (
    <div className="min-h-screen lg:pl-72">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        <button className="btn btn-secondary !px-3" onClick={() => setOpen(true)} aria-label={t.nav.menu}>
          <Menu size={20} aria-hidden="true" />
        </button>
        <p className="text-lg font-bold text-navy-900">{t.appName}</p>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72 max-w-[85vw]">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button
              className="absolute right-2 top-4 rounded-lg p-2 text-slate-300 hover:bg-navy-800"
              onClick={() => setOpen(false)}
              aria-label={t.nav.close}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {toast && (
        <div
          key={toast.key}
          role="status"
          className="fixed bottom-4 left-4 right-4 z-50 flex items-start gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium leading-relaxed text-white shadow-lg sm:left-auto sm:max-w-sm"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}
