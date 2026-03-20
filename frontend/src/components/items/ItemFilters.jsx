export const ItemFilters = ({ filters, onChange }) => (
  <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur md:grid-cols-4">
    <input
      value={filters.keyword}
      onChange={(event) => onChange("keyword", event.target.value)}
      placeholder="Search by title or description"
      className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm outline-none transition focus:border-brand-400"
    />
    <select
      value={filters.category}
      onChange={(event) => onChange("category", event.target.value)}
      className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm outline-none focus:border-brand-400"
    >
      <option value="">All types</option>
      <option value="lost">Lost</option>
      <option value="found">Found</option>
    </select>
    <input
      value={filters.location}
      onChange={(event) => onChange("location", event.target.value)}
      placeholder="Filter by location"
      className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm outline-none transition focus:border-brand-400"
    />
    <select
      value={filters.status}
      onChange={(event) => onChange("status", event.target.value)}
      className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm outline-none focus:border-brand-400"
    >
      <option value="">Any status</option>
      <option value="open">Open</option>
      <option value="resolved">Resolved</option>
    </select>
  </div>
);
