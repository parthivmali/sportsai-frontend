import { t } from '../data/strings.js'

const styles = {
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
  injured: 'bg-red-50 text-red-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-0.5 text-xs font-semibold leading-relaxed ${styles[status]}`}>
      {t.status[status]}
    </span>
  )
}
