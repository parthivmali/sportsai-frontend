export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="card flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={24} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-slate-500">{label}</p>
        <p className="text-2xl font-bold leading-snug text-navy-900">{value}</p>
      </div>
    </div>
  )
}
