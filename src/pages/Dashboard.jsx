import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, Layers, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { score } from '../data/athletes.js'
import { t } from '../data/strings.js'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'

const tick = { fontSize: 12, fill: '#475569' }

export default function Dashboard() {
  const { athletes, activities, displayName, prefs } = useApp()

  const { perf, bySport, top, avg, active, categories } = useMemo(() => {
    const scored = athletes.map((a) => ({ ...a, score: score(a) }))
    const sports = [...new Set(scored.map((a) => a.sport))]
    return {
      perf: scored.map((a) => ({ name: a.name, score: a.score })),
      bySport: sports.map((s) => {
        const list = scored.filter((a) => a.sport === s)
        return { sport: s, score: Math.round(list.reduce((n, a) => n + a.score, 0) / list.length) }
      }),
      top: [...scored].sort((a, b) => b.score - a.score).slice(0, 5),
      avg: scored.length ? Math.round(scored.reduce((n, a) => n + a.score, 0) / scored.length) : 0,
      active: scored.filter((a) => a.status === 'active').length,
      categories: sports.length,
    }
  }, [athletes])

  return (
    <>
      <PageHeader title={t.dashboard.title} subtitle={`${t.dashboard.welcome}, ${displayName} — ${t.dashboard.subtitle}`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t.dashboard.total} value={athletes.length} icon={Users} />
        <StatCard label={t.dashboard.active} value={active} icon={Activity} />
        <StatCard label={t.dashboard.categories} value={categories} icon={Layers} />
        <StatCard label={t.dashboard.avg} value={avg} icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card" aria-labelledby="perf-title">
          <h2 id="perf-title" className="mb-4 text-lg font-semibold text-navy-900">{t.dashboard.perfChart}</h2>
          {perf.length ? (
            <ResponsiveContainer width="100%" height={Math.max(260, perf.length * 34 + 40)}>
              <BarChart data={perf} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={tick} />
                <YAxis type="category" dataKey="name" width={118} tick={tick} interval={0} />
                <Tooltip formatter={(v) => [v, t.fields.score]} />
                <Bar dataKey="score" name={t.fields.score} fill="#2563eb" radius={[0, 6, 6, 0]} isAnimationActive={prefs.animation} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-slate-500">{t.common.noData}</p>
          )}
        </section>

        <section className="card" aria-labelledby="sport-title">
          <h2 id="sport-title" className="mb-4 text-lg font-semibold text-navy-900">{t.dashboard.sportChart}</h2>
          {bySport.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bySport} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sport" tick={tick} interval={0} height={36} />
                <YAxis domain={[0, 100]} tick={tick} width={36} />
                <Tooltip formatter={(v) => [v, t.dashboard.avgSport]} />
                <Bar dataKey="score" name={t.dashboard.avgSport} fill="#0b1b3a" radius={[6, 6, 0, 0]} isAnimationActive={prefs.animation} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-slate-500">{t.common.noData}</p>
          )}
        </section>

        <section className="card" aria-labelledby="top-title">
          <h2 id="top-title" className="mb-4 text-lg font-semibold text-navy-900">{t.dashboard.top}</h2>
          {top.length ? (
            <ol className="space-y-3">
              {top.map((a, i) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-relaxed text-slate-800">{a.name}</p>
                    <p className="text-xs leading-relaxed text-slate-500">{a.sport}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{a.score}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-6 text-center text-slate-500">{t.common.noData}</p>
          )}
        </section>

        <section className="card" aria-labelledby="recent-title">
          <h2 id="recent-title" className="mb-4 text-lg font-semibold text-navy-900">{t.dashboard.recent}</h2>
          <ul className="space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-slate-800">{a.text}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
