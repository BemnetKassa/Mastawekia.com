"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CircleAlert, Clock3, Mail, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardShell from "../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../component/shared/DashboardNav";
import { updateApplicationStatus } from "../../../features/apply/applicationStatus";
import { getApplications } from "../../../features/apply/getApplications";
import { getUserRole } from "../../../lib/auth";

type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | string;

type Application = {
  id: string | number;
  job?: { title?: string };
  user?: { email?: string };
  status?: ApplicationStatus;
};

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/jobs", label: "My jobs" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

const statusStyles: Record<string, string> = {
  PENDING: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  ACCEPTED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  REJECTED: "border-rose-300/20 bg-rose-300/10 text-rose-200",
};

function normalizeApplications(payload: unknown): Application[] {
  const applications =
    Array.isArray(payload)
      ? payload
      : typeof payload === "object" && payload !== null && "applications" in payload
        ? payload.applications
        : typeof payload === "object" && payload !== null && "data" in payload
          ? payload.data
          : [];

  return Array.isArray(applications) ? applications as Application[] : [];
}

function getInitials(email?: string) {
  return email?.slice(0, 2).toUpperCase() || "NA";
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || getUserRole(token) !== "CLIENT") {
      router.push("/auth/login");
      return;
    }

    getApplications()
      .then((payload) => setApplications(normalizeApplications(payload)))
      .catch((requestError: Error) => setError(requestError.message || "Failed to load applications."))
      .finally(() => setLoading(false));
  }, [router]);

  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((application) => !application.status || application.status === "PENDING").length,
    accepted: applications.filter((application) => application.status === "ACCEPTED").length,
  }), [applications]);

  const handleStatusUpdate = async (id: string | number, status: "ACCEPTED" | "REJECTED") => {
    setUpdatingId(id);
    setError("");

    try {
      await updateApplicationStatus(id, status);
      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status } : application,
        ),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update the application.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardShell
      badge="Client studio"
      title="Review your applicants"
      subtitle="Make thoughtful hiring decisions and keep every candidate moving forward."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button
          type="button"
          onClick={() => router.push("/client")}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
        >
          <ArrowLeft size={15} /> Dashboard
        </button>
      }
    >
      <main className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-linear-to-br from-amber-300/20 via-slate-900/75 to-blue-400/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Your candidate inbox</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Find the people who move your work forward.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Review applications across your roles, then accept or reject candidates with a clear next step.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-amber-200/20 bg-amber-200/5" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full border border-blue-300/20" />
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            <CircleAlert size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total applicants", value: counts.total, icon: UserRound, color: "text-white" },
            { label: "Awaiting review", value: counts.pending, icon: Clock3, color: "text-amber-200" },
            { label: "Accepted", value: counts.accepted, icon: Check, color: "text-emerald-200" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-panel relative rounded-2xl p-5">
              <Icon className={`absolute right-5 top-5 ${color} opacity-80`} size={19} />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className={`mt-2 font-display text-3xl ${color}`}>{value}</p>
            </div>
          ))}
        </section>

        {loading && <p className="py-10 text-center text-sm text-slate-400">Loading applications...</p>}

        {!loading && applications.length === 0 && (
          <div className="glass-panel rounded-3xl p-10 text-center">
            <Mail className="mx-auto text-amber-200" size={30} />
            <h2 className="mt-4 font-display text-2xl text-white">No applications yet</h2>
            <p className="mt-2 text-sm text-slate-400">New candidate applications will appear here.</p>
            <button
              type="button"
              onClick={() => router.push("/client/jobs")}
              className="mt-5 rounded-xl border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
            >
              View your jobs
            </button>
          </div>
        )}

        <section className="grid gap-5 xl:grid-cols-2">
          {applications.map((application) => {
            const status = application.status || "PENDING";
            const isUpdating = updatingId === application.id;
            const isFinal = status === "ACCEPTED" || status === "REJECTED";

            return (
              <article key={String(application.id)} className="glass-panel rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-amber-300/25">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 font-display text-sm text-amber-200">
                      {getInitials(application.user?.email)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{application.user?.email || "Candidate"}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{application.user?.email || "No email provided"}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${statusStyles[status] || statusStyles.PENDING}`}>
                    {status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Applied for</p>
                  <p className="mt-2 font-display text-xl text-white">{application.job?.title || "Untitled role"}</p>
                </div>

                {!isFinal && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(application.id, "ACCEPTED")}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check size={15} /> {isUpdating ? "Updating..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(application.id, "REJECTED")}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-300/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-rose-200 transition hover:border-rose-300/60 hover:bg-rose-300/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </DashboardShell>
  );
}
