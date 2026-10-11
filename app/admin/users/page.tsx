"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import AdminPageShell from "../../../component/admin/AdminPageShell";
import AdminRecordRow from "../../../component/admin/AdminRecordRow";
import AdminRecordDetails from "../../../component/admin/AdminRecordDetails";
import { getUserRole } from "../../../lib/auth";
import { getAdminOverview, updateAdminRecord, type AdminRecord, type AdminStatus } from "../../../features/admin/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminRecord | null>(null);
  useEffect(() => { const token = localStorage.getItem("token"); if (!token || getUserRole(token) !== "ADMIN") return void router.push("/auth/login"); getAdminOverview().then((overview) => setUsers(overview.records.users)).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); }, [router]);
  const filtered = useMemo(() => users.filter((item) => `${item.name} ${item.detail} ${item.meta}`.toLowerCase().includes(search.toLowerCase())), [users, search]);
  const updateStatus = async (user: AdminRecord, status: AdminStatus) => { setBusyId(user.id); setError(""); try { await updateAdminRecord("users", user.id, status); setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status } : item)); } catch (e) { setError(e instanceof Error ? e.message : "Could not update user."); } finally { setBusyId(""); } };
  return <AdminPageShell title="Users management" subtitle="Review candidate and client accounts." onLogout={() => { localStorage.removeItem("token"); router.push("/auth/login"); }}><section className="glass-panel rounded-3xl p-5 sm:p-7"><div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs uppercase tracking-[0.3em] text-amber-200">Live users</p><h2 className="mt-2 font-display text-2xl text-white">Users</h2></div><label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-2.5 pl-9 pr-3 text-sm text-white sm:w-64" /></label></div>{error && <p className="py-4 text-sm text-rose-200">{error}</p>}{loading ? <p className="py-10 text-center text-sm text-slate-400">Loading live users...</p> : <div className="divide-y divide-white/10">{filtered.map((item) => <AdminRecordRow key={item.id} record={item} busy={busyId === item.id} onStatusChange={(status) => updateStatus(item, status)} onView={() => setSelectedUser(item)} />)}{filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No users found.</p>}</div>}</section><AdminRecordDetails record={selectedUser} label="Users" onClose={() => setSelectedUser(null)} /></AdminPageShell>;
}