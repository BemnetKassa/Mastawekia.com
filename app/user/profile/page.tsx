'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import Link from "next/link";

import DashboardShell from "../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../component/shared/DashboardNav";
import { getProfile } from "../../../features/profile/getProfile";

const navLinks: DashboardNavLink[] = [
  { href: "/user", label: "Overview" },
  { href: "/user/jobListing", label: "Job listing" },
  { href: "/user/myApplications", label: "My applications" },
  { href: "/user/profile", label: "Profile" },
];

export default function UserProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      router.push("/auth/login");
      return;
    }

    const role = getUserRole(token);

    if (role !== "USER") {
      alert("Unauthorized access.");
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        if (!res || !res.bio) {
          setUserData(null);
          return;
        }

        setUserData(res);
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      badge="Candidate space"
      title="Your profile"
      subtitle="Showcase your skills and keep recruiters up to date."
      navLabel="User navigation"
      navLinks={navLinks}
      actions={
        <button
          onClick={handleLogout}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
        >
          Logout
        </button>
      }
    >
      {isLoading ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-slate-300">
          <p className="text-lg font-semibold text-white">Loading profile...</p>
          <p className="mt-2 text-sm text-slate-400">Fetching your latest details.</p>
        </div>
      ) : errorMessage ? (
        <div className="glass-panel rounded-3xl border border-red-500/30 p-6 text-red-200">
          <p className="text-sm font-semibold text-red-100">Something went wrong</p>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </div>
      ) : userData ? (
        <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-white">Skills snapshot</h2>
                <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                  Active
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.isArray(userData.skills) && userData.skills.length > 0 ? (
                  userData.skills.map((skill: string, index: number) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No skills listed yet.</span>
                )}
              </div>
            </div>
          </section>
          <aside className="space-y-4">
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Next steps
              </p>
              <h3 className="mt-2 font-display text-xl text-white">Keep it fresh</h3>
              <p className="mt-3 text-sm text-slate-300">
                Update your bio, add new skills, and stay visible to recruiters.
              </p>
              <Link
                href="/user/profile/update_profile"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-amber-300/50 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/10"
              >
                Edit Profile
              </Link>
            </div>
          </aside>
        </main>
      ) : (
        <div className="glass-panel rounded-3xl p-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            No profile found
          </p>
          <h2 className="mt-3 font-display text-2xl text-white">Create your profile</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
            Add your bio and skills so employers can match you with the right roles.
          </p>
          <Link
            href="/user/profile/update_profile"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-amber-300/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/10"
          >
            Create Profile
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}