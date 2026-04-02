"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../../../features/createJob/api";

export default function CreateJobPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleSubmit = async () => {
    await createJob({ title, company, description });
    alert("Job created!");
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-100% space-y-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Client Studio</p>
            <h1 className="font-display text-3xl text-white">Create a new job post</h1>
            <p className="mt-2 text-sm text-slate-300">
              Write a role that stands out and attracts the right applicants.
            </p>
          </div>

          <a href="/client" className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
            back to dashboard
          </a>

        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-3xl p-8">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
                Role Title
              </label>
              <input
                placeholder="Senior Product Designer"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              />
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
                Company
              </label>
              <input
                placeholder="Atlas Studio"
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              />
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
                Description
              </label>
              <textarea
                placeholder="Describe the mission, responsibilities, and perks."
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Publish Job
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-xl text-white">Posting checklist</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>Highlight the team and mission in the first sentence.</li>
                <li>Share location, timezone, or flexibility expectations.</li>
                <li>List the top 3 outcomes in the first 90 days.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-xl text-white">Next steps</h2>
              <p className="mt-3 text-sm text-slate-300">
                Once published, the role appears immediately on the public job listing and
                sends a notification to interested candidates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}