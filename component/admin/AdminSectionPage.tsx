"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, CircleAlert, LogOut, Search, X } from "lucide-react";
import DashboardShell from "../shared/DashboardShell";
import type { DashboardNavLink } from "../shared/DashboardNav";
import { getUserRole } from "../../lib/auth";
import {
  getAdminOverview,
  updateAdminRecord,
  type AdminRecord,
  type AdminSection,
  type AdminStatus,
} from "../../features/admin/api";

const navLinks: DashboardNavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/companies", label: "Companies" },
];

const labels: Record<AdminSection, string> = {
  jobs: "Jobs",
  applications: "Applications",
  users: "Users",
  companies: "Companies",
};

function statusClasses(status: AdminStatus) {
  if (status === "ACTIVE") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  if (status === "PENDING") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  return "border-rose-300/20 bg-rose-300/10 text-rose-200";
}

export default function AdminSectionPage({ section }: { section: AdminSection }) {
  const router = useRouter();
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || getUserRole(token) !== "ADMIN") {
      router.push("/auth/login");
      return;
    }

    getAdminOverview()
      .then((overview) => setRecords(overview.records[section]))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [router, section]);

  const filteredRecords = useMemo(
    () =>
      records.filter((record) =>
        `${record.name} ${record.detail} ${record.meta}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, records],
  );

  const changeStatus = async (record: AdminRecord, status: AdminStatus) => {
    setBusyId(record.id);
    setError("");
    try {
      await updateAdminRecord(section, record.id, status);
      setRecords((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, status } : item,
        ),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update record.");
    } finally {
      setBusyId("");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      badge="Admin control center"
      title={`${labels[section]} management`}
      subtitle={`Review and moderate ${labels[section].toLowerCase()} using live backend data.`}
      navLabel="Administration"
      navLinks={navLinks}
      actions={
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-rose-300/60 hover:text-rose-200"
        >
          <LogOut size={14} /> Log out
        </button>
      }
    >
      <main className="glass-panel rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Live moderation queue</p>
            <h2 className="mt-2 font-display text-2xl text-white">{labels[section]}</h2>
          </div>
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${labels[section].toLowerCase()}`}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none focus:border-amber-300/60 sm:w-64"
            />
          </label>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            <CircleAlert className="mt-0.5 shrink-0" size={17} />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 divide-y divide-white/10">
          {isLoading && <p className="py-10 text-center text-sm text-slate-400">Loading live {labels[section].toLowerCase()}...</p>}
          {!isLoading && filteredRecords.map((record) => (
            <div key={record.id} className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xs font-semibold text-amber-200">
                  {record.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{record.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{record.detail} · {record.meta}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-600">{record.createdAt}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${statusClasses(record.status)}`}>
                  {record.status}
                </span>
                {record.status !== "ACTIVE" && (
                  <button
                    disabled={busyId === record.id}
                    onClick={() => changeStatus(record, "ACTIVE")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/20 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-300/10 disabled:opacity-50"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                {record.status !== "SUSPENDED" && (
                  <button
                    disabled={busyId === record.id}
                    onClick={() => changeStatus(record, "SUSPENDED")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-300/10 disabled:opacity-50"
                  >
                    <X size={14} /> Suspend
                  </button>
                )}
                <button className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-amber-300/40 hover:text-amber-200">
                  View <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {!isLoading && filteredRecords.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">No records match your search.</p>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}
