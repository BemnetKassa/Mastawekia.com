"use client";

import { useEffect, useState } from "react";
import { getApplications } from "../../../features/apply/getApplications";
import { updateApplicationStatus } from "../../../features/apply/applicationStatus"
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";



type Application = {
  id: string | number;
  job?: { title?: string };
  user?: { email?: string };
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as a client to access the client dashboard.");
      router.push("/auth/login");
      return;
    }
    const role = getUserRole(token);
    if (role !== "CLIENT") {
      alert("Unauthorized access. Please login with a client account.");
      router.push("/auth/login");
      return;
    }

    getApplications()
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.applications)
            ? data.applications
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setApplications(normalized);
      })
      .catch(() => {
        setApplications([]);
        alert("Failed to load applications.");
      });
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-12">

      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Client Studio</p>
          <h1 className="font-display text-3xl text-white">Applications</h1>
          <p className="mt-2 text-sm text-slate-300">
            Review and manage applications from candidates who have applied to your job listings.
          </p>
        </div>

        <a href="/client" className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200">
          back to dashboard
        </a>
      </header>



      <h1 className="text-2xl font-bold my-4">Applications</h1>

      {applications.length === 0 && <p>No applications yet</p>}

      {applications.map((app) => (
        <div key={String(app.id)} className="border p-4 mb-3">
          <p><strong>Job:</strong> {app.job?.title || "N/A"}</p>
          <p><strong>Applicant:</strong> {app.user?.email || "N/A"}</p>
          <button
            onClick={() => {
              alert("Application accepted!");
              updateApplicationStatus(app.id, "ACCEPTED")
            }
            }
            className="bg-green-500 text-white p-2 mr-2"
          >
            Accept
          </button>

          <button
            onClick={() => {
              alert("Application rejected!");
              updateApplicationStatus(app.id, "REJECTED");
            }}
            className="bg-red-500 text-white p-2"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};