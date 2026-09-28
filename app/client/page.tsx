'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardShell from "../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../component/shared/DashboardNav";
import ActionCard from "../../component/ui/ActionCard";
import MetricCard from "../../component/ui/MetricCard";
import { getUserRole } from "@/lib/auth";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Plus, Users } from "lucide-react";
import { getMyCompanies } from "../../features/company/api";
import { getApplications } from "../../features/apply/getApplications";
import { getJobs } from "../../features/jobListing/api";

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

export default function ClientPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    jobs: [] as any[],
    applications: [] as any[],
    companies: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a client to access the client dashboard.");
      router.push("/auth/login");
      return;
    }
    const role = getUserRole(token);
    if (role != "CLIENT") {
      alert("Unauthorized access. Please login with a client account.");
      router.push("/auth/login");
      return;
    }

    Promise.allSettled([getJobs(), getApplications(), getMyCompanies()])
      .then(([jobsResult, applicationsResult, companiesResult]) => {
        const jobs = jobsResult.status === "fulfilled"
          ? (Array.isArray(jobsResult.value) ? jobsResult.value : jobsResult.value?.jobs || jobsResult.value?.data || [])
          : [];
        const applications = applicationsResult.status === "fulfilled"
          ? (Array.isArray(applicationsResult.value) ? applicationsResult.value : applicationsResult.value?.applications || applicationsResult.value?.data || [])
          : [];
        const companies = companiesResult.status === "fulfilled" && Array.isArray(companiesResult.value)
          ? companiesResult.value
          : [];

        setDashboardData({ jobs, applications, companies });
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const pendingApplications = dashboardData.applications.filter(
    (application) => !["ACCEPTED", "REJECTED"].includes(String(application.status || "PENDING").toUpperCase()),
  ).length;
  const metrics = [
    { label: "Open roles", value: String(dashboardData.jobs.length), helper: "Jobs currently live", icon: BriefcaseBusiness },
    { label: "Applicants", value: String(dashboardData.applications.length), helper: "Across your roles", icon: Users },
    { label: "Needs review", value: String(pendingApplications), helper: "Awaiting a decision", icon: CalendarDays },
  ];
  const recentApplications = dashboardData.applications.slice(0, 3);

  return (
    <DashboardShell
      badge="Client studio"
      title="Manage your hiring pipeline"
      subtitle="Track jobs, review applicants, and keep your team aligned."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button
          onClick={handleLogout}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
        >
          Logout
        </button>
      }
    >
      <main className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-linear-to-br from-amber-300/20 via-slate-900/70 to-blue-400/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Hiring command center</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Build the team behind your next chapter.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Keep every open role, candidate conversation, and hiring decision moving from one focused workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/client/createJob" className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300">
                <Plus size={16} /> Create a job
              </a>
              <a href="/client/applications" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
                Review applicants <ArrowUpRight size={16} />
              </a>
              <a href="/client/company" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
                View companies <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-amber-200/20 bg-amber-200/5" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full border border-blue-300/20" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="relative">
                <MetricCard label={metric.label} value={metric.value} helper={metric.helper} />
                <Icon className="absolute right-4 top-4 text-amber-200/70" size={20} />
              </div>
            );
          })}
        </section>

        {isLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
            Refreshing your hiring workspace...
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Pipeline health</p>
                  <h2 className="mt-2 font-display text-2xl text-white">Your hiring flow at a glance</h2>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">On track</span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Applications", String(dashboardData.applications.length), "Across your roles"],
                  ["Needs review", String(pendingApplications), "Awaiting a decision"],
                  ["Companies", String(dashboardData.companies.length), "Available to publish"],
                ].map(([label, value, helper]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                    <p className="mt-3 font-display text-3xl text-white">{value}</p>
                    <p className="mt-1 text-xs text-slate-400">{helper}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Today&apos;s focus</p>
                  <h2 className="mt-2 font-display text-2xl text-white">Keep momentum this week</h2>
                </div>
                <CalendarDays className="text-slate-400" size={22} />
              </div>
              <ul className="mt-6 divide-y divide-white/10 text-sm text-slate-300">
                {[
                  "Review new applicants for the Product Designer role.",
                  "Publish the updated Senior Engineer listing.",
                  "Share interview notes with the hiring squad.",
                ].map((item, index) => (
                  <li key={item} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300/10 text-xs text-amber-200">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Shortcuts</p>
              <h2 className="mt-2 font-display text-2xl text-white">Move work forward</h2>
              <div className="mt-5 space-y-3">
                <ActionCard
                  href="/client/createJob"
                  title="Create a new job"
                  description="Draft a role and publish it in minutes."
                  cta="Start drafting"
                />
                <ActionCard
                  href="/client/applications"
                  title="Review applicants"
                  description="Shortlist the strongest candidates today."
                  cta="Open inbox"
                />
                <ActionCard
                  href="/client/company"
                  title="View companies"
                  description="Explore the list of companies you're working with."
                  cta="Browse companies"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200/20 bg-amber-300/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Hiring note</p>
              <h2 className="mt-2 font-display text-xl text-white">Make the first screen count</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Add a clear mission statement and highlight team values to attract the right talent faster.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </DashboardShell>
  );
}
