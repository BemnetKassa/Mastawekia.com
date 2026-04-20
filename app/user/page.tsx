'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardShell from "../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../component/shared/DashboardNav";
import ActionCard from "../../component/ui/ActionCard";
import MetricCard from "../../component/ui/MetricCard";
import { getUserRole } from "../../lib/auth";

const navLinks: DashboardNavLink[] = [
  { href: "/user", label: "Overview" },
  { href: "/user/jobListing", label: "Job listing" },
  { href: "/user/myApplications", label: "My applications" },
];

const metrics = [
  { label: "Applications", value: "7", helper: "Submitted this month" },
  { label: "Saved roles", value: "5", helper: "Shortlist in progress" },
  { label: "Interviews", value: "2", helper: "Scheduled upcoming" },
];

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again to access the user dashboard.");
      router.push("/auth/login");
      return;
    }
    const role = getUserRole(token);
    if (role !== "USER") {
      alert("Unauthorized access. Please login with a user account.");
      router.push("/auth/login");
      return;
    }

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      badge="Candidate space"
      title="Track your next opportunity"
      subtitle="Keep tabs on applications, interviews, and recommended roles."
      navLabel="User navigation"
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
            <h2 className="font-display text-xl text-white">Today&apos;s plan</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>Finish your portfolio update for the UX roles.</li>
              <li>Respond to two recruiter messages.</li>
              <li>Book a time for the upcoming interview round.</li>
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-xl text-white">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <ActionCard
                href="/user/jobListing"
                title="Browse open roles"
                description="Explore listings curated for you."
                cta="View jobs"
              />
              <ActionCard
                href="/landing"
                title="Update your profile"
                description="Add a recent project or new skills."
                cta="Edit profile"
              />
              <ActionCard
                href="/user/myApplications"
                title="Review your applications"
                description="Check the status of your current applications."
                cta="My applications"
              />

            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-xl text-white">Next interview</h2>
            <p className="mt-3 text-sm text-slate-300">
              Prepare answers for collaboration and impact questions ahead of
              Thursday&apos;s panel discussion.
            </p>
          </div>
        </aside>
      </main>
    </DashboardShell>
  );
}