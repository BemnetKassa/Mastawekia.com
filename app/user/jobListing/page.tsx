"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs } from "../../../features/jobListing/api";
import Link from "next/link";
import DOMPurify from "dompurify";
import { getUserRole } from "@/lib/auth";

type DateFilter = "all" | "today" | "week" | "month" | "year";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizeJobs = (data: any) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.jobs)) {
      return data.jobs;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  };

  useEffect(() => {
    getJobs()
      .then((data) => setJobs(normalizeJobs(data)))
      .catch(() => {
        alert("Failed to load jobs.");
      });
  }, []);

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

  }, [router]);

  const handleSearch = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setErrorMessage("");
    setIsSearching(true);

    try {
      const data = await getJobs({
        search: search.trim() || undefined,
        company: company.trim() || undefined,
      });

      setJobs(normalizeJobs(data));
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Search failed. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = async () => {
    setSearch("");
    setCompany("");
    setDateFilter("all");
    setErrorMessage("");
    setIsSearching(true);

    try {
      const data = await getJobs();
      setJobs(normalizeJobs(data));
    } catch {
      setErrorMessage("Failed to reload jobs.");
    } finally {
      setIsSearching(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const rawDate = job.createdAt || job.postedAt;

    if (dateFilter === "all") {
      return true;
    }

    if (!rawDate) {
      return false;
    }

    const postedDate = new Date(rawDate);
    if (Number.isNaN(postedDate.getTime())) {
      return false;
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    if (dateFilter === "week") {
      const daysSinceMonday = (today.getDay() + 6) % 7;
      startDate.setDate(today.getDate() - daysSinceMonday);
    } else if (dateFilter === "month") {
      startDate.setDate(1);
    } else if (dateFilter === "year") {
      startDate.setMonth(0, 1);
    }

    return postedDate >= startDate && postedDate <= today;
  });



  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                Live Listings
              </p>
              <h1 className="font-display text-3xl text-white">Discover new roles</h1>
              <p className="mt-2 text-sm text-slate-300">
                Hand-picked opportunities updated in real time.
              </p>
            </div>
            <Link
              href="/user"
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
            >
              Back to dashboard
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="glass-panel rounded-2xl p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1.1fr_1fr_auto_auto]">
              <label className="space-y-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Role title
                <input
                  placeholder="Search job title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                />
              </label>

              <label className="space-y-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Company
                <input
                  placeholder="Filter by company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                />
              </label>

              <label className="space-y-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Posted date
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                >
                  <option value="all">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={isSearching}
                className="h-12 rounded-2xl bg-amber-400 px-6 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="h-12 rounded-2xl border border-white/15 px-6 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
              >
                Reset
              </button>
            </div>

            {errorMessage && (
              <p className="mt-3 text-sm text-rose-200">{errorMessage}</p>
            )}
          </form>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {filteredJobs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-300">
              {isSearching
                ? "Searching for new roles..."
                : "No job listings found. Try adjusting your search or filter criteria."}
            </div>
          ) : (
            filteredJobs.map((job: any) => (
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
                    Open
                  </span>
                </div>
                <div
                  className="rich-text mt-4 text-sm text-slate-400"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      job.description ||
                      "Explore the full role details and requirements inside the job post."
                    ),
                  }}
                />

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/user/jobListing/${job.id}`}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                  >
                    {job.applications?.length > 0 ? "View application" : "View role & apply"}
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}