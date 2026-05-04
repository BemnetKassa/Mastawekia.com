'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { getProfile } from "../../../features/profile/getProfile";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7,transparent_55%),radial-gradient(circle_at_20%_30%,#dbeafe,transparent_45%),linear-gradient(180deg,#ffffff, #f8fafc)] px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Your Space
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900">
                User Profile
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Keep your profile sharp so employers can see your strengths at a glance.
              </p>
            </div>
            <Link
              href="/user/profile/update_profile"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Manage Profile
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600 shadow-sm">
            <p className="text-lg font-semibold">Loading profile...</p>
            <p className="mt-2 text-sm text-slate-500">Fetching your latest details.</p>
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <p className="text-sm font-semibold">Something went wrong</p>
            <p className="mt-2 text-sm">{errorMessage}</p>
          </div>
        ) : userData ? (
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Skills Snapshot</h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Active
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.isArray(userData.skills) && userData.skills.length > 0 ? (
                  userData.skills.map((skill: string, index: number) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No skills listed yet.</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm font-semibold text-slate-500">Next steps</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Keep it fresh</h3>
              <p className="mt-2 text-sm text-slate-600">
                Update your bio, add new skills, and stay visible to recruiters.
              </p>
              <Link
                href="/user/profile/update_profile"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-amber-300/50 transition hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              No profile found
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Create your profile</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
              Add your bio and skills so employers can match you with the right roles.
            </p>
            <Link
              href="/user/profile/update_profile"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Create Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}