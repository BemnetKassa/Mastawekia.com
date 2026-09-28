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
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

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
    setErrorMessage("");
    setIsApplying(true);
    try {
      if (!coverLetter.trim() || !resumeUrl.trim()) {
        setErrorMessage("Cover letter and resume link are required.");
        setIsApplying(false);
        return;
      }

      const res = await applyToJob({
        jobId: params.id,
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl.trim(),
        portfolioUrl: portfolioUrl.trim() || undefined,
      });
      if (res) {
        alert("Application successful!");
        setJob((prev: any) => ({
          ...prev,
          applications: Array.isArray(prev?.applications)
            ? [...prev.applications, { id: "local" }]
            : [{ id: "local" }],
        }));
      } else {
        setErrorMessage("Application failed. Please try again.");
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Application failed.");
    } finally {
      setIsApplying(false);
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
  const postedDate = job.createdAt || job.postedAt;
  const formattedPostedDate = postedDate
    ? new Date(postedDate).toLocaleDateString()
    : "Date unavailable";
  const applicationCount = Array.isArray(job.applications)
    ? job.applications.length
    : 0;
  const hasApplied = applicationCount > 0;
  const location = job.location || job.workLocation || "Location not specified";
  const employmentType = job.employmentType || job.type || "Full time";

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="glass-panel rounded-3xl p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                Role details
              </p>
              <h1 className="mt-2 font-display text-4xl text-white">{job.title}</h1>
              <p className="mt-2 text-sm text-slate-300">{companyName}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200">
                Open role
              </span>
              <Link
                href="/user/jobListing"
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
              >
                Back to listings
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Posted</p>
              <p className="mt-2 text-sm text-slate-200">{formattedPostedDate}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Work arrangement</p>
              <p className="mt-2 text-sm text-slate-200">{location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Employment</p>
              <p className="mt-2 text-sm text-slate-200">{employmentType}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="glass-panel rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">The opportunity</p>
            <h2 className="mt-2 font-display text-2xl text-white">Role overview</h2>
            <div
              className="rich-text mt-6 text-sm leading-7 text-slate-300"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  job.description || "No description provided."
                ),
              }}
            />
          </section>

          <aside className="space-y-4">
            <section className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Application</p>
              <h2 className="mt-2 font-display text-2xl text-white">
                {hasApplied ? "Application submitted" : "Ready to apply?"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {hasApplied
                  ? "Your application is already attached to this role. You can follow its progress from My Applications."
                  : "Review the role details, then submit your application when you are ready."
                }
              </p>

              {errorMessage && (
                <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-200">
                  {errorMessage}
                </p>
              )}

              {!hasApplied && (
                <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                    Resume link
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={resumeUrl}
                      onChange={(event) => setResumeUrl(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm normal-case tracking-normal text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                    Portfolio link <span className="normal-case tracking-normal text-slate-500">(optional)</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={portfolioUrl}
                      onChange={(event) => setPortfolioUrl(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm normal-case tracking-normal text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                    Cover letter
                    <textarea
                      required
                      rows={7}
                      placeholder="Tell the hiring team why this role is a strong match for you."
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm normal-case tracking-normal text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                    />
                  </label>
                </div>
              )}

              {hasApplied ? (
                <Link
                  href="/user/myApplications"
                  className="mt-6 inline-flex w-full justify-center rounded-2xl bg-slate-700/70 px-4 py-3 text-xs uppercase tracking-[0.25em] text-slate-100 transition hover:bg-slate-700"
                >
                  Track application
                </Link>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="mt-6 w-full rounded-2xl bg-emerald-400 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isApplying ? "Submitting..." : "Submit application"}
                </button>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-xl text-white">Application checklist</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>Review the responsibilities and requirements above.</li>
                <li>Make sure your profile reflects your current experience.</li>
                <li>Track updates in your application dashboard after submitting.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
