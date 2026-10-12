import { useMemo, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import { METRICS, history, score } from '../data/athletes.js'
import { t } from '../data/strings.js'
import PageHeader from '../components/PageHeader.jsx'
import AthleteSelect from '../components/AthleteSelect.jsx'

const tick = { fontSize: 12, fill: '#475569' }
const colors = { speed: '#2563eb', strength: '#0b1b3a', endurance: '#0891b2', fitness: '#f59e0b' }

export default function Analytics() {
  const { athletes, prefs } = useApp()
  const [selectedId, setSelectedId] = useState(athletes[0]?.id)
  const athlete = athletes.find((a) => a.id === selectedId) ?? athletes[0]

  const data = useMemo(() => {
    if (!athlete) return null
    const peers = athletes.filter((a) => a.sport === athlete.sport)
    const avgOf = (m) => Math.round(peers.reduce((n, a) => n + a[m], 0) / peers.length)
    return {
      series: history(athlete, t.analytics.months),
      compare: METRICS.map((m) => ({ metric: t.fields[m], player: athlete[m], avg: avgOf(m) })),
    }
  }, [athlete, athletes])

  if (!athlete) {
    return (
      <>
        <PageHeader title={t.analytics.title} subtitle={t.analytics.subtitle} />
        <p className="card text-center text-slate-500">{t.common.noData}</p>
      </>
    )
  }

  return (
    <>
      <PageHeader title={t.analytics.title} subtitle={t.analytics.subtitle}>
        <AthleteSelect athletes={athletes} value={athlete.id} onChange={setSelectedId} />
      </PageHeader>

      <section aria-label={t.analytics.metricsTitle} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="card">
          <p className="text-sm leading-relaxed text-slate-500">{t.fields.score}</p>
          <p className="text-3xl font-bold leading-snug text-blue-600">{score(athlete)}</p>
        </div>
        {METRICS.map((m) => (
          <div key={m} className="card">
            <p className="text-sm leading-relaxed text-slate-500">{t.fields[m]}</p>
            <p className="text-3xl font-bold leading-snug text-navy-900">{athlete[m]}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full" style={{ width: `${athlete[m]}%`, background: colors[m] }} />
            </div>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card lg:col-span-2" aria-labelledby="time-title">
          <h2 id="time-title" className="mb-4 text-lg font-semibold text-navy-900">{t.analytics.timeChart} — {athlete.name}</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data.series} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={tick} height={36} />
              <YAxis domain={[0, 100]} tick={tick} width={36} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 12, lineHeight: 1.8 }} />
              {METRICS.map((m) => (
                <Line key={m} type="monotone" dataKey={m} name={t.fields[m]} stroke={colors[m]} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={prefs.animation} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="card" aria-labelledby="cmp-title">
          <h2 id="cmp-title" className="mb-4 text-lg font-semibold text-navy-900">{t.analytics.compareChart}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.compare} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="metric" tick={tick} interval={0} height={36} />
              <YAxis domain={[0, 100]} tick={tick} width={36} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 12, lineHeight: 1.8 }} />
              <Bar dataKey="player" name={athlete.name} fill="#2563eb" radius={[6, 6, 0, 0]} isAnimationActive={prefs.animation} />
              <Bar dataKey="avg" name={`${t.analytics.sportAvg} (${athlete.sport})`} fill="#94a3b8" radius={[6, 6, 0, 0]} isAnimationActive={prefs.animation} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="card" aria-labelledby="radar-title">
          <h2 id="radar-title" className="mb-4 text-lg font-semibold text-navy-900">{t.analytics.radarChart}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.compare} outerRadius="70%">
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={tick} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Radar dataKey="player" name={athlete.name} stroke="#2563eb" fill="#2563eb" fillOpacity={0.35} isAnimationActive={prefs.animation} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </>
  )
}
