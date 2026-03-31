type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export default function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}
