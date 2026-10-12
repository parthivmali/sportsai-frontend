import { useMemo, useState } from 'react'
import { Eye, Pencil, Plus, Search } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { SPORTS, METRICS, score } from '../data/athletes.js'
import { t } from '../data/strings.js'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import AthleteForm from '../components/AthleteForm.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Athletes() {
  const { athletes, saveAthlete, notify, prefs } = useApp()
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState('')
  // modal: null | { mode: 'add' | 'edit' | 'view', athlete? }
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return athletes.filter(
      (a) => (!sport || a.sport === sport) && (!q || a.name.toLowerCase().includes(q) || a.team.toLowerCase().includes(q)),
    )
  }, [athletes, query, sport])

  const onSave = (data) => {
    saveAthlete(data)
    notify(data.id ? t.athletes.updated : t.athletes.added)
    setModal(null)
  }

  const cell = prefs.compact ? 'td !py-1.5' : 'td'

  return (
    <>
      <PageHeader title={t.athletes.title} subtitle={t.athletes.subtitle}>
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
          <Plus size={18} aria-hidden="true" />
          {t.athletes.add}
        </button>
      </PageHeader>

      <section className="card" aria-labelledby="list-title">
        <h2 id="list-title" className="mb-4 text-lg font-semibold text-navy-900">{t.athletes.list}</h2>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              className="field !pl-10"
              placeholder={t.athletes.searchPlaceholder}
              aria-label={t.common.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="field sm:w-60" aria-label={t.athletes.sportFilter} value={sport} onChange={(e) => setSport(e.target.value)}>
            <option value="">{t.common.allSports}</option>
            {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <p className="mb-3 text-sm text-slate-500" aria-live="polite">{t.athletes.count(filtered.length)}</p>

        {filtered.length ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className="th">{t.fields.name}</th>
                  <th className="th">{t.fields.sport}</th>
                  <th className="th">{t.fields.age}</th>
                  <th className="th">{t.fields.team}</th>
                  <th className="th">{t.fields.status}</th>
                  <th className="th">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className={`${cell} font-medium`}>{a.name}</td>
                    <td className={cell}>{a.sport}</td>
                    <td className={cell}>{a.age}</td>
                    <td className={`${cell} min-w-56`}>{a.team}</td>
                    <td className={cell}><StatusBadge status={a.status} /></td>
                    <td className={cell}>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => setModal({ mode: 'view', athlete: a })}>
                          <Eye size={14} aria-hidden="true" />{t.common.viewProfile}
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setModal({ mode: 'edit', athlete: a })} aria-label={`${t.common.edit}: ${a.name}`}>
                          <Pencil size={14} aria-hidden="true" />{t.common.edit}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-10 text-center text-slate-500">{t.common.noData}</p>
        )}
      </section>

      {modal?.mode === 'add' && (
        <Modal title={t.athletes.add} onClose={() => setModal(null)}>
          <AthleteForm onSave={onSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.mode === 'edit' && (
        <Modal title={t.athletes.edit} onClose={() => setModal(null)}>
          <AthleteForm athlete={modal.athlete} onSave={onSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.mode === 'view' && (
        <Modal title={t.athletes.profile} onClose={() => setModal(null)}>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-navy-900">{modal.athlete.name}</h3>
            <StatusBadge status={modal.athlete.status} />
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              [t.fields.sport, modal.athlete.sport],
              [t.fields.age, `${modal.athlete.age} ${t.athletes.years}`],
              [t.fields.team, modal.athlete.team],
              [t.fields.score, score(modal.athlete)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs leading-relaxed text-slate-500">{k}</dt>
                <dd className="font-semibold leading-relaxed text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 space-y-3">
            {METRICS.map((m) => (
              <div key={m}>
                <div className="flex justify-between gap-2 text-sm leading-relaxed">
                  <span>{t.fields[m]}</span>
                  <span className="font-semibold">{modal.athlete[m]}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${modal.athlete[m]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn btn-secondary" onClick={() => setModal(null)}>{t.common.close}</button>
          </div>
        </Modal>
      )}
    </>
  )
}
