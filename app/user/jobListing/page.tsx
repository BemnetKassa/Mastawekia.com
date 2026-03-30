"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs } from "../../../features/jobListing/api";
import { applyToJob } from "../../../features/apply/applyForJob";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    getJobs().then(setJobs).catch(() => {
      alert("Failed to load jobs.");
    });
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      const res = await applyToJob(jobId);
      alert(res?.message || "Application successful!");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Application failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              Live Listings
            </p>
            <h1 className="font-display text-3xl text-white">Discover new roles</h1>
            <p className="mt-2 text-sm text-slate-300">
              Hand-picked opportunities updated in real time.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
          >
            Logout
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {jobs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-300">
              No jobs yet. Check back soon for fresh openings.
            </div>
          ) : (
            jobs.map((job: any) => (
              <div
                key={job.id}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-amber-300/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-xl text-white group-hover:text-amber-200">
                      {job.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">{job.company}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    New
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  Explore the full role details and requirements inside the job post.
                </p>

                <button
                  onClick={() => handleApply(job.id)}
                  className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}