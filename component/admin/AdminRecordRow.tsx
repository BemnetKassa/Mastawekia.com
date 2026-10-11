import { ArrowUpRight, Check, X } from "lucide-react";
import type { AdminRecord, AdminStatus } from "../../features/admin/api";

function statusClasses(status: AdminStatus) {
  if (status === "ACTIVE") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  if (status === "PENDING") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  return "border-rose-300/20 bg-rose-300/10 text-rose-200";
}

type AdminRecordRowProps = {
  record: AdminRecord;
  busy: boolean;
  onStatusChange: (status: AdminStatus) => void;
  onView: () => void;
};

export default function AdminRecordRow({
  record,
  busy,
  onStatusChange,
  onView,
}: AdminRecordRowProps) {
  return (
    <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xs font-semibold text-amber-200">
          {record.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{record.name}</p>
          <p className="mt-1 text-sm text-slate-400">
            {record.detail} · {record.meta}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-600">
            {record.createdAt}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <span className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${statusClasses(record.status)}`}>
          {record.status}
        </span>
        {record.status !== "ACTIVE" && (
          <button
            disabled={busy}
            onClick={() => onStatusChange("ACTIVE")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/20 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-300/10 disabled:opacity-50"
          >
            <Check size={14} /> Approve
          </button>
        )}
        {record.status !== "SUSPENDED" && (
          <button
            disabled={busy}
            onClick={() => onStatusChange("SUSPENDED")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-300/10 disabled:opacity-50"
          >
            <X size={14} /> Suspend
          </button>
        )}
        <button onClick={onView} className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-amber-300/40 hover:text-amber-200">
          View <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
