'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJwtPayload, getUserRole } from "@/lib/auth";
import Link from "next/link";

import DashboardShell from "../../../component/shared/DashboardShell";
import type { DashboardNavLink } from "../../../component/shared/DashboardNav";
import { getProfile, normalizeProfile } from "../../../features/profile/getProfile";

const navLinks: DashboardNavLink[] = [
  { href: "/user", label: "Overview" },
  { href: "/user/jobListing", label: "Job listing" },
  { href: "/user/myApplications", label: "My applications" },
  { href: "/user/profile", label: "Profile" },
];

export default function UserProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [accountName, setAccountName] = useState("");
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

    const tokenPayload = decodeJwtPayload(token);
    setAccountName(
      tokenPayload?.name ||
      tokenPayload?.fullName ||
      tokenPayload?.username ||
      tokenPayload?.email ||
      "",
    );

    if (role !== "USER") {
      alert("Unauthorized access.");
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const profile = normalizeProfile(res);

        if (!profile || typeof profile !== "object") {
          setUserData(null);
          return;
        }

        setUserData(profile);
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

  const displayName =
    userData?.name ||
    userData?.fullName ||
    userData?.user?.name ||
    userData?.user?.fullName ||
    [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") ||
    accountName ||
    "Your profile";
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const profileFields = [
    userData?.headline,
    userData?.bio,
    userData?.location,
    userData?.skills?.length,
    userData?.portfolioUrl,
  ];
  const completion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  );

  return (
    <DashboardShell
      badge={displayName}
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
        <main className="space-y-8">
          <section className="glass-panel overflow-hidden rounded-3xl">
            <div className="h-28 bg-linear-to-r from-amber-400/25 via-rose-300/10 to-blue-400/20" />
            <div className="-mt-12 flex flex-col gap-6 px-6 pb-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-slate-950 bg-amber-300 text-3xl font-semibold text-slate-950 shadow-xl">
                  {initials}
                </div>
                <div className="pb-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Professional profile</p>
                  <h1 className="mt-2 font-display text-3xl text-white">{displayName}</h1>
                  <p className="mt-1 text-sm text-slate-300">
                    {userData.headline || "Add a professional headline"}
                  </p>
                </div>
              </div>
              <Link
                href="/user/profile/update_profile"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Edit profile
              </Link>
            </div>
            <div className="grid gap-4 border-t border-white/10 px-6 py-5 text-sm sm:grid-cols-3 sm:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
                <p className="mt-1 text-slate-200">{userData.location || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Experience</p>
                <p className="mt-1 text-slate-200">{userData.experienceYears ?? 0} years</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Availability</p>
                <p className="mt-1 text-emerald-200">{(userData.availability || "OPEN_TO_WORK").replaceAll("_", " ")}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">About</p>
                <h2 className="mt-2 font-display text-2xl text-white">Your professional story</h2>
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {userData.bio || "Add a short introduction to help recruiters understand your strengths."}
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Expertise</p>
                    <h2 className="mt-2 font-display text-2xl text-white">Skills snapshot</h2>
                  </div>
                  <span className="text-sm text-slate-400">{userData.skills?.length || 0} skills</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {Array.isArray(userData.skills) && userData.skills.length > 0 ? userData.skills.map((skill: string, index: number) => (
                    <span key={`${skill}-${index}`} className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-100">
                      {skill}
                    </span>
                  )) : <span className="text-sm text-slate-400">No skills listed yet.</span>}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-white">Profile strength</h2>
                  <span className="font-display text-2xl text-amber-200">{completion}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-amber-300 transition-all" style={{ width: `${completion}%` }} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">Complete your profile so employers can understand your experience at a glance.</p>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Stay discoverable</p>
                <h2 className="mt-2 font-display text-xl text-white">Professional links</h2>
                <div className="mt-5 space-y-3 text-sm">
                  {userData.portfolioUrl && <a href={userData.portfolioUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 px-4 py-3 text-amber-200 transition hover:border-amber-300/50">Portfolio <span className="float-right">↗</span></a>}
                  {userData.linkedinUrl && <a href={userData.linkedinUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 px-4 py-3 text-amber-200 transition hover:border-amber-300/50">LinkedIn <span className="float-right">↗</span></a>}
                  {userData.githubUrl && <a href={userData.githubUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/10 px-4 py-3 text-amber-200 transition hover:border-amber-300/50">GitHub <span className="float-right">↗</span></a>}
                  {!userData.portfolioUrl && !userData.linkedinUrl && !userData.githubUrl && <p className="text-slate-400">No professional links added yet.</p>}
                </div>
              </div>
            </aside>
          </div>
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