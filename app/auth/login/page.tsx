"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../features/auth/loginApi";
import Link from "next/link";
import { getUserRole } from "../../../lib/auth";



export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });

      if (typeof res?.access_token !== "string") {
        throw new Error("Login response is missing access token.");
      }

      localStorage.setItem("token", res.access_token);
      alert("Logged in successfully!");

      const role = getUserRole(res.access_token);
      if (!role) {
        throw new Error("Unable to determine user role from token.");
      }
      else if (role === "CLIENT") {
        router.push("/client");
      }
      else if (role === "USER") {
        router.push("/user");
      }
    } catch (err: any) {
      // 🔥 THIS IS THE KEY PART
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen px-6 py-12">
      <Link href="/" className="mb-4 mx-4o inline-block rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
        Back to Home
      </Link>
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200">
            Talent Portal
          </span>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Welcome back. Let's land the right role.
          </h1>
          <p className="max-w-lg text-sm text-slate-300 sm:text-base">
            Sign in to publish jobs, review applications, and manage opportunities in one
            focused workspace.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 px-4 py-2">
              Fast client onboarding
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              Real-time job updates
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              Curated listings
            </span>
          </div>
        </div>

        <div className="glass-panel accent-ring rounded-3xl p-8">
          <h2 className="font-display text-2xl text-white">Log in</h2>
          <p className="mt-2 text-sm text-slate-300">
            Use the same credentials you registered with.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
              Email
            </label>
            <input
              placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
            />
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              />
              <button
                type="button"
                onClick={() => setshowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-200"
              >
                {showPassword ? "🙈" : "👁️"}

              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-xs text-slate-400">
            New here?{" "}
            <Link href="/auth/register" className="text-amber-300 hover:text-amber-200">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}