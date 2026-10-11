"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  Users,
} from "lucide-react";
import DashboardShell from "../../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../../component/shared/DashboardNav";
import { getUserRole } from "../../../../lib/auth";
import { getJobApplications } from "../../../../features/jobListing/jobApi";

type Application = {
  id: string;
  status?: string;
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  createdAt?: string;
  user?: { email?: string; profile?: { headline?: string } };
};

const statusStyles: Record<string, string> = {
  PENDING: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  REVIEWING: "border-sky-300/20 bg-sky-300/10 text-sky-200",
  SHORTLISTED: "border-violet-300/20 bg-violet-300/10 text-violet-200",
  ACCEPTED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  REJECTED: "border-rose-300/20 bg-rose-300/10 text-rose-200",
};

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/jobs", label: "My jobs" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

function resolveFileUrl(value?: string) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl) return value;

  return `${apiUrl}/${value.replace(/^\//, "")}`;
}

function normalizeApplications(payload: unknown): Application[] {
  const applications =
    Array.isArray(payload)
      ? payload
      : typeof payload === "object" && payload !== null && "applications" in payload
        ? (payload as { applications?: unknown }).applications
        : [];

  return Array.isArray(applications)
    ? applications.filter(
        (application): application is Application =>
          typeof application === "object" &&
          application !== null &&
          "id" in application,
      )
    : [];
}

function JobApplicationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (value?: string) =>
    value
      ? new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(value))
      : "Date unavailable";

  const getInitials = (email?: string) =>
    (email?.slice(0, 2) || "CA").toUpperCase();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || getUserRole(token) !== "CLIENT") {
      router.push("/auth/login");
      return;
    }

    if (!jobId) {
      setError("A job ID is required to review applications.");
      setLoading(false);
      return;
    }

    getJobApplications(jobId)
      .then((payload) => setApplications(normalizeApplications(payload)))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [jobId, router]);

  return (
    <DashboardShell
      badge="Client studio"
      title="Job applications"
      subtitle="Review candidates who applied to this job."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button
          type="button"
          onClick={() => router.push(jobId ? `/client/jobs/${jobId}` : "/client/jobs")}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 hover:border-amber-300 hover:text-amber-200"
        >
          <ArrowLeft size={15} /> Back to job
        </button>
      }
    >
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          <CircleAlert size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && <p className="py-10 text-center text-sm text-slate-400">Loading applications...</p>}

      {!loading && !error && applications.length === 0 && (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <Users className="mx-auto text-amber-200" size={30} />
          <h2 className="mt-4 font-display text-2xl text-white">No applications yet</h2>
          <p className="mt-2 text-sm text-slate-400">Applications for this job will appear here.</p>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total applicants</p>
            <p className="mt-2 font-display text-3xl text-white">{applications.length}</p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Awaiting review</p>
            <p className="mt-2 font-display text-3xl text-amber-200">
              {applications.filter((application) => !application.status || application.status === "PENDING").length}
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shortlisted</p>
            <p className="mt-2 font-display text-3xl text-violet-200">
              {applications.filter((application) => application.status === "SHORTLISTED").length}
            </p>
          </div>
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        {applications.map((application) => (
          <article key={application.id} className="glass-panel rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-amber-300/25">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 font-display text-sm text-amber-200">
                  {getInitials(application.user?.email)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {application.user?.email || "Candidate"}
                  </p>
                  {application.user?.profile?.headline && (
                    <p className="mt-1 truncate text-xs text-slate-400">{application.user.profile.headline}</p>
                  )}
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${statusStyles[application.status || "PENDING"] || statusStyles.PENDING}`}>
                {(application.status || "PENDING").replace("_", " ")}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 border-y border-white/10 py-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Mail size={13} /> {application.user?.email || "No email"}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> Applied {formatDate(application.createdAt)}</span>
            </div>
            {application.coverLetter && (
              <div className="mt-5">
                <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <FileText size={14} /> Cover letter
                </p>
                <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {application.coverLetter}
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {application.resumeUrl && (
                <a href={resolveFileUrl(application.resumeUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-200">
                  <FileText size={14} /> Resume <ExternalLink size={12} />
                </a>
              )}
              {application.portfolioUrl && (
                <a href={resolveFileUrl(application.portfolioUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-200">
                  <Globe size={14} /> Portfolio <ExternalLink size={12} />
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}

export default function JobApplicationsPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-slate-400">Loading applications...</p>}>
      <JobApplicationsPageContent />
    </Suspense>
  );
}