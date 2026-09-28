"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../../../features/createJob/api";
import { getMyCompanies } from "../../../features/company/api";
import RichTextEditor from "../../../component/ui/RichTextEditor";
import { getUserRole } from "@/lib/auth";
import DashboardShell from "../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../component/shared/DashboardNav";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Lightbulb } from "lucide-react";

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

export default function CreateJobPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a client to access the client dashboard.");
      router.push("/auth/login");
      return;
    }
    const role = getUserRole(token);
    if (role !== "CLIENT") {
      alert("Unauthorized access. Please login with a client account.");
      router.push("/auth/login");
      return;
    }

    const fetchCompanies = async () => {
      try {
        const data = await getMyCompanies();
        setCompanies(data);
        if (data.length > 0) setCompanyId(data[0].id);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, [router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (!companyId) {
      setErrorMessage("Please select or create a company before publishing.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Add a role title and description before publishing.");
      return;
    }
    setIsPublishing(true);
    try {
      await createJob({ companyId, title: title.trim(), description });
      alert("Job created!");
      router.push("/client");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to publish job.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <DashboardShell
      badge="Client studio"
      title="Create a role worth applying for"
      subtitle="Give the right people enough context to recognize a great opportunity."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button onClick={() => router.push("/client")} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
          <ArrowLeft size={15} /> Dashboard
        </button>
      }
    >
      <main className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-linear-to-br from-amber-300/20 via-slate-900/80 to-blue-400/10 p-6 sm:p-8">
          <div className="relative z-10 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300/15 text-amber-200"><BriefcaseBusiness size={24} /></span>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">New opportunity</p>
              <h2 className="mt-2 font-display text-3xl text-white">Shape the role clearly.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">A specific title, a useful mission, and clear expectations help strong candidates decide faster.</p>
            </div>
          </div>
        </section>

        {errorMessage && <div className="rounded-2xl border border-rose-300/30 bg-rose-300/10 p-4 text-sm text-rose-200">{errorMessage}</div>}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Role details</p>
                <h2 className="mt-2 font-display text-2xl text-white">The opportunity</h2>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Draft</span>
            </div>
            <div className="mt-7 space-y-5">
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
                Role title
                <input required value={title} placeholder="Senior Product Designer" onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80" />
              </label>
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
                Company
                {companies.length === 0 ? (
                  <div className="mt-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">No companies yet. <a href="/client/company" className="underline hover:text-white">Create one first.</a></div>
                ) : (
                  <select value={companyId} onChange={(e) => e.target.value === "CREATE_NEW" ? router.push("/client/company") : setCompanyId(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80">
                    {companies.map((company: any) => <option key={company.id} value={company.id}>{company.name}</option>)}
                    <option value="CREATE_NEW">+ Create a new company</option>
                  </select>
                )}
              </label>
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
                Role description
                <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60"><RichTextEditor value={description} onChange={setDescription} placeholder="Describe the mission, responsibilities, and perks." /></div>
              </label>
            </div>
            <button onClick={handleSubmit} disabled={isPublishing} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
              <CheckCircle2 size={18} /> {isPublishing ? "Publishing..." : "Publish job"}
            </button>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 text-amber-200"><Lightbulb size={18} /><span className="text-xs uppercase tracking-[0.25em]">Posting checklist</span></div>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={16} />Highlight the team mission in the first sentence.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={16} />Share location, timezone, or flexibility expectations.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-1 shrink-0 text-emerald-300" size={16} />List the top outcomes for the first 90 days.</li>
              </ul>
            </div>
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">After publishing</p>
              <h2 className="mt-2 font-display text-xl text-white">Your role goes live immediately.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Candidates can discover the listing and submit applications for your review.</p>
            </div>
          </aside>
        </div>
      </main>
    </DashboardShell>
  );
}