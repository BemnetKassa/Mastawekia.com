"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, Eye, EyeOff, Users } from "lucide-react";
import DashboardShell from "../../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../../component/shared/DashboardNav";
import { getUserRole } from "../../../../lib/auth";
import { getJob, updateJobPublication } from "../../../../features/jobListing/jobApi";

type JobDetails = {
  id: string;
  title?: string;
  description?: string;
  name?: string;
  detail?: string;
  meta?: string;
  createdAt?: string;
  isPublished?: boolean;
  isActive?: boolean;
  moderationStatus?: string;
  company?: { name?: string } | string;
  companyDetails?: { name?: string };
  applications?: Array<{ id: string; status?: string; user?: { email?: string } }>;
};

function normalizeJob(payload: unknown): JobDetails {
  const source =
    typeof payload === "object" && payload !== null && "job" in payload
      ? (payload as { job?: unknown }).job
      : payload;
  const record =
    typeof source === "object" && source !== null
      ? (source as Record<string, unknown>)
      : {};
  const company = record.company ?? record.companyDetails;
  const rawPublished = record.isPublished ?? record.isActive;
  const isPublished =
    typeof rawPublished === "boolean"
      ? rawPublished
      : typeof rawPublished === "string"
        ? rawPublished.toLowerCase() === "true"
        : undefined;

  return {
    ...(record as JobDetails),
    id: String(record.id ?? ""),
    title: String(record.title ?? record.name ?? ""),
    description: String(record.description ?? record.detail ?? record.meta ?? ""),
    isPublished,
    isActive: isPublished,
    company:
      typeof company === "string"
        ? company
        : typeof company === "object" && company !== null
          ? company as { name?: string }
          : undefined,
    applications: Array.isArray(record.applications)
      ? record.applications as JobDetails["applications"]
      : [],
  };
}

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/jobs", label: "My jobs" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

export default function ClientJobDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || getUserRole(token) !== "CLIENT") {
      router.push("/auth/login");
      return;
    }

    getJob(params.id)
      .then((data) => setJob(normalizeJob(data)))
      .catch((requestError: Error) => setError(requestError.message));
  }, [params.id, router]);

  const activeStatus = job?.isPublished;
  const toggleStatus = async () => {
    if (!job || activeStatus === undefined) return;

    setUpdatingStatus(true);
    setStatusError("");
    try {
      const updated = await updateJobPublication(job.id, !activeStatus);
      const normalizedUpdated = normalizeJob(updated);
      setJob((current) =>
        current
          ? {
              ...current,
              ...normalizedUpdated,
              isPublished: normalizedUpdated.isPublished ?? !activeStatus,
              isActive: normalizedUpdated.isPublished ?? !activeStatus,
            }
          : current,
      );
    } catch (requestError) {
      setStatusError(
        requestError instanceof Error
          ? requestError.message
          : "Could not update the job status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <DashboardShell
      badge="Client studio"
      title={job?.title || "Job details"}
      subtitle="Review the role and its applicant activity."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button
          onClick={() => router.push("/client/jobs")}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 hover:border-amber-300 hover:text-amber-200"
        >
          <ArrowLeft size={15} /> My jobs
        </button>
      }
    >
      {(error || statusError) && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          <CircleAlert size={17} />
          <span>{error || statusError}</span>
        </div>
      )}
      {!job && !error && <p className="py-10 text-center text-sm text-slate-400">Loading job details...</p>}
      {job && (
        <main className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                  {typeof job.company === "string"
                    ? job.company
                    : job.company?.name || job.companyDetails?.name || "Company"}
                </p>
                <h2 className="mt-3 font-display text-3xl text-white">{job.title}</h2>
              </div>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${
                  activeStatus
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                    : activeStatus === false
                      ? "border-slate-300/20 bg-slate-300/10 text-slate-300"
                      : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                }`}
              >
                {activeStatus === undefined
                  ? "Status unavailable"
                  : activeStatus
                    ? "Active"
                    : "Inactive"}
              </span>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Description</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{job.description || "No description provided."}</p>
            </div>
          </article>
          <aside className="glass-panel h-fit rounded-3xl p-6">
            <div className="mb-6 border-b border-white/10 pb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Job status</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {activeStatus === undefined
                  ? "The backend has not provided an active status yet."
                  : activeStatus
                    ? "This job is active and visible to candidates."
                    : "This job is inactive and hidden from candidates."}
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                disabled={activeStatus === undefined || updatingStatus}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-50 ${activeStatus ? "border border-rose-300/20 text-rose-200 hover:bg-rose-300/10" : "bg-amber-400 text-slate-950 hover:bg-amber-300"}`}
              >
                {activeStatus ? <EyeOff size={16} /> : <Eye size={16} />}
                {updatingStatus
                  ? "Updating..."
                  : activeStatus === undefined
                    ? "Status unavailable"
                    : activeStatus
                      ? "Deactivate job"
                      : "Activate job"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-amber-200" size={20} />
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Applications</p>
            </div>
            <p className="mt-3 font-display text-4xl text-white">{job.applications?.length ?? 0}</p>
            <button onClick={() => router.push("/client/applications")} className="mt-6 text-xs uppercase tracking-[0.2em] text-amber-200 hover:text-amber-100">
              Review applications →
            </button>
          </aside>
        </main>
      )}
    </DashboardShell>
  );
}
