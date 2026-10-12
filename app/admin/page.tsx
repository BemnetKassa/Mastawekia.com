"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import DashboardShell from "../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../component/shared/DashboardNav";
import { getUserRole } from "../../lib/auth";
import {
  getAdminOverview,
  updateAdminRecord,
  type AdminOverview,
  type AdminRecord,
  type AdminSection,
  type AdminStatus,
} from "../../features/admin/api";
import { toast } from "sonner";

const navLinks: DashboardNavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/companies", label: "Companies" },
];

const sectionLabels: Record<AdminSection, string> = {
  jobs: "Jobs",
  applications: "Applications",
  users: "Users",
  companies: "Companies",
};

const metricDefinitions: Array<{
  label: string;
  value: keyof AdminOverview["metrics"];
  helper: string;
  icon: LucideIcon;
  color: string;
}> = [
  { label: "Total users", value: "totalUsers", helper: "12% this month", icon: Users, color: "text-blue-200" },
  { label: "Active jobs", value: "activeJobs", helper: "8 need review", icon: BriefcaseBusiness, color: "text-amber-200" },
  { label: "Applications", value: "applications", helper: "24 today", icon: LayoutDashboard, color: "text-violet-200" },
  { label: "Companies", value: "companies", helper: "6 pending checks", icon: Building2, color: "text-emerald-200" },
];

function statusClasses(status: AdminStatus) {
  if (status === "ACTIVE") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  if (status === "PENDING") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  return "border-rose-300/20 bg-rose-300/10 text-rose-200";
}

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [section, setSection] = useState<AdminSection>("jobs");
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
      .then((overview) => {
        setData(overview);
      })
      .catch((requestError: Error) => {
        setError(requestError.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const records = useMemo(
    () =>
      (data?.records[section] ?? []).filter((record) =>
        `${record.name} ${record.detail} ${record.meta}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data?.records, query, section],
  );

  const changeStatus = async (record: AdminRecord, status: AdminStatus) => {
    setBusyId(record.id);
    setError("");
    setData((current) => current && ({
      ...current,
      records: {
        ...current.records,
        [section]: current.records[section].map((item) =>
          item.id === record.id ? { ...item, status } : item,
        ),
      },
    }));

    if (data) {
      try {
        await updateAdminRecord(section, record.id, status);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Could not update record.");
      }
    }
    setBusyId("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login")
    toast.success("Logged out successfully.");
  };

  return (
    <DashboardShell
      badge="Admin control center"
      title="Keep the marketplace healthy."
      subtitle="One focused workspace for moderation, hiring activity, and platform operations."
      navLabel="Administration"
      navLinks={navLinks}
      actions={
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-rose-300/60 hover:text-rose-200">
          <LogOut size={14} /> Log out
        </button>
      }
    >
      <main className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-linear-to-br from-amber-300/20 via-slate-900/70 to-blue-400/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                <Activity size={13} /> System operational
              </span>
            </div>
            <h2 className="mt-5 font-display text-3xl text-white sm:text-4xl">The decisions that shape every user&apos;s experience.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Review new activity, keep listings trustworthy, and give your support team the context to act quickly.</p>
          </div>
          <ShieldCheck className="absolute -right-4 -top-5 text-amber-200/10" size={220} strokeWidth={1} />
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            <CircleAlert className="mt-0.5 shrink-0" size={17} />
            <span><strong className="font-semibold">Backend connection:</strong> {error}</span>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricDefinitions.map(({ label, value, helper, icon: Icon, color }) => (
            <div key={label} className="glass-panel relative rounded-3xl p-5">
              <Icon className={`absolute right-5 top-5 ${color}`} size={20} />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-3 font-display text-3xl text-white">{data?.metrics[value]?.toLocaleString() ?? "—"}</p>
              <p className="mt-1 text-xs text-slate-400">{helper}</p>
            </div>
          ))}
        </section>

        <section className="glass-panel rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Moderation queue</p>
              <h2 className="mt-2 font-display text-2xl text-white">{sectionLabels[section]} to review</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none focus:border-amber-300/60 sm:w-56" />
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 hover:border-white/20"><SlidersHorizontal size={15} /> Filters <ChevronDown size={14} /></button>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(sectionLabels) as AdminSection[]).map((item) => (
              <button key={item} onClick={() => setSection(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${section === item ? "border-amber-300/60 bg-amber-300/10 text-amber-200" : "border-white/10 text-slate-400 hover:text-white"}`}>
                {sectionLabels[item]}
              </button>
            ))}
          </div>

          <div className="mt-4 divide-y divide-white/10">
            {isLoading && <p className="py-10 text-center text-sm text-slate-400">Loading live admin data...</p>}
            {!isLoading && records.map((record) => (
              <div key={record.id} className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xs font-semibold text-amber-200">{record.name.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{record.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{record.detail} · {record.meta}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-600">{record.createdAt}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <span className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${statusClasses(record.status)}`}>{record.status}</span>
                  {record.status !== "ACTIVE" && <button disabled={busyId === record.id} onClick={() => changeStatus(record, "ACTIVE")} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/20 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-300/10 disabled:opacity-50"><Check size={14} /> Approve</button>}
                  {record.status !== "SUSPENDED" && <button disabled={busyId === record.id} onClick={() => changeStatus(record, "SUSPENDED")} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-300/10 disabled:opacity-50"><X size={14} /> Suspend</button>}
                  <button className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-amber-300/40 hover:text-amber-200">View <ArrowUpRight size={14} /></button>
                </div>
              </div>
            ))}
            {records.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No records match your search.</p>}
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
