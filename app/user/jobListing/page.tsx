"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs } from "../../../features/jobListing/api";
import { applyToJob } from "../../../features/apply/applyForJob";
import Link from "next/link";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    getJobs().then(setJobs).catch(() => {
      alert("Failed to load jobs.");
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login again to access the user dashboard.");
      router.push("/auth/login");
    }

  }, [router]);

  const handleApply = async (jobId: string) => {
    try {
      const res = await applyToJob(jobId);
      if (res) {
        alert("Application successful!");
        setJobs((prev) =>
          prev.map((job) =>
            String(job.id) === jobId
              ? {
                ...job,
                applications: Array.isArray(job.applications)
                  ? [...job.applications, { id: "local" }]
                  : [{ id: "local" }],
              }
              : job
          )
        );
      }
      else {
        alert("Application failed. Please try again.");
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Application failed.");
    }
  };



  return (
    <div className="min-h-screen px-6 py-12">
      <Link href="/user" className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
        Back to Dashboard
      </Link>
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

                {job.applications?.length > 0 ? (
                  <button disabled className="bg-gray-400 p-2">
                    Applied
                  </button>
                ) : (
                  <button onClick={() => handleApply(String(job.id))} className="bg-blue-500 p-2">
                    Apply
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}