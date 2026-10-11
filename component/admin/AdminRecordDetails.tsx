"use client";

import { X } from "lucide-react";
import type { AdminRecord } from "../../features/admin/api";

type AdminRecordDetailsProps = {
  record: AdminRecord | null;
  label: string;
  onClose: () => void;
};

export default function AdminRecordDetails({
  record,
  label,
  onClose,
}: AdminRecordDetailsProps) {
  if (!record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-record-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="glass-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              {label} details
            </p>
            <h2 id="admin-record-details-title" className="mt-2 font-display text-3xl text-white">
              {record.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-full border border-white/10 p-2 text-slate-300 hover:border-white/30 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <Detail label="Status" value={record.status} />
          <Detail label="Created" value={record.createdAt} />
          <Detail label="Related information" value={record.meta} />
          <Detail label="Record ID" value={record.id} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            {label === "Jobs" ? "Description" : "Details"}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
            {record.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm text-slate-200">{value}</p>
    </div>
  );
}
