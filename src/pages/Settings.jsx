import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { t } from '../data/strings.js'
import PageHeader from '../components/PageHeader.jsx'

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium leading-relaxed text-slate-800">{label}</label>
        <p className="text-xs leading-relaxed text-slate-500">{hint}</p>
      </div>
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1.5 h-5 w-5 shrink-0 accent-blue-600" />
    </div>
  )
}

export default function Settings() {
  const { displayName, setDisplayName, prefs, setPrefs, notify } = useApp()
  const [name, setName] = useState(displayName)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const v = name.trim()
    if (!v) return setError(t.common.required)
    if (v.length < 2) return setError(t.settings.errName)
    setError('')
    setDisplayName(v)
    setName(v)
    notify(t.settings.nameSaved)
  }

  const setPref = (k) => (val) => setPrefs((p) => ({ ...p, [k]: val }))

  return (
    <>
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card" aria-labelledby="profile-title">
          <h2 id="profile-title" className="mb-4 text-lg font-semibold text-navy-900">{t.settings.profile}</h2>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {displayName.trim().charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-relaxed text-slate-800">{displayName}</p>
              <p className="text-sm leading-relaxed text-slate-500">{t.settings.roleValue}</p>
            </div>
          </div>
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label htmlFor="displayName" className="label">{t.settings.displayName}</label>
              <input
                id="displayName"
                className={`field ${error ? 'field-error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.settings.displayNamePlaceholder}
                aria-invalid={!!error}
                aria-describedby={error ? 'displayName-err' : undefined}
              />
              {error && <p id="displayName-err" className="mt-1 text-xs leading-relaxed text-red-600">{error}</p>}
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs leading-relaxed text-slate-500">{t.settings.role}</dt>
                <dd className="text-sm font-medium leading-relaxed">{t.settings.roleValue}</dd>
              </div>
              <div className="min-w-0 rounded-xl bg-slate-50 p-3">
                <dt className="text-xs leading-relaxed text-slate-500">{t.settings.email}</dt>
                <dd className="break-all text-sm font-medium leading-relaxed">demo@sportsai.example</dd>
              </div>
            </dl>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">{t.common.save}</button>
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="prefs-title">
          <h2 id="prefs-title" className="mb-2 text-lg font-semibold text-navy-900">{t.settings.prefs}</h2>
          <div className="divide-y divide-slate-100">
            <Toggle id="largeFont" label={t.settings.largeFont} hint={t.settings.largeFontHint} checked={prefs.largeFont} onChange={setPref('largeFont')} />
            <Toggle id="compact" label={t.settings.compact} hint={t.settings.compactHint} checked={prefs.compact} onChange={setPref('compact')} />
            <Toggle id="animation" label={t.settings.animation} hint={t.settings.animationHint} checked={prefs.animation} onChange={setPref('animation')} />
          </div>
        </section>
      </div>
    </>
  )
}
