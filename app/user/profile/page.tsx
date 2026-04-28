'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { DashboardNavLink } from "@/component/shared/DashboardNav";
import { createProfile } from "../../../features/profile/createProfile";
import { getProfile } from "../../../features/profile/getProfile";
import Link from "next/link";


const navLinks: DashboardNavLink[] = [
  { href: "/user", label: "Overview" },
  { href: "/user/jobListing", label: "Job listing" },
  { href: "/user/myApplications", label: "My applications" },
];
const metrics = [
  { label: "Applications", value: "7", helper: "Submitted this month" },
  { label: "Saved roles", value: "5", helper: "Shortlist in progress" },
  { label: "Interviews", value: "2", helper: "Scheduled upcoming" },
];
export default function UserPage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before trying to access the user Profile.");
      router.push("/auth/login");
      return;
    }

    const role = getUserRole(token);

    if (role !== "USER") {
      alert("Unauthorized access. Please login with a user account.");
      router.push("/auth/login");
      return;
    }



    const normalizeProfileData = (data: any) => {
      if (data?.profile) {
        return data.profile;
      }
    }

    setIsLoading(true);
    getProfile()
      .then((data) => setUserData(normalizeProfileData(data)))
      .catch(() => {
        setUserData(null);
        alert("Failed to load profile data.");
      })
      .finally(() => setIsLoading(false));
  }
    , [router]);

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                User Profile
              </p>
              <h1 className="font-display text-3xl text-white">Manage your profile</h1>
              <p className="mt-2 text-sm text-slate-300">
                View and update your profile information to enhance your job search experience.
              </p>
            </div>
            <Link
              href="/user"
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {userData ? (
              <div className="space-y-4">
                <p><strong>Name:</strong> {userData.name}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-300">No profile data available.
                <Link
                  href="/user/profile/update_profile"
                  className="ml-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
                  Update profile
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

