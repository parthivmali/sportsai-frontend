import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Dumbbell, Info, Sparkles, ThumbsUp } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { METRICS } from '../data/athletes.js'
import { metricInsights, sportTips } from '../data/insights.js'
import { t } from '../data/strings.js'
import PageHeader from '../components/PageHeader.jsx'
import AthleteSelect from '../components/AthleteSelect.jsx'

const priorityStyle = {
  high: { label: t.insights.high, box: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-700' },
  medium: { label: t.insights.medium, box: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  low: { label: t.insights.low, box: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
}

function build(athlete) {
  const ranked = [...METRICS].sort((a, b) => athlete[b] - athlete[a])
  const strong = ranked.slice(0, 2)
  const weak = ranked.slice(-2).reverse()
  const priorityOf = (m) => (athlete[m] < 70 ? 'high' : athlete[m] < 80 ? 'medium' : 'low')
  return {
    strengths: strong.map((m) => ({ metric: m, text: metricInsights[m].strength })),
    improve: weak.map((m) => ({ metric: m, text: metricInsights[m].improve, priority: priorityOf(m) })),
    training: [
      ...weak.map((m) => ({ metric: m, text: metricInsights[m].training, priority: priorityOf(m) })),
      { metric: null, text: sportTips[athlete.sport], priority: 'low' },
    ],
  }
}

function Card({ icon: Icon, title, children }) {
  return (
    <section className="card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-900">
        <Icon size={20} className="shrink-0 text-blue-600" aria-hidden="true" />
        <span>{title}</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Item({ metric, text, priority }) {
  const p = priority ? priorityStyle[priority] : { box: 'border-slate-200 bg-slate-50' }
  return (
    <div className={`rounded-xl border p-3 ${p.box}`}>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {metric && <span className="text-sm font-semibold text-slate-800">{t.fields[metric]}</span>}
        {priority && <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold leading-relaxed ${p.badge}`}>{p.label}</span>}
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  )
}

export default function Insights() {
  const { athletes } = useApp()
  const [selectedId, setSelectedId] = useState(athletes[0]?.id)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)
  const athlete = athletes.find((a) => a.id === selectedId) ?? athletes[0]

  useEffect(() => () => clearTimeout(timer.current), [])

  const choose = (id) => {
    clearTimeout(timer.current)
    setLoading(false)
    setResult(null)
    setSelectedId(id)
  }

  const generate = () => {
    setLoading(true)
    setResult(null)
    timer.current = setTimeout(() => {
      setResult({ id: athlete.id, ...build(athlete) })
      setLoading(false)
    }, 700)
  }

  return (
    <>
      <PageHeader title={t.insights.title} subtitle={t.insights.subtitle} />

      <div role="note" className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
        <Info size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>{t.insights.notice}</p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        {athlete && <AthleteSelect athletes={athletes} value={athlete.id} onChange={choose} />}
        <button className="btn btn-primary" onClick={generate} disabled={loading || !athlete}>
          <Sparkles size={18} aria-hidden="true" />
          {loading ? t.insights.generating : t.insights.generate}
        </button>
      </div>

      {loading && <p className="card text-center text-slate-500" role="status">{t.common.loading}…</p>}
      {!loading && !result && <p className="card text-center text-slate-500">{t.insights.empty}</p>}

      {result && result.id === athlete.id && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card icon={ThumbsUp} title={t.insights.strengths}>
            {result.strengths.map((i) => <Item key={i.metric} {...i} />)}
          </Card>
          <Card icon={AlertTriangle} title={t.insights.improve}>
            {result.improve.map((i) => <Item key={i.metric} {...i} />)}
          </Card>
          <Card icon={Dumbbell} title={t.insights.training}>
            {result.training.map((i, n) => <Item key={n} {...i} />)}
          </Card>
        </div>
      )}
    </>
  )
}
