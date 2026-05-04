'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "../../../../features/profile/createProfile";
import { getProfile } from "../../../../features/profile/getProfile";
import { getUserRole } from "@/lib/auth";

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#e0f2fe,transparent_55%),radial-gradient(circle_at_90%_10%,#fde68a,transparent_45%),linear-gradient(180deg,#ffffff, #f8fafc)] px-6 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Profile Studio
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Create or update your profile
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Keep your profile current to increase your chances of being discovered.
          </p>
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-800">What to include</p>
              <p className="mt-2 text-sm text-slate-600">
                Use a short bio and list the skills you want to be hired for.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Formatting tip</p>
              <p className="mt-2 text-sm text-slate-600">
                Add skills as comma-separated words. Example: React, Figma, Node.js
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-lg font-bold text-slate-900">Profile details</h2>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                rows={5}
                placeholder="Tell recruiters what motivates you."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder="React, TypeScript, UI Design"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}