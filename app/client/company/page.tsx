"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "../../../component/shared/DashboardShell";
import { getMyCompanies, createCompany } from "../../../features/company/api";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompany({ name, description });
      alert("Company created!");
      router.push("/client/createJob");
    } catch (error) {
      console.error(error);
      alert("Failed to create company");
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl">
      <h2 className="font-display text-2xl text-white mb-6">Create Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-2">Company Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-white"
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-2">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-white min-h-[120px]"
          />
        </div>
        <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
          Company
        </label>
        {companies.length === 0 ? (
          <p className="text-sm text-amber-400">Please <a href="/client/company">create a company</a> first.</p>
        ) : (
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
          >
            {companies.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
        <button type="submit" className="w-full bg-amber-400 p-4 rounded-2xl text-slate-900 font-semibold">
          Create Company
        </button>
      </form>
    </div>
  );
}