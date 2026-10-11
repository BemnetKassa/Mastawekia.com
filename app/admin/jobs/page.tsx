"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Search } from "lucide-react";
import AdminPageShell from "../../../component/admin/AdminPageShell";
import AdminRecordRow from "../../../component/admin/AdminRecordRow";
import AdminRecordDetails from "../../../component/admin/AdminRecordDetails";
import { getUserRole } from "../../../lib/auth";
import { getAdminOverview, updateAdminRecord, type AdminRecord, type AdminStatus } from "../../../features/admin/api";
import { useRouter } from "next/navigation";

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [selectedJob, setSelectedJob] = useState<AdminRecord | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || getUserRole(token) !== "ADMIN") {
      router.push("/auth/login");
      return;
    }
    getAdminOverview()
      .then((overview) => setJobs(overview.records.jobs))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredJobs = useMemo(
    () => jobs.filter((job) => `${job.name} ${job.detail} ${job.meta}`.toLowerCase().includes(search.toLowerCase())),
    [jobs, search],
  );

  const updateJobStatus = async (job: AdminRecord, status: AdminStatus) => {
    setBusyId(job.id);
    setError("");
    try {
      await updateAdminRecord("jobs", job.id, status);
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status } : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update job.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminPageShell title="Jobs management" subtitle="Review and moderate live job listings." onLogout={() => { localStorage.removeItem("token"); router.push("/auth/login"); }}>
      <section className="glass-panel rounded-3xl p-5 sm:p-7">
        <SectionHeader label="Live jobs" search={search} onSearch={setSearch} placeholder="Search jobs" />
        <SectionFeedback loading={loading} error={error} empty={!loading && filteredJobs.length === 0} label="jobs" />
        {!loading && <div className="divide-y divide-white/10">{filteredJobs.map((job) => <AdminRecordRow key={job.id} record={job} busy={busyId === job.id} onStatusChange={(status) => updateJobStatus(job, status)} onView={() => setSelectedJob(job)} />)}</div>}
      </section>
      <AdminRecordDetails record={selectedJob} label="Jobs" onClose={() => setSelectedJob(null)} />
    </AdminPageShell>
  );
}

function SectionHeader({ label, search, onSearch, placeholder }: { label: string; search: string; onSearch: (value: string) => void; placeholder: string }) {
  return <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs uppercase tracking-[0.3em] text-amber-200">Live moderation queue</p><h2 className="mt-2 font-display text-2xl text-white">{label}</h2></div><label className="relative block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none focus:border-amber-300/60 sm:w-64" /></label></div>;
}

function SectionFeedback({ loading, error, empty, label }: { loading: boolean; error: string; empty: boolean; label: string }) {
  return <>{loading && <p className="py-10 text-center text-sm text-slate-400">Loading live {label}...</p>}{error && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100"><CircleAlert size={17} /><span>{error}</span></div>}{empty && <p className="py-10 text-center text-sm text-slate-400">No {label} found.</p>}</>;
}