import { useState } from 'react'
import { METRICS, SPORTS, STATUSES } from '../data/athletes.js'
import { t } from '../data/strings.js'

const empty = { name: '', sport: '', age: '', team: '', status: 'active', speed: '', strength: '', endurance: '', fitness: '' }

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1 text-xs leading-relaxed text-red-600">{error}</p>}
    </div>
  )
}

export default function AthleteForm({ athlete, onSave, onCancel }) {
  const [v, setV] = useState(athlete ?? empty)
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }))
  const cls = (k) => `field ${errors[k] ? 'field-error' : ''}`
  const aria = (k) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  const validate = () => {
    const e = {}
    if (!v.name.trim()) e.name = t.common.required
    else if (v.name.trim().length < 3) e.name = t.athletes.errName
    if (!v.sport) e.sport = t.common.required
    if (v.age === '') e.age = t.common.required
    else if (!(Number(v.age) >= 10 && Number(v.age) <= 50)) e.age = t.athletes.errAge
    if (!v.team.trim()) e.team = t.common.required
    METRICS.forEach((m) => {
      if (v[m] === '') e[m] = t.common.required
      else if (!(Number(v[m]) >= 0 && Number(v[m]) <= 100)) e[m] = t.athletes.errMetric
    })
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    const out = { ...v, name: v.name.trim(), team: v.team.trim(), age: Number(v.age) }
    METRICS.forEach((m) => { out[m] = Number(v[m]) })
    onSave(out)
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="name" label={t.fields.name} error={errors.name}>
            <input id="name" className={cls('name')} value={v.name} onChange={set('name')} placeholder={t.athletes.namePlaceholder} {...aria('name')} />
          </Field>
        </div>
        <Field id="sport" label={t.fields.sport} error={errors.sport}>
          <select id="sport" className={cls('sport')} value={v.sport} onChange={set('sport')} {...aria('sport')}>
            <option value="">{t.common.selectPlaceholder}</option>
            {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field id="age" label={t.fields.age} error={errors.age}>
          <input id="age" type="number" inputMode="numeric" className={cls('age')} value={v.age} onChange={set('age')} placeholder={t.athletes.agePlaceholder} {...aria('age')} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="team" label={t.fields.team} error={errors.team}>
            <input id="team" className={cls('team')} value={v.team} onChange={set('team')} placeholder={t.athletes.teamPlaceholder} {...aria('team')} />
          </Field>
        </div>
        <Field id="status" label={t.fields.status}>
          <select id="status" className="field" value={v.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{t.status[s]}</option>)}
          </select>
        </Field>
      </div>

      <fieldset className="rounded-xl border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-700">{t.athletes.metrics}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {METRICS.map((m) => (
            <Field key={m} id={m} label={t.fields[m]} error={errors[m]}>
              <input id={m} type="number" inputMode="numeric" className={cls(m)} value={v[m]} onChange={set(m)} placeholder={t.athletes.metricPlaceholder} {...aria(m)} />
            </Field>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>{t.common.cancel}</button>
        <button type="submit" className="btn btn-primary">{t.common.save}</button>
      </div>
    </form>
  )
}
