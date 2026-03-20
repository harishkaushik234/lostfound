export const SkeletonCard = () => (
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
    <div className="h-56 animate-pulse bg-slate-800/80" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-800/80" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-800/60" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800/60" />
    </div>
  </div>
);
