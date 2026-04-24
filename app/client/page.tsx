'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardShell from "../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../component/shared/DashboardNav";
import ActionCard from "../../component/ui/ActionCard";
import MetricCard from "../../component/ui/MetricCard";
import { getUserRole } from "@/lib/auth";

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
];

const metrics = [
  { label: "Open roles", value: "3", helper: "Jobs currently live" },
  { label: "Applicants", value: "18", helper: "Awaiting review" },
  { label: "Interviews", value: "4", helper: "Scheduled this week" },
];

export default function ClientPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a client to access the client dashboard.");
      router.push("/auth/login");
    }
    const role = getUserRole(token);
    if (role != "CLIENT") {
      alert("Unauthorized access. Please login with a client account.");
      router.push("/auth/login");
    }

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

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
      <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                helper={metric.helper}
              />
            ))}
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-xl text-white">Today&apos;s focus</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Review new applicants for the Product Designer role.</li>
              <li>Publish the updated Senior Engineer listing.</li>
              <li>Share interview notes with the hiring squad.</li>
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-xl text-white">Quick actions</h2>
            <div className="mt-4 space-y-3">
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
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-xl text-white">Hiring tips</h2>
            <p className="mt-3 text-sm text-slate-300">
              Add a clear mission statement and highlight team values to attract
              the right talent faster.
            </p>
          </div>
        </aside>
      </main>
    </DashboardShell>
  );
}
