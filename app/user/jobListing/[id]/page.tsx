"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";
import { getJob } from "../../../../features/jobListing/jobApi";
import { applyToJob } from "../../../../features/apply/applyForJob";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again to access the user dashboard.");
      router.push("/auth/login");
      return;
    }

    const loadJob = async () => {
      try {
        const data = await getJob(params.id);
        setJob(data);
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : "Failed to load job.");
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [params.id, router]);

  const handleApply = async () => {
    try {
      const res = await applyToJob(params.id);
      if (res) {
        alert("Application successful!");
        setJob((prev: any) => ({
          ...prev,
          applications: Array.isArray(prev?.applications)
            ? [...prev.applications, { id: "local" }]
            : [{ id: "local" }],
        }));
      } else {
        alert("Application failed. Please try again.");
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Application failed.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-6 py-12 text-slate-200">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen px-6 py-12 text-slate-200">
        Job not found.
      </div>
    );
  }

  const companyName = job.company?.name || job.company || "Company";

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="glass-panel rounded-3xl p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                Role details
              </p>
              <h1 className="font-display text-3xl text-white">{job.title}</h1>
              <p className="mt-2 text-sm text-slate-300">{companyName}</p>
            </div>
            <Link
              href="/user/jobListing"
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
            >
              Back to listings
            </Link>
          </div>
        </header>

        <section className="glass-panel rounded-3xl p-8">
          <h2 className="font-display text-xl text-white">Role overview</h2>
          <div
            className="rich-text mt-4 text-sm text-slate-300"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                job.description || "No description provided."
              ),
            }}
          />
        </section>

        {job.applications?.length > 0 ? (
          <button
            disabled
            className="rounded-full bg-slate-700/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
          >
            Applied
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
