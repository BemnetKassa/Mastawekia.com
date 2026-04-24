'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { getMyApplications } from "../../../features/apply/getMyApplications";
import Link from "next/link";

type Application = {
  id: string | number;
  status?: string;
  createdAt?: string;
  job?: {
    title?: string;
    company?: string;
  };
};

const statusClassMap: Record<string, string> = {
  PENDING: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  ACCEPTED: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
  REJECTED: "border-rose-300/40 bg-rose-300/10 text-rose-200",
};

export default function MyApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizeApplications = (data: unknown): Application[] => {
    if (Array.isArray(data)) {
      return data;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "applications" in data &&
      Array.isArray((data as { applications?: unknown[] }).applications)
    ) {
      return (data as { applications: Application[] }).applications;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      Array.isArray((data as { data?: unknown[] }).data)
    ) {
      return (data as { data: Application[] }).data;
    }

    return [];
  };

  const getStatusStyles = (status?: string) => {
    const normalized = (status || "PENDING").toUpperCase();
    return statusClassMap[normalized] || statusClassMap.PENDING;
  };

  const formatDate = (rawDate?: string) => {
    if (!rawDate) {
      return "Date unavailable";
    }

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a user to access the user dashboard.");
      router.push("/auth/login");
      return;
    }
    const role = getUserRole(token);
    if (role !== "USER") {
      alert("Unauthorized access. Please login with a user account.");
      router.push("/auth/login");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    getMyApplications()
      .then((data) => {
        setApplications(normalizeApplications(data));
      })
      .catch(() => {
        setErrorMessage("Failed to load applications. Please try again.");
        setApplications([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                Application Tracker
              </p>
              <h1 className="font-display text-3xl text-white">My Applications</h1>
              <p className="mt-2 text-sm text-slate-300">
                Stay updated on every role you applied for and monitor your status at a glance.
              </p>
            </div>
            <Link
              href="/user"
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-300/40 bg-rose-300/10 p-4 text-sm text-rose-200">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-300 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-300">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <h2 className="font-display text-2xl text-white">No applications yet</h2>
            <p className="mt-3 text-sm text-slate-300">
              You have not applied to any roles. Start exploring listings to submit your first application.
            </p>
            <Link
              href="/user/jobListing"
              className="mt-5 inline-flex rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <section className="mx-auto max-w-6xl grid gap-4 md:grid-cols-2 ">
            {applications.map((app) => {
              const status = (app.status || "PENDING").toUpperCase();

              return (
                <article
                  key={String(app.id)}
                  className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-amber-300/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-xl text-white group-hover:text-amber-200">
                        {app.job?.title || "Untitled Job"}
                      </h2>
                      <p className="mt-2 text-sm text-slate-300">
                        {app.job?.company || "Company undisclosed"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${getStatusStyles(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Application ID</span>
                    <span className="text-slate-300">#{app.id}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Submitted</span>
                    <span className="text-slate-300">{formatDate(app.createdAt)}</span>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
