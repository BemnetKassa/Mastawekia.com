'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {

      alert("Please login again to access the user dashboard.");
      router.push("/auth/login");
    }

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/auth/login");

  };

  return (
    <div>
      <Link href="/user/jobListing" className="min-h-screen px-6 py-12">
        JobListing
      </Link>

      <button
        onClick={handleLogout}
        className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
      >
        Logout
      </button>
    </div>


  );
}