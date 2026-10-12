import { t } from '../data/strings.js'

export default function AthleteSelect({ athletes, value, onChange }) {
  return (
    <div className="w-full sm:w-80">
      <label htmlFor="athlete-select" className="label">{t.common.selectAthlete}</label>
      <select id="athlete-select" className="field" value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {athletes.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.sport})</option>)}
      </select>
    </div>
  )
}
