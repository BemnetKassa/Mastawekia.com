"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getMyCompanies, createCompany } from "../../../features/company/api";
import { getUserRole } from "../../../lib/auth";
import DashboardShell from "../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../component/shared/DashboardNav";
import { Building2, CheckCircle2, Plus, Sparkles } from "lucide-react";

type Company = {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
};

const navLinks: DashboardNavLink[] = [
  { href: "/client", label: "Overview" },
  { href: "/client/createJob", label: "Create job" },
  { href: "/client/applications", label: "Applications" },
  { href: "/client/company", label: "Companies" },
];

export default function CreateCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again to access the client dashboard.");
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
        const normalized = Array.isArray(data)
          ? data
          : data?.companies || data?.data || [];
        setCompanies(normalized);
        if (normalized.length > 0) setCompanyId(String(normalized[0].id));
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load companies.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    try {
      const company = await createCompany({ name: name.trim(), description: description.trim() });
      const createdCompany = company?.company || company?.data || company;
      const nextCompany = createdCompany?.id
        ? createdCompany
        : { id: `local-${Date.now()}`, name: name.trim(), description: description.trim() };

      setCompanies((current) => [...current, nextCompany]);
      setCompanyId(String(nextCompany.id));
      setName("");
      setDescription("");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create company.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCompany = companies.find((company) => String(company.id) === companyId);

  return (
    <DashboardShell
      badge="Client studio"
      title="Build your company presence"
      subtitle="Create and organize the companies behind your hiring work."
      navLabel="Client navigation"
      navLinks={navLinks}
      actions={
        <button
          onClick={() => router.push("/client")}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
        >
          Back to overview
        </button>
      }
    >
      <main className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-linear-to-br from-amber-300/20 via-slate-900/80 to-blue-400/10 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Company workspace</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Give every role a stronger home.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Keep company context close to your job posts so candidates understand who they could join.
            </p>
          </div>
          <Building2 className="absolute right-8 top-8 text-amber-200/50" size={72} strokeWidth={1} />
        </section>

        {errorMessage && (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-300/10 p-4 text-sm text-rose-200">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Your portfolio</p>
                <h2 className="mt-2 font-display text-2xl text-white">Companies</h2>
              </div>
              <span className="text-sm text-slate-400">{companies.length} total</span>
            </div>

            {isLoading ? (
              <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-400">Loading companies...</div>
            ) : companies.length === 0 ? (
              <div className="glass-panel rounded-3xl p-8 text-center">
                <Building2 className="mx-auto text-amber-200" size={30} />
                <h3 className="mt-4 font-display text-xl text-white">Start with your first company</h3>
                <p className="mt-2 text-sm text-slate-400">Create a company profile before publishing a role.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {companies.map((company) => (
                  <button
                    key={String(company.id)}
                    type="button"
                    onClick={() => setCompanyId(String(company.id))}
                    className={`text-left rounded-3xl border p-5 transition ${String(company.id) === companyId ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-slate-900/60 hover:border-amber-300/40"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200"><Building2 size={20} /></span>
                      {String(company.id) === companyId && <CheckCircle2 className="text-emerald-300" size={18} />}
                    </div>
                    <h3 className="mt-5 font-display text-xl text-white">{company.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{company.description || "No company description yet."}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200"><Plus size={20} /></span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Add a company</p>
                  <h2 className="mt-1 font-display text-2xl text-white">Create profile</h2>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Company name
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Northstar Labs" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80" />
                </label>
                <label className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Description
                  <textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does your company build and why does it matter?" className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80" />
                </label>
                <button disabled={isSaving} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">
                  <Plus size={16} /> {isSaving ? "Creating..." : "Create company"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 text-amber-200"><Sparkles size={18} /><span className="text-xs uppercase tracking-[0.25em]">Better job posts</span></div>
              <p className="mt-3 text-sm leading-6 text-slate-300">Add a specific mission, team context, and a clear description to help the right candidates recognize the opportunity.</p>
              {selectedCompany && <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Selected: {selectedCompany.name}</p>}
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}