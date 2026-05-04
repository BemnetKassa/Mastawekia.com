'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";

import DashboardShell from "../../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../../component/shared/DashboardNav";
import { createProfile } from "../../../../features/profile/createProfile";
import { getProfile } from "../../../../features/profile/getProfile";

const navLinks: DashboardNavLink[] = [
  { href: "/user", label: "Overview" },
  { href: "/user/jobListing", label: "Job listing" },
  { href: "/user/myApplications", label: "My applications" },
  { href: "/user/profile", label: "Profile" },
];

export default function UpdateProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

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
        const profile = res?.profile || res;

        if (profile) {
          setBio(profile.bio || "");
          setSkills(profile.skills?.join(", ") || "");
        }
      } catch (error: any) {
        console.error(error);
        setErrorMessage("Failed to load profile.");

        if (error?.message === "Unauthorized") {
          router.push("/auth/login");
        }
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      await createProfile({
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });

      alert("Profile saved successfully!");
      router.push("/user/profile");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <DashboardShell
      badge="Candidate space"
      title="Profile studio"
      subtitle="Update your story and highlight the skills you want to use next."
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
      <main className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Your space
          </p>
          <h1 className="mt-3 font-display text-2xl text-white">
            Create or update your profile
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Keep your profile current to increase your chances of being discovered.
          </p>
          <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm font-semibold text-white">What to include</p>
              <p className="mt-2 text-sm text-slate-300">
                Use a short bio and list the skills you want to be hired for.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Formatting tip</p>
              <p className="mt-2 text-sm text-slate-300">
                Add skills as comma-separated words. Example: React, Figma, Node.js
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-white">Profile details</h2>
            <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Editing
            </span>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100 shadow-sm focus:border-amber-300 focus:outline-none"
                rows={5}
                placeholder="Tell recruiters what motivates you."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100 shadow-sm focus:border-amber-300 focus:outline-none"
                placeholder="React, TypeScript, UI Design"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full border border-amber-300/60 px-4 py-3 text-xs uppercase tracking-[0.25em] text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}