'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function ClientPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to access the client dashboard.")
      router.push("/auth/login");
    }

  })

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  }

  return (
    <div>
      <Link href="/client/createJob" className="min-h-screen px-6 py-12">
        CreateJob
      </Link>
      <Link href="/client/applications" className="min-h-screen px-6 py-12">
        applicants
      </Link>

      <button className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}
