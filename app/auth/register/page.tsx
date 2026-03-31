"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../features/auth/registerApi";
import Link from "next/link";


export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const handleRegister = async () => {
    if (!email || !password || !role) {
      alert("Please fill in all fields.");
      return;
    }

    await registerUser({ email, password, role });
    alert("Registered successfully!");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <Link href="/" className="mb-2 ml-4 border border-white/15 px-2 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
        Back to Home
      </Link>
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel accent-ring rounded-3xl p-8">
          <h2 className="font-display text-2xl text-white">Create your account</h2>
          <p className="mt-2 text-sm text-slate-300">
            Join as a client or job seeker to access tailored tools.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
              Email
            </label>
            <input
              placeholder="you@company.com"
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
              Password
            </label>
            <input
              placeholder="Choose a strong password"
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
              Role
            </label>
            <select
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              value={role}
            >
              <option value="USER">User</option>
              <option value="CLIENT">Client</option>
            </select>
          </div>
          <button
            onClick={handleRegister}
            className="mt-6 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Register
          </button>
          <p className="mt-4 text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-amber-300 hover:text-amber-200">
              Log in
            </Link>
          </p>
        </div>

        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200">
            Join the board
          </span>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Build a profile that feels like a brand.
          </h1>
          <p className="max-w-lg text-sm text-slate-300 sm:text-base">
            Clients can publish roles instantly, while users receive curated roles and
            notifications. You're always one step ahead.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Custom job boards", "Talent shortlists", "Quick approvals", "Insightful analytics"].map(
              (item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}