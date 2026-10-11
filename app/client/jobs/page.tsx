"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BriefcaseBusiness, CircleAlert, Plus, Search } from "lucide-react";
import DashboardShell from "../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../component/shared/DashboardNav";
import { getUserRole } from "../../../lib/auth";
import { getJobs } from "../../../features/jobListing/api";

type ClientJob = {
  id: string;
  title?: string;
  description?: string;
  company?: string;
  createdAt?: string;
  isPublished?: boolean;
  applications?: unknown[];
};

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/jobs", label: "My jobs" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

function normalizeJobs(payload: unknown): ClientJob[] {
  const jobs = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && "jobs" in payload
      ? (payload.jobs as unknown)
      : [];

  if (!Array.isArray(jobs)) return [];

  return jobs.map((job) => {
    if (typeof job !== "object" || job === null) return { id: "" };

    const record = job as Record<string, unknown>;
    const rawPublished = record.isPublished ?? record.isActive;
    return {
      ...(record as ClientJob),
      isPublished:
        typeof rawPublished === "boolean"
          ? rawPublished
          : typeof rawPublished === "string"
            ? rawPublished.toLowerCase() === "true"
            : undefined,
    };
  });
}

export default function ClientJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<ClientJob[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || getUserRole(token) !== "CLIENT") {
      router.push("/auth/login");
      return;
    }

    getJobs()
      .then((payload) => setJobs(normalizeJobs(payload)))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        `${job.title ?? ""} ${job.description ?? ""} ${job.company ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [jobs, search],
  );

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      badge="Client studio"
      title="Your job listings"
      subtitle="Review every role you have published and keep your hiring pipeline moving."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button
          onClick={logout}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
        >
          Log out
        </button>
      }
    >
      <main className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Your roles</p>
            <p className="mt-2 text-sm text-slate-400">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"} owned by your account
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your jobs"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none focus:border-amber-300/60 sm:w-64"
              />
            </label>
            <button
              onClick={() => router.push("/client/createJob")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-amber-300"
            >
              <Plus size={15} /> Create job
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            <CircleAlert size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && <p className="py-10 text-center text-sm text-slate-400">Loading your jobs...</p>}

        {!loading && filteredJobs.length === 0 && (
          <div className="glass-panel rounded-3xl p-10 text-center">
            <BriefcaseBusiness className="mx-auto text-amber-200" size={30} />
            <h2 className="mt-4 font-display text-2xl text-white">
              {jobs.length === 0 ? "You have not created a job yet." : "No jobs match your search."}
            </h2>
            {jobs.length === 0 && (
              <button onClick={() => router.push("/client/createJob")} className="mt-5 rounded-xl bg-amber-400 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-amber-300">
                Publish your first job
              </button>
            )}
          </div>
        )}

        <section className="grid gap-5 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <article key={job.id} className="glass-panel rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-amber-300/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200">{job.company || "Company"}</p>
                  <h2 className="mt-2 font-display text-2xl text-white">{job.title || "Untitled job"}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em] ${
                  job.isPublished === undefined
                    ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                    : job.isPublished
                      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                      : "border-slate-300/20 bg-slate-300/10 text-slate-300"
                }`}>
                  {job.isPublished === undefined
                    ? "Status unavailable"
                    : job.isPublished
                      ? "Active"
                      : "Inactive"}
                </span>
              </div>
              <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-300">
                {job.description || "No description was added to this job."}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>{job.applications?.length ?? 0} applications</span>
                {job.createdAt && <span>{new Date(job.createdAt).toLocaleDateString()}</span>}
              </div>
              <button
                onClick={() => router.push(`/client/jobs/${job.id}`)}
                className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-200 hover:text-amber-100"
              >
                View job details <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
        </section>
      </main>
    </DashboardShell>
  );
}
